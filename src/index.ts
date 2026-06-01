/**
 * LangChain Agent 本地執行入口。
 *
 * 使用 `pnpm start` 可在命令列測試 Agent。
 */

import 'dotenv/config';
import { agent } from './agent.js';

console.log('AI Agent 已啟動\n');
console.log('你可以詢問我：');
console.log('  - 基本計算');
console.log('  - 目前時間');
console.log('  - 天氣資訊（模擬資料）');
console.log('  - 知識庫內容\n');

const questions = [
  '現在是什麼時間？',
  '台灣現在天氣如何？',
  '請計算 50 * 50 + 50',
];

for (const question of questions) {
  console.log(`使用者：${question}\n`);

  try {
    const result = await agent.invoke({
      messages: [{ role: 'user', content: question }],
    });

    console.log(`Agent：${result.messages.at(-1)?.content}\n`);
    console.log('-'.repeat(50) + '\n');
  } catch (error) {
    console.error('執行錯誤：', error);
  }
}
