import { useState } from 'react';
import AiChatBox from '../components/AiChatBox';

export default function AiPlayground() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tương tác với AI Assistant thông minh của chúng tôi. Hỏi bất cứ điều gì về quản lý sự kiện, 
            lập kế hoạch, hoặc bất kỳ chủ đề nào bạn quan tâm!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              💬 Chat với AI
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'features'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ✨ Tính năng
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'chat' && (
            <div className="space-y-6">
            
              <AiChatBox />
            </div>
          )}

          {activeTab === 'features' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                🎯 Tính năng AI Assistant
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Tư vấn sự kiện</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Nhận lời khuyên chuyên nghiệp về lập kế hoạch và tổ chức sự kiện
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-300">📝</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Tạo nội dung</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Tự động tạo mô tả sự kiện, email mời và nội dung marketing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-300">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Gợi ý thông minh</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Đề xuất tags, danh mục và cải thiện cho sự kiện của bạn
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 dark:text-orange-300">📊</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Phân tích dữ liệu</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Tóm tắt thông tin đăng ký và phân tích xu hướng sự kiện
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-300">🤝</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Hỗ trợ 24/7</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Trả lời câu hỏi và hỗ trợ bạn bất cứ lúc nào
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-300">🌐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Đa ngôn ngữ</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Hỗ trợ tiếng Việt và nhiều ngôn ngữ khác
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🚀 Powered by Gemma-3-270M
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  AI Assistant được hỗ trợ bởi model Gemma-3-270M-IT-GGUF tiên tiến, 
                  mang đến trải nghiệm chat thông minh và tự nhiên.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}