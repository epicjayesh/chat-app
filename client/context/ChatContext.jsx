import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // GET USERS
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // GET MESSAGES
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // SEND MESSAGE
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // SOCKET SUBSCRIBE
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setMessages((prev) => [...prev, newMessage]);

        try {
          await axios.put(`/api/message/mark/${newMessage._id}`);
        } catch (err) {
          console.log(err.message);
        }
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};