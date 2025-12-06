import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG, AI_SYSTEM_INSTRUCTIONS } from '@/constants';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

export async function POST(request: NextRequest) {
    try {
        const { state } = await request.json();

        if (!state) {
            return NextResponse.json(
                { error: 'State data is required' },
                { status: 400 }
            );
        }

        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfDayTimestamp = startOfDay.getTime();

        // Filter for today's data
        const dailyContext = {
            tasksCompletedToday: state.tasks.filter((t: any) =>
                t.status === 'done' && t.completedAt >= startOfDayTimestamp
            ),
            pendingTasks: state.tasks.filter((t: any) => t.status !== 'done'),
            focusSessionsToday: state.focusSessions.filter((s: any) =>
                s.timestamp >= startOfDayTimestamp
            ),
            transactionsToday: state.transactions.filter((t: any) =>
                t.timestamp >= startOfDayTimestamp
            ),
            lastJournal: state.journalEntries.length > 0 ? state.journalEntries[0] : null,
        };

        const prompt = `
      当前时间戳: ${today.getTime()}
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

        return NextResponse.json({
            insight: text || '持续记录你的一天以解锁更多洞察。',
        });
    } catch (error: any) {
        console.error('Insight generation error:', error);
        return NextResponse.json(
            { insight: 'Nexus AI 正在重新校准。请继续保持心流。' },
            { status: 200 }
        );
    }
}
