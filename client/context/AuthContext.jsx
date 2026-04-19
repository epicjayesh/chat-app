import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backend = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backend;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // LOGIN / SIGNUP
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    axios.defaults.headers.common["token"] = null;

    socket?.disconnect();
    setSocket(null);

    toast.success("Logged out successfully");
  };

  // UPDATE PROFILE
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // SOCKET CONNECT
  const connectSocket = (userData) => {
    if (!userData) return;

    // Disconnect existing socket first
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(backend, {
      query: {
        userId: userData._id,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  // Initial auth check and token setup
  useEffect(() => {
    if (!backend) {
      console.error("VITE_BACKEND_URL not defined");
      return;
    }

    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  // Handle socket connection when authUser changes
  useEffect(() => {
    if (authUser) {
      connectSocket(authUser);
    }

    return () => {
      // Cleanup: disconnect socket when unmounting or authUser changes
      socket?.disconnect();
    };
  }, [authUser]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};