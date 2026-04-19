import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatComponent = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    await sendMessage({ text: input.trim(), image: selectedImage });
    setInput("");
    setSelectedImage(null);
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="user"
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-6">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === authUser?._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwn && (
                <img
                  src={selectedUser.profilePic || assets.avatar_icon}
                  alt="user"
                  className="w-7 rounded-full"
                />
              )}

              {msg.image ? (
                <div className="max-w-[230px] rounded-lg overflow-hidden bg-violet-500/30 p-2">
                  <img
                    src={msg.image}
                    alt="chat"
                    className="w-full rounded-lg"
                  />
                </div>
              ) : (
                <p className="p-2 max-w-[200px] text-sm rounded-lg bg-violet-500/30 text-white break-words">
                  {msg.text}
                </p>
              )}

              {isOwn && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt="me"
                  className="w-7 rounded-full"
                />
              )}

              <span className="text-xs text-gray-400 ml-1">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage}
              alt="preview"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 bg-transparent outline-none text-white"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            hidden
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="upload"
              className="w-5 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatComponent;