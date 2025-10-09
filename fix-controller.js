import fs from 'fs';

const content = fs.readFileSync('./controllers/ai.controller.js', 'utf8');

const fixed = content
  .replace(/createEnhancedPrompt/g, 'enhancePromptWithContext')
  .replace(/hasRelevantData/g, 'hasContext')
  .replace('hasRelevantData: aiContextService.hasRelevantData(context)', 'hasRelevantData: context.hasContext || false');

fs.writeFileSync('./controllers/ai.controller.js', fixed, 'utf8');
console.log('✅ AI Controller fixed!');