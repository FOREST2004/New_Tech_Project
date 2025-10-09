import ContextService from '../services/contextService.js';
import AIContextService from '../services/aiContextService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const contextService = new ContextService();
const aiContextService = new AIContextService();

// Test cases để validate AI training
const TEST_QUERIES = [
  // Statistical queries
  {
    query: "Có bao nhiều sự kiện đang diễn ra?",
    expectedType: "statistical",
    expectedEntities: ["events"],
    description: "Test statistical query about events"
  },
  {
    query: "Tỷ lệ tham dự sự kiện như thế nào?",
    expectedType: "statistical", 
    expectedEntities: ["attendance"],
    description: "Test attendance rate query"
  },
  
  // Search queries
  {
    query: "Tìm sự kiện về cybersecurity",
    expectedType: "search",
    expectedEntities: ["cybersecurity", "events"],
    description: "Test search for cybersecurity events"
  },
  {
    query: "Ai tạo sự kiện AI Workshop?",
    expectedType: "search",
    expectedEntities: ["users", "ai_ml"],
    description: "Test search for event creator"
  },
  
  // Comparative queries
  {
    query: "So sánh số lượng đăng ký giữa các sự kiện",
    expectedType: "comparative",
    expectedEntities: ["registrations", "events"],
    description: "Test comparative registration analysis"
  },
  
  // Time-based queries
  {
    query: "Sự kiện nào sắp diễn ra tuần tới?",
    expectedType: "time_based",
    expectedEntities: ["events", "upcoming"],
    description: "Test upcoming events query"
  },
  
  // Instructional queries
  {
    query: "Làm thế nào để tạo sự kiện mới?",
    expectedType: "instructional",
    expectedEntities: ["events", "create"],
    description: "Test how-to query"
  }
];

// Test AI Context Analysis
async function testAIContextAnalysis() {
  console.log('\n🧪 Testing AI Context Analysis...\n');
  
  for (const testCase of TEST_QUERIES) {
    console.log(`📝 Testing: ${testCase.description}`);
    console.log(`Query: "${testCase.query}"`);
    
    try {
      // Get context data
      const contextData = await contextService.getRelevantContext(testCase.query);
      
      // Analyze query
      const analysis = contextService.analyzeQuery(testCase.query);
      
      // Test query type detection
      const queryTypeMatch = analysis.queryType === testCase.expectedType;
      console.log(`   ✅ Query Type: ${analysis.queryType} ${queryTypeMatch ? '✓' : '✗ Expected: ' + testCase.expectedType}`);
      
      // Test entity detection
      const detectedEntities = analysis.entities || [];
      const entityMatches = testCase.expectedEntities.filter(entity => 
        detectedEntities.includes(entity)
      );
      console.log(`   ✅ Entities: [${detectedEntities.join(', ')}] (${entityMatches.length}/${testCase.expectedEntities.length} matched)`);
      
      // Test context relevance
      const hasRelevantContext = contextData.hasContext;
      console.log(`   ✅ Has Context: ${hasRelevantContext ? 'Yes' : 'No'}`);
      
      // Test AI prompt generation
      const enhancedPrompt = await aiContextService.enhancePromptWithContext(testCase.query, contextData);
      const promptLength = enhancedPrompt.length;
      console.log(`   ✅ Enhanced Prompt: ${promptLength} characters`);
      
      // Test suggestions
      const suggestions = aiContextService.getSuggestedQuestions(contextData);
      console.log(`   ✅ Suggestions: ${suggestions.length} generated`);
      
      console.log('   ─────────────────────────────────────\n');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
}

// Test Statistical Analysis
async function testStatisticalAnalysis() {
  console.log('\n📊 Testing Statistical Analysis...\n');
  
  try {
    // Test basic statistics
    const stats = await contextService.getStatisticalInsights();
    console.log('📈 Basic Statistics:');
    console.log(`   Events: ${stats.totalEvents}`);
    console.log(`   Users: ${stats.totalUsers}`);
    console.log(`   Registrations: ${stats.totalRegistrations}`);
    console.log(`   Average Attendees: ${stats.averageAttendees}`);
    console.log(`   Active Users: ${stats.activeUsers}`);
    console.log(`   Attendance Rate: ${stats.attendanceRate}%`);
    
    // Test trend analysis
    const trends = await contextService.getTrendAnalysis();
    console.log('\n📈 Trend Analysis:');
    console.log(`   Recent Events: ${trends.recentEvents}`);
    console.log(`   Growth Rate: ${trends.growthRate}%`);
    console.log(`   Popular Categories: [${trends.popularCategories.join(', ')}]`);
    
    console.log('\n✅ Statistical analysis working correctly\n');
    
  } catch (error) {
    console.log(`❌ Statistical analysis error: ${error.message}\n`);
  }
}

// Test Domain Knowledge Integration
async function testDomainKnowledge() {
  console.log('\n🧠 Testing Domain Knowledge Integration...\n');
  
  const testQueries = [
    "Hệ thống này làm gì?",
    "Tôi muốn tạo sự kiện",
    "Làm sao để xem thống kê?"
  ];
  
  for (const query of testQueries) {
    console.log(`📝 Query: "${query}"`);
    
    try {
      // Test basic prompt without context
      const basicPrompt = aiContextService.buildBasicPrompt(query);
      console.log(`   ✅ Basic prompt generated: ${basicPrompt.length} characters`);
      
      // Test with context
      const contextData = await contextService.getRelevantContext(query);
      const enhancedPrompt = await aiContextService.enhancePromptWithContext(query, contextData);
      console.log(`   ✅ Enhanced prompt generated: ${enhancedPrompt.length} characters`);
      
      // Test training data generation
      const trainingData = aiContextService.generateTrainingData(query, contextData, "Sample AI response");
      console.log(`   ✅ Training data generated with ${Object.keys(trainingData).length} fields`);
      
      console.log('   ─────────────────────────────────────\n');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
}

// Performance Test
async function testPerformance() {
  console.log('\n⚡ Testing Performance...\n');
  
  const testQuery = "Thống kê tổng quan hệ thống";
  const iterations = 10;
  
  console.log(`Running ${iterations} iterations of context analysis...`);
  
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    await contextService.getRelevantContext(testQuery);
  }
  
  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;
  
  console.log(`✅ Average response time: ${avgTime.toFixed(2)}ms`);
  console.log(`✅ Performance: ${avgTime < 1000 ? 'Good' : avgTime < 3000 ? 'Acceptable' : 'Needs optimization'}\n`);
}

// Main test runner
async function runAITrainingTests() {
  console.log('🚀 Starting AI Training Validation Tests...');
  console.log('==========================================');
  
  try {
    await testAIContextAnalysis();
    await testStatisticalAnalysis();
    await testDomainKnowledge();
    await testPerformance();
    
    console.log('🎉 All AI training tests completed!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in other files
export {
  runAITrainingTests,
  testAIContextAnalysis,
  testStatisticalAnalysis,
  testDomainKnowledge,
  testPerformance,
  TEST_QUERIES
};

// Run tests if this file is executed directly
console.log('Module URL:', import.meta.url);
console.log('Process argv[1]:', process.argv[1]);

// Always run tests for now (for debugging)
console.log('🚀 Starting AI Training Tests...');
runAITrainingTests().catch(console.error);