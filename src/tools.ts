/**
 * LangChain Agent 可使用的工具。
 *
 * 使用 langchain 的 `tool` 函式定義工具。
 * 每個工具都應該有清楚的名稱、描述與 schema，讓模型理解何時以及如何使用。
 */

import { tool } from 'langchain';
import { z } from 'zod';

/**
 * 簡易計算工具，可執行基本四則運算。
 */
export const calculator = tool(
  async ({ operation, a, b }) => {
    switch (operation) {
      case 'add':
        return `${a} + ${b} = ${a + b}`;
      case 'subtract':
        return `${a} - ${b} = ${a - b}`;
      case 'multiply':
        return `${a} * ${b} = ${a * b}`;
      case 'divide':
        if (b === 0) {
          return '錯誤：除數不能為 0。';
        }
        return `${a} / ${b} = ${a / b}`;
      default:
        return '錯誤：未知的運算類型。';
    }
  },
  {
    name: 'calculator',
    description: '針對兩個數字執行基本四則運算：加、減、乘、除。',
    schema: z.object({
      operation: z
        .enum(['add', 'subtract', 'multiply', 'divide'])
        .describe('要執行的運算類型'),
      a: z.number().describe('第一個數字'),
      b: z.number().describe('第二個數字'),
    }),
  }
);

/**
 * 回傳目前日期與時間的工具。
 */
export const getCurrentTime = tool(
  async () => {
    const now = new Date();
    return `目前日期與時間：${now.toLocaleString('zh-TW', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })}`;
  },
  {
    name: 'get_current_time',
    description: '取得目前日期與時間。當使用者詢問現在時間或日期時使用。',
    schema: z.object({}),
  }
);

/**
 * 模擬取得指定地點天氣資訊的工具。
 * 真實應用中可以替換成實際的天氣 API。
 */
export const getWeather = tool(
  async ({ location, unit }) => {
    // 模擬天氣資料，正式環境請替換成實際 API。
    const conditions = ['晴朗', '多雲', '下雨', '局部多雲', '有風'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    // 產生隨機溫度。
    const tempCelsius = Math.floor(Math.random() * 35) + 5;
    const temp =
      unit === 'fahrenheit'
        ? Math.round((tempCelsius * 9) / 5 + 32)
        : tempCelsius;
    const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';

    return `${location} 的天氣：${condition}，${temp}${unitSymbol}。（注意：這是模擬資料）`;
  },
  {
    name: 'get_weather',
    description: '取得指定地點的目前天氣，回傳溫度與天氣狀況。',
    schema: z.object({
      location: z.string().describe('要查詢天氣的城市或地點'),
      unit: z
        .enum(['celsius', 'fahrenheit'])
        .default('celsius')
        .describe('偏好的溫度單位'),
    }),
  }
);

/**
 * 搜尋知識庫的工具。
 * 目前是範例實作，正式環境可替換成向量資料庫或搜尋 API。
 */
export const searchKnowledge = tool(
  async ({ query, maxResults }) => {
    // 模擬搜尋結果，正式環境可接向量資料庫或搜尋 API。
    const results = [
      {
        title: 'AI Agent 入門',
        snippet: 'AI Agent 是能感知、推理並執行動作的自主系統...',
      },
      {
        title: '使用 LangChain 建立應用',
        snippet: 'LangChain 提供建立 LLM 應用所需的工具與抽象層...',
      },
      {
        title: 'LLM 的工具調用',
        snippet: '現代 LLM 可以透過工具調用，延伸文字生成以外的能力...',
      },
    ];

    const limitedResults = results.slice(0, maxResults);
    return `針對「${query}」找到 ${limitedResults.length} 筆結果：\n\n${limitedResults
      .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.snippet}`)
      .join('\n\n')}`;
  },
  {
    name: 'search_knowledge',
    description: '搜尋知識庫中的相關資訊。當使用者的問題需要查找資料時使用。',
    schema: z.object({
      query: z.string().describe('要搜尋的查詢文字'),
      maxResults: z
        .number()
        .min(1)
        .max(10)
        .default(3)
        .describe('最多回傳幾筆結果'),
    }),
  }
);

/**
 * Agent 可使用的全部工具。
 * 可在這裡新增或移除工具，調整 Agent 能力。
 */
export const TOOLS = [calculator, getCurrentTime, getWeather, searchKnowledge];
