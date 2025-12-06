import { GlobalState } from "../types";

export const generateContextualInsight = async (state: GlobalState): Promise<string> => {
    try {
        const response = await fetch('/api/ai/insight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state }),
        });

        const data = await response.json();
        return data.insight || "持续记录你的一天以解锁更多洞察。";
    } catch (error) {
        console.error("AI API Error:", error);
        return "Nexus AI 正在重新校准。请继续保持心流。";
    }
};

export const analyzeJournalEntry = async (entry: string, mood: string): Promise<string> => {
    try {
        const response = await fetch('/api/ai/journal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entry, mood }),
        });

        const data = await response.json();
        return data.analysis || "感谢你的分享。";
    } catch (error) {
        console.error("Journal analysis error:", error);
        return "反思已保存。";
    }
};

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
    try {
        const response = await fetch('/api/ai/subtasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskTitle }),
        });

        const data = await response.json();
        return data.subtasks || [];
    } catch (error) {
        console.error("Deepseek Subtask Error:", error);
        return ["确定第一小步", "设定5分钟计时", "执行第一步"];
    }
}
