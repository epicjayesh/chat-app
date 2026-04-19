import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 text-white ${selectedUser ? "max-md:hidden" : ""}`}>
      
      {/* HEADER */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative group">
            <img src={assets.menu_icon} alt="menu" className="max-h-5 cursor-pointer" />

            <div className="absolute top-full right-0 hidden group-hover:block bg-[#282142] p-4 rounded-md">
              <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm">
                Edit Profile
              </p>
              <hr className="my-2 border-gray-600" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="mt-5 p-2 w-full bg-[#282142] rounded-md outline-none text-sm"
          placeholder="Search user..."
        />
      </div>

      {/* USERS LIST */}
      <div className="flex flex-col gap-2">
        {filteredUsers.length === 0 && (
          <p className="text-sm text-gray-400">No users found</p>
        )}

        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                isSelected ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={user.profilePic || assets.avatar_icon}
                alt="user"
                className="w-8 h-8 rounded-full"
              />

              <div className="flex-1">
                <p className="text-sm">{user.fullName}</p>
                <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {unseenMessages[user._id] > 0 && (
                <span className="text-xs bg-violet-500 px-2 py-1 rounded-full">
                  {unseenMessages[user._id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;