// Simple test to check if AI services are working
import ContextService from '../services/contextService.js';
import AIContextService from '../services/aiContextService.js';

console.log('🧪 Starting Simple AI Test...');

async function simpleTest() {
  try {
    console.log('1. Creating service instances...');
    const contextService = new ContextService();
    const aiContextService = new AIContextService();
    console.log('✅ Services created successfully');

    console.log('\n2. Testing query analysis...');
    const testQuery = "Có bao nhiều sự kiện đang diễn ra?";
    const analysis = contextService.analyzeQuery(testQuery);
    console.log('✅ Query analysis:', analysis);

    console.log('\n3. Testing context retrieval...');
    const contextData = await contextService.getRelevantContext(testQuery);
    console.log('✅ Context retrieved:', {
      hasContext: contextData.hasContext,
      eventsCount: contextData.context?.events?.length || 0,
      usersCount: contextData.context?.users?.length || 0
    });

    console.log('\n4. Testing AI prompt enhancement...');
    const enhancedResult = await aiContextService.enhancePromptWithContext(testQuery);
    console.log('✅ Enhanced prompt result:', {
      hasPrompt: !!enhancedResult.enhancedPrompt,
      promptLength: enhancedResult.enhancedPrompt?.length || 0,
      hasContext: enhancedResult.hasContext
    });

    console.log('\n5. Testing suggestions...');
    const suggestions = aiContextService.getSuggestedQuestions(contextData);
    console.log('✅ Suggestions:', suggestions);

    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

simpleTest();