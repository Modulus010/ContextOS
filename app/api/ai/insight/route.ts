import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG, AI_SYSTEM_INSTRUCTIONS } from '@/constants';
import { ApiResponse, ErrorHandler } from '@/lib/errors';
import { GlobalStateSchema } from '@/lib/validation/schemas';
import { z } from 'zod';
import { startOfToday } from 'date-fns';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

const InsightRequestSchema = z.object({
    state: GlobalStateSchema,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { state } = InsightRequestSchema.parse(body);

        if (!process.env.API_KEY) {
            throw ErrorHandler.aiService('AI 服务未配置');
        }

        const startOfDay = startOfToday();
        const startOfDayISO = startOfDay.toISOString();

        // Filter for today's data
        const dailyContext = {
            tasksCompletedToday: state.tasks.filter((t: any) =>
                t.status === 'done' && t.completedAt >= startOfDayISO
            ),
            pendingTasks: state.tasks.filter((t: any) => t.status !== 'done'),
            focusSessionsToday: state.focusSessions.filter((s: any) =>
                s.startedAt >= startOfDayISO
            ),
            transactionsToday: state.transactions.filter((t: any) =>
                t.timestamp >= startOfDayISO
            ),
            lastJournal: state.journalEntries.length > 0 ? state.journalEntries[0] : null,
        };

        const prompt = `
      当前用户上下文:
      ${JSON.stringify(dailyContext, null, 2)}
      
      基于这个快照，提供一个具体的认知洞察或建议。
    `;

        const response = await client.chat.completions.create({
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.DEFAULT,
            messages: [
                {
                    role: 'system',
                    content: AI_SYSTEM_INSTRUCTIONS.DEFAULT,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const choice = (response as any).choices?.[0];
        const text = choice?.message?.content ??
            (typeof choice?.message === 'string' ? choice.message : undefined);

        return ApiResponse.success({
            insight: text || 'Nexus AI 正在重新校准。请继续保持心流。',
        });
    } catch (error: any) {
        if (error.status === 429) {
            return ApiResponse.error(ErrorHandler.rateLimit());
        }
        return ApiResponse.error(error);
    }
}
