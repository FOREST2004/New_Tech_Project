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
    if (selectedUser && isOpen) {
      // Bỏ phần load tin nhắn cũ, chỉ reset về trống
      setMessages([]);
      setLoading(false);
    }
  }, [selectedUser, isOpen]);

  useEffect(() => {
    if (selectedUser && isOpen) {
      // Bỏ phần load tin nhắn cũ, chỉ reset messages về empty
      setMessages([]);
      setLoading(false);
    }
  }, [selectedUser, isOpen]);

  useEffect(() => {
    if (selectedUser && isOpen) {
      // Bỏ phần load tin nhắn cũ, chỉ reset về trống
      setMessages([]);
      setLoading(false);
    }
  }, [selectedUser, isOpen]);

  // Có thể bỏ luôn hàm loadConversation này nếu không dùng
  // const loadConversation = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await messageService.getConversation(selectedUser.id);
  //     
  //     // Xử lý response format từ server
  //     if (response.success && response.data) {
  //       // response.data đã là array messages từ server
  //       const messagesData = Array.isArray(response.data) ? response.data : [];
  //       setMessages(messagesData);
  //       console.log('Loaded messages:', messagesData); // Debug log
  //     } else {
  //       console.warn('API response indicates failure:', response);
  //       setMessages([]);
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi tải cuộc trò chuyện:', error);
  //     setMessages([]); // Đảm bảo messages luôn là array khi có lỗi
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    
    // Sửa logic kiểm tra: so sánh với currentUser.id thay vì selectedUser.id
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
      
      // Xử lý response format từ server
      if (response.success && response.data) {
        // response.data đã là array messages từ server
        const messagesData = Array.isArray(response.data) ? response.data : [];
        setMessages(messagesData);
        console.log('Loaded messages:', messagesData); // Debug log
      } else {
        console.warn('API response indicates failure:', response);
        setMessages([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải cuộc trò chuyện:', error);
      setMessages([]); // Đảm bảo messages luôn là array khi có lỗi
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
              {Array.isArray(messages) && messages.length > 0 ? (
                // Trong phần render messages
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.senderId === JSON.parse(localStorage.getItem('currentUser') || '{}').id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">Chưa có tin nhắn nào</div>
              )}
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