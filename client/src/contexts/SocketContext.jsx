import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    
    if (token && currentUser.id) {
      const newSocket = io(import.meta.env.VITE_API_BASE, {
        auth: {
          token
        },
        reconnection: true,
        forceNew: true 
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        
        newSocket.emit('join-user', currentUser.id);
        
    
        if (currentUser.organizationId) {
          newSocket.emit('join-organization', currentUser.organizationId);
        } else {
          console.log('⚠️ No organizationId found - admin will not receive org notifications!');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason, 'at', new Date().toISOString());
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error, 'at', new Date().toISOString());
        setIsConnected(false);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts at', new Date().toISOString());
        setIsConnected(true);
        
        
        console.log('🔄 Re-joining rooms after reconnection...');
        newSocket.emit('join-user', currentUser.id);
        if (currentUser.organizationId) {
          newSocket.emit('join-organization', currentUser.organizationId);
        }
      });

      newSocket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Reconnection attempt #', attemptNumber, 'at', new Date().toISOString());
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('❌ Reconnection error:', error, 'at', new Date().toISOString());
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed completely at', new Date().toISOString());
      });

      
      const handleVisibilityChange = () => {
        console.log('👁️ Page visibility changed:', document.hidden ? 'HIDDEN' : 'VISIBLE', 'at', new Date().toISOString());
        if (document.hidden) {
          console.log('⚠️ Page is now hidden - socket may disconnect soon');
        } else {
          console.log('✅ Page is now visible - checking socket status:', newSocket.connected);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      setSocket(newSocket);

      return () => {
        console.log('🧹 Cleaning up socket connection at', new Date().toISOString());
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        newSocket.close();
      };
    } else {
      console.log('❌ No token or user ID - socket not created');
    }
  }, []);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};