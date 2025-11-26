import OpenAI from "openai";
import { GlobalState } from "../types";
import { API_CONFIG, AI_SYSTEM_INSTRUCTIONS } from "../constants";

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: API_CONFIG.BASE_URL,
    dangerouslyAllowBrowser: true
});

export const generateContextualInsight = async (state: GlobalState): Promise<string> => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        // Filter for today's data to give immediate context
        const dailyContext = {
            tasksCompletedToday: state.tasks.filter(t => t.status === 'done' && t.createdAt >= startOfDay).length,
            pendingTasks: state.tasks.filter(t => t.status !== 'done'),
            focusSessionsToday: state.focusSessions.filter(s => s.timestamp >= startOfDay),
            transactionsToday: state.transactions.filter(t => t.timestamp >= startOfDay),
            latestMood: state.journalEntries.length > 0 ? state.journalEntries[0].mood : 'unknown',
            lastJournalEntry: state.journalEntries.length > 0 ? state.journalEntries[0].content.substring(0, 100) : 'none'
        };

        const prompt = `
      当前用户上下文 (今日):
      ${JSON.stringify(dailyContext, null, 2)}
      
      基于这个快照，提供一个具体的认知洞察或建议（使用中文）。
    `;

        const response = await client.chat.completions.create({
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.DEFAULT,
            messages: [
                {
                    role: 'system',
                    content: AI_SYSTEM_INSTRUCTIONS.DEFAULT
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
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.SHORT,
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
        console.error("Journal analysis error:", error);
        return "反思已保存。";
    }
};

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
    try {
        const response = await client.chat.completions.create({
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.DEFAULT,
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
