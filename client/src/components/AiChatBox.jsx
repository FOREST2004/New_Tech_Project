import { useState, useRef, useEffect } from "react";
import { chatStream } from "../services/aiService";

export default function AiChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const aiMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const chatMessages = [
        {
          role: "system",
          content:
            "Bạn là trợ lý AI thông minh cho hệ thống quản lý sự kiện. Hãy trả lời một cách hữu ích và thân thiện.",
        },
        ...messages,
        userMessage,
      ];

      await chatStream(chatMessages, (token) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessageIndex = newMessages.length - 1;
          if (newMessages[lastMessageIndex]?.role === "assistant") {
            // Tạo object mới thay vì mutate trực tiếp
            newMessages[lastMessageIndex] = {
              ...newMessages[lastMessageIndex],
              content: newMessages[lastMessageIndex].content + token,
            };
          }
          return newMessages;
        });
      });
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
          lastMessage.error = true;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h3>
        </div>
        <button
          onClick={clearChat}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Xóa chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>Xin chào! Tôi là AI Assistant. Hãy hỏi tôi bất cứ điều gì!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : message.error
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === "assistant" &&
                isLoading &&
                index === messages.length - 1 && (
                  <div className="flex items-center mt-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={1}
            placeholder="Nhập tin nhắn của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Gửi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
