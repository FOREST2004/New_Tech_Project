import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { notificationService } from "../services/common/notification/notificationService.js";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // States để quản lý thông tin notification
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState(null);
  const [notificationTrigger, setNotificationTrigger] = useState(0);



  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

 


  const triggerNotificationRefresh = useCallback(() => {
    setNotificationTrigger((prev) => prev + 1);
  }, []);



  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (token && currentUser.id) {
      const newSocket = io(import.meta.env.VITE_API_BASE, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        
        setIsConnected(true);

        newSocket.emit("join-user", currentUser.id);

        if (currentUser.organizationId) {
          newSocket.emit("join-organization", currentUser.organizationId);
        }

        fetchUnreadCount();
      });




      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error);
        setIsConnected(false);
      });

     



      newSocket.on("organization-notification", (data) => {
   
        setLastNotification({
          ...data,
          timestamp: Date.now(),
          type: "organization-notification",
        });

    
        if (window.showToast) {
          window.showToast("info", "Thông báo tổ chức", data.title);
        }

     
        fetchUnreadCount();
        triggerNotificationRefresh();
      });

      
      newSocket.on("notification-read", (data) => {
        setUnreadCount(data.unreadCount);
        triggerNotificationRefresh();
      });

   
      newSocket.on("all-notifications-read", (data) => {
        setUnreadCount(data.unreadCount);
        triggerNotificationRefresh();
      });

     
      newSocket.on("new-notification", (data) => {
        setUnreadCount(data.unreadCount);
        setLastNotification({
          ...data,
          timestamp: Date.now(),
          type: "new-notification",
        });
        triggerNotificationRefresh();
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [fetchUnreadCount, triggerNotificationRefresh]);




  const value = {
    socket,
    isConnected,
    
    unreadCount,
    lastNotification,
    notificationTrigger,
    
    fetchUnreadCount,
    triggerNotificationRefresh,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
