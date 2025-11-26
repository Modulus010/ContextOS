import OpenAI from "openai";
import { GlobalState } from "../types";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://api.deepseek.com",
  dangerouslyAllowBrowser: true
});

const SYSTEM_INSTRUCTION = `
你是一个构建在“Nexus 生活上下文操作系统”中的认知心理学专家和生产力教练。
你的目标是帮助用户理解他们的任务、专注度、消费习惯和情绪之间的联系。
请提供简短、可操作且富有同理心的中文洞察。
避免泛泛而谈。请从提供的 JSON 数据中寻找模式。
例如：
- 如果支出很高且情绪低落 -> 建议检查是否在进行“零售疗法”。
- 如果专注度低且任务堆积 -> 建议重新排列优先级或休息一下。
- 如果日记内容积极但任务未完成 -> 肯定其良好的状态，但温和地推动完成一个小任务。

保持语气专业且温暖。最多 3 句话。
`;

export const generateContextualInsight = async (state: GlobalState): Promise<string> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    // Filter for today's data to give immediate context
    const dailyContext = {
      tasksCompletedToday: state.tasks.filter(t => t.status === 'done' && t.createdAt >= startOfDay).length,
      pendingTasks: state.tasks.filter(t => t.status !== 'done'),
      focusMinutesToday: Math.floor(state.focusSessions.filter(s => s.timestamp >= startOfDay).reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60),
      moneySpentToday: state.transactions.filter(t => t.type === 'expense' && t.timestamp >= startOfDay),
      latestMood: state.journalEntries.length > 0 ? state.journalEntries[0].mood : 'unknown',
      lastJournalEntry: state.journalEntries.length > 0 ? state.journalEntries[0].content.substring(0, 100) : 'none'
    };

    const prompt = `
      当前用户上下文 (今日):
      ${JSON.stringify(dailyContext, null, 2)}
      
      基于这个快照，提供一个具体的认知洞察或建议（使用中文）。
    `;

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: SYSTEM_INSTRUCTION
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const choice = (response as any).choices?.[0];
    const text = choice?.message?.content ?? (typeof choice?.message === 'string' ? choice.message : undefined);
    return text ? text : "持续记录你的一天以解锁更多洞察。";
  } catch (error) {
    console.error("Deepseek API Error:", error);
    return "Nexus AI 正在重新校准。请继续保持心流。";
  }
};

export const analyzeJournalEntry = async (entry: string, mood: string): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `用户写下了这篇日记，心情是 '${mood}': "${entry}". \n\n 请提供一句心理学上的肯定，或一个温和的问题来加深他们的反思（使用中文）。`
        }
      ]
    });
    const choice = (response as any).choices?.[0];
    const text = choice?.message?.content ?? (typeof choice?.message === 'string' ? choice.message : undefined);
    return text ? text : "感谢你的分享。";
  } catch (error) {
    return "反思已保存。";
  }
}

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `将任务 "${taskTitle}" 拆解为 3-5 个更小的、可执行的子任务，以减少认知负荷。请直接返回 JSON 字符串数组（中文）。例如：["子任务1", "子任务2", "子任务3"]`
        }
      ]
    });
    const choice = (response as any).choices?.[0];
    const text = choice?.message?.content ?? (typeof choice?.message === 'string' ? choice.message : undefined);
    if (text) {
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as string[];
      }
    }
    return [];
  } catch (error) {
    console.error("Deepseek Subtask Error:", error);
    return ["确定第一小步", "设定5分钟计时", "执行第一步"];
  }
}