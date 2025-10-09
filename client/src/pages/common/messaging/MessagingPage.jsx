import React from 'react';
import MessageList from '../../../components/common/messaging/MessageList';
import './MessagingPage.css';

const MessagingPage = () => {
  return (
    <div className="messaging-page">
      <div className="messaging-page-container">
        <MessageList />
      </div>
    </div>
  );
};

export default MessagingPage;