/**
 * LangChain Agent 流程圖
 *
 * 此模組匯出主要 Agent，並透過 LangChain 的 createAgent 建立。
 * Agent 底層使用 LangGraph，支援：
 * - 工具調用
 * - 串流回覆
 * - 自訂中介層
 * - 人工審核流程
 */

import { createAgent } from 'langchain';
import { TOOLS } from './tools.js';
import { SYSTEM_PROMPT } from './prompts.js';

/**
 * 主要 Agent 實例。
 *
 * createAgent 會負責模型、工具與提示詞的整合，並在 LangGraph 上執行。
 */
export const agent = createAgent({
  // 使用的模型，格式為 provider:model。
  // 會從環境變數讀取 ANTHROPIC_API_KEY 或 OPENAI_API_KEY。
  model: 'openai:gpt-5.4-mini',

  // Agent 可使用的工具。
  tools: TOOLS,

  // 定義 Agent 行為的系統提示詞。
  systemPrompt: SYSTEM_PROMPT,

  // 可選：加入中介層以支援進階流程。
  // middleware: [
  //   summarizationMiddleware({
  //     model: 'anthropic:claude-haiku-4-5',
  //     trigger: { tokens: 4000 },
  //   }),
  //   humanInTheLoopMiddleware({
  //     interruptOn: { sensitive_tool: { allowedDecisions: ['approve', 'reject'] } },
  //   }),
  // ],
});
