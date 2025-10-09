import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import messageService from '../../../services/messageService';
import './MessageBox.css';

const MessageBox = ({ isOpen, onClose, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser && isOpen) {
      loadConversation();
    }
  }, [selectedUser, isOpen]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', handleNewMessage);
      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, selectedUser]);

  const handleNewMessage = (message) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Hiển thị tin nhắn nếu:
    // 1. User hiện tại gửi cho selectedUser (message.senderId === currentUser.id && message.receiverId === selectedUser.id)
    // 2. selectedUser gửi cho user hiện tại (message.senderId === selectedUser.id && message.receiverId === currentUser.id)
    if (selectedUser && currentUser.id && 
        ((message.senderId === currentUser.id && message.receiverId === selectedUser.id) ||
         (message.senderId === selectedUser.id && message.receiverId === currentUser.id))) {
      
      // Kiểm tra xem message đã tồn tại chưa để tránh duplicate
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === message.id);
        if (messageExists) {
          return prev;
        }
        return [...prev, message];
      });
    }
  };

  const loadConversation = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversation(selectedUser.id);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải cuộc trò chuyện:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await messageService.sendMessage(selectedUser.id, newMessage.trim());
      if (response.success) {
        // Không cần thêm message vào state ở đây vì WebSocket sẽ handle
        // setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      // Nếu có lỗi, có thể hiển thị thông báo cho user
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="message-box-overlay">
      <div className="message-box">
        <div className="message-box-header">
          <div className="user-info">
            <img 
              src={selectedUser?.avatarUrl ? `/images/${selectedUser.avatarUrl}` : '/default-avatar.png'} 
              alt={selectedUser?.fullName}
              className="user-avatar"
            />
            <span className="user-name">{selectedUser?.fullName || selectedUser?.email}</span>
          </div>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="messages-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.senderId === selectedUser.id ? 'received' : 'sent'}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={sendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBox;