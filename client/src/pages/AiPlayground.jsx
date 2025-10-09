import AiChatBox from '../components/AiChatBox';

export default function AiPlayground() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Playground
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Interact with our intelligent AI Assistant. Ask anything about event management, 
            planning, or any topic you're interested in!
          </p>
        </div>

        {/* AI Chat */}
        <div className="max-w-4xl mx-auto">
          <AiChatBox />
        </div>
      </div>
    </div>
  );
}