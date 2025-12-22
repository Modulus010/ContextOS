import { GlobalState } from "@/types";
import { handleClientError } from '@/lib/errors';

export const generateContextualInsight = async (state: GlobalState): Promise<string> => {
    try {
        const response = await fetch('/api/ai/insight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '获取洞察失败');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || '获取洞察失败');
        }

        return data.data.insight || "持续记录你的一天以解锁更多洞察。";
    } catch (error) {
        console.error("AI Insight Error:", error);
        return handleClientError(error, "Nexus AI 正在重新校准。请继续保持心流。");
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '分析日志失败');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || '分析日志失败');
        }

        return data.data.analysis || "感谢你的分享。";
    } catch (error) {
        console.error("Journal analysis error:", error);
        return handleClientError(error, "反思已保存。");
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '生成子任务失败');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || '生成子任务失败');
        }

        return data.data.subtasks || [];
    } catch (error) {
        console.error("Subtask generation error:", error);
        return ["确定第一小步", "设定5分钟计时", "执行第一步"];
    }
}
