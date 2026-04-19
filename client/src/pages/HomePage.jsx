import React, { useContext } from "react";
import Sidebar from "../component/Sidebar.jsx";
import RightSidebar from "../component/RightSidebar.jsx";
import ChatContainer from "../component/ChatContainer.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen sm:px-[10%] sm:py-[3%]">
      <div
        className={`grid h-full backdrop-blur-xl border border-gray-600 rounded-xl overflow-hidden ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;