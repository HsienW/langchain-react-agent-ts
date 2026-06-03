# LangChain-ReAct-Agent

[![pnpm](https://img.shields.io/badge/package%20manager-pnpm-F69220?logo=pnpm)](https://pnpm.io/)
[![LangChain License](https://img.shields.io/github/license/langchain-ai/langchainjs)](https://github.com/langchain-ai/langchainjs/blob/main/LICENSE)
[![LangChain](https://img.shields.io/badge/LangChain-JS-1C3C3C)](https://js.langchain.com/)
[![Source](https://img.shields.io/badge/source-langchain--ai%2Freact--agent--js-1C3C3C)](https://github.com/langchain-ai/react-agent-js)

這是一個使用 **LangChain** 與 `createAgent` 建立 AI Agent 的 TypeScript 專案。它聚焦模型呼叫、工具調用、系統提示詞、LangGraph 整合與 LangSmith 追蹤。並僅作為個人使用🚀🚀

## 功能

- **LangChain API**：使用 `createAgent` 快速建立 Agent。
- **Tools**：提供計算、目前時間、模擬天氣與知識庫搜尋範例。
- **Middleware**：中介層可加入對話摘要、人工審核等進階流程。
- **TypeScript**：搭配 Zod schema，讓工具參數具備型別約束。
- **LangGraph Studio**：可視覺化檢查 Agent 流程。
- **LangSmith 整合**：可追蹤模型呼叫、工具執行、token 與延遲。

## 快速開始

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
```

在 `.env` 填入至少一組模型供應商 API key：

```bash
# Claude 模型
ANTHROPIC_API_KEY=your-key-here

# 或 OpenAI 模型
OPENAI_API_KEY=your-key-here
```

### 3. 執行 Agent

```bash
pnpm start
```

也可以使用 LangGraph Studio 開啟此專案資料夾，檢查 Agent 的流程與狀態。

## 專案結構

```txt
src/
├── agent.ts      # Agent 組裝入口
├── tools.ts      # 工具定義與 Zod schema
├── prompts.ts    # 系統提示詞與替代提示詞
└── index.ts      # 本地 CLI 測試入口
```

## 自訂 Agent

### 新增工具

在 `src/tools.ts` 使用 `tool` 建立工具：

```typescript
import { tool } from "langchain";
import { z } from "zod";

const myTool = tool(
  async ({ query }) => {
    // 在這裡放入實際工具邏輯
    return `查詢結果：${query}`;
  },
  {
    name: "my_tool",
    description: "根據查詢文字回傳對應結果。",
    schema: z.object({
      query: z.string().describe("查詢文字"),
    }),
  }
);

export const TOOLS = [myTool, ...otherTools];
```

### 更換模型

在 `src/agent.ts` 調整 `model`：

```typescript
export const agent = createAgent({
  model: "openai:gpt-5.4-mini",
  tools: TOOLS,
  systemPrompt: SYSTEM_PROMPT,
});
```

如果改用 Anthropic 模型，請確認 `.env` 已設定 `ANTHROPIC_API_KEY`。

### 加入中介層

LangChain 支援中介層，可用來加入摘要、人工審核等流程：

```typescript
import {
  createAgent,
  humanInTheLoopMiddleware,
  summarizationMiddleware,
} from "langchain";

export const agent = createAgent({
  model: "openai:gpt-5.4-mini",
  tools: TOOLS,
  systemPrompt: SYSTEM_PROMPT,
  middleware: [
    summarizationMiddleware({
      model: "openai:gpt-5.4-mini",
      trigger: { tokens: 4000 },
    }),
    humanInTheLoopMiddleware({
      interruptOn: {
        send_email: { allowedDecisions: ["approve", "reject"] },
      },
    }),
  ],
});
```

### 調整系統提示詞

編輯 `src/prompts.ts` 可以改變 Agent 的角色、語氣與工具使用策略：

```typescript
export const SYSTEM_PROMPT = `你是一位可靠的 AI 助手...`;
```

## 使用 LangSmith 追蹤

開發階段可以啟用 LangSmith，觀察每次 Agent 執行細節：

```bash
LANGSMITH_API_KEY=your-key-here
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=my-agent-project
```

追蹤內容包含：

- 模型輸入與輸出
- 工具呼叫參數與回傳結果
- token 使用量
- 執行延遲與錯誤

如果尚未設定 LangSmith API key，請先把 `LANGSMITH_TRACING` 設為 `false`。


## License

MIT License.

Copyright (c) 2024 LangChain

Permission is granted to use, copy, modify, merge, publish, distribute, sublicense, and sell this software, provided that the copyright notice and this permission notice are included in all copies or substantial portions.

This software is provided "as is", without warranty of any kind. The authors are not liable for any claim, damages, or other liability arising from its use.
