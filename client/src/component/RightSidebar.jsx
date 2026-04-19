import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);

    setMsgImages(images);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      {/* USER INFO */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="user"
          className="w-20 aspect-square rounded-full"
        />

        <h1 className="px-10 text-xl font-medium flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser.fullName}
        </h1>

        <p className="px-10 text-center">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* MEDIA */}
      <div className="px-5 text-xs">
        <p>Media</p>

        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img src={url} alt="media" className="rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm border-none font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;