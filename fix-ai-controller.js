import fs from 'fs';

const filePath = './controllers/ai.controller.js';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace method calls
  content = content.replace(/createEnhancedPrompt/g, 'enhancePromptWithContext');
  content = content.replace(/hasRelevantData/g, 'hasContext');
  
  // Fix specific line in getContextInfo
  content = content.replace(
    'hasRelevantData: aiContextService.hasRelevantData(context)',
    'hasRelevantData: context.hasContext || false'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed AI Controller successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
}