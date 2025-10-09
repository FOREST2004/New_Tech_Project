import React, { useState, useEffect } from 'react';
import messageService from '../../../services/messageService';
import MessageBox from './MessageBox';
import './MessageList.css';

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    loadConversations();
    loadOrganizationMembers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải cuộc trò chuyện:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizationMembers = async () => {
    try {
      setMembersLoading(true);
      const response = await messageService.getOrganizationMembers();
      if (response.members) {
        // Lọc bỏ user hiện tại khỏi danh sách
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const filteredMembers = response.members.filter(member => member.id !== currentUser.id);
        setOrganizationMembers(filteredMembers);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách members:', error);
    } finally {
      setMembersLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await messageService.searchUsers(searchQuery);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
    }
  };

  const openMessageBox = (user) => {
    setSelectedUser(user);
    setIsMessageBoxOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeMessageBox = () => {
    setIsMessageBoxOpen(false);
    setSelectedUser(null);
    loadConversations(); // Reload conversations after closing
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="message-list-container">
      <div className="message-list-header">
        <h2>Tin nhắn</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="message-list-content">
        {searchQuery.trim().length >= 2 ? (
          <div className="search-results">
            <h3>Kết quả tìm kiếm</h3>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div 
                  key={user.id} 
                  className="user-item"
                  onClick={() => openMessageBox(user)}
                >
                  <img 
                    src={user.avatarUrl ? `/images/${user.avatarUrl}` : '/default-avatar.png'} 
                    alt={user.fullName}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-name">{user.fullName || user.email}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">Không tìm thấy người dùng nào</div>
            )}
          </div>
        ) : (
          <div className="conversations">
            {/* Hiển thị cuộc trò chuyện đã có */}
            {loading ? (
              <div className="loading">Đang tải cuộc trò chuyện...</div>
            ) : conversations.length > 0 ? (
              <>
                <h3>Cuộc trò chuyện gần đây</h3>
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.other_user_id} 
                    className="conversation-item"
                    onClick={() => openMessageBox({
                      id: conversation.other_user_id,
                      fullName: conversation.full_name,
                      email: conversation.email,
                      avatarUrl: conversation.avatar_url
                    })}
                  >
                    <img 
                      src={conversation.avatar_url ? `/images/${conversation.avatar_url}` : '/default-avatar.png'} 
                      alt={conversation.full_name}
                      className="user-avatar"
                    />
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <div className="user-name">{conversation.full_name || conversation.email}</div>
                        <div className="message-time">{formatTime(conversation.last_message_time)}</div>
                      </div>
                      <div className="last-message">
                        {conversation.last_message}
                        {conversation.unread_count > 0 && (
                          <span className="unread-badge">{conversation.unread_count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {/* Hiển thị danh sách members cùng tổ chức */}
            <div className="organization-members">
              <h3>Members trong tổ chức</h3>
              {membersLoading ? (
                <div className="loading">Đang tải danh sách members...</div>
              ) : organizationMembers.length > 0 ? (
                organizationMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="user-item"
                    onClick={() => openMessageBox({
                      id: member.id,
                      fullName: member.fullName,
                      email: member.email,
                      avatarUrl: member.avatarUrl
                    })}
                  >
                    <img 
                      src={member.avatarUrl ? `/images/${member.avatarUrl}` : '/default-avatar.png'} 
                      alt={member.fullName}
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <div className="user-name">{member.fullName || member.email}</div>
                      <div className="user-email">{member.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-members">Không có members nào trong tổ chức</div>
              )}
            </div>

            {conversations.length === 0 && organizationMembers.length === 0 && !loading && !membersLoading && (
              <div className="no-conversations">
                <p>Chưa có cuộc trò chuyện nào</p>
                <p>Chọn một member để bắt đầu nhắn tin</p>
              </div>
            )}
          </div>
        )}
      </div>

      <MessageBox 
        isOpen={isMessageBoxOpen}
        onClose={closeMessageBox}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default MessageList;