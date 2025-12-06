import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG } from '@/constants';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

export async function POST(request: NextRequest) {
    try {
        const { taskTitle } = await request.json();

        if (!taskTitle) {
            return NextResponse.json(
                { error: 'Task title is required' },
                { status: 400 }
            );
        }

        const response = await client.chat.completions.create({
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.DEFAULT,
            messages: [
                {
                    role: 'user',
                    content: `将任务 "${taskTitle}" 拆解为 3-5 个更小的、可执行的子任务，以减少认知负荷。请直接返回 JSON 字符串数组（中文）。例如：["子任务1", "子任务2", "子任务3"]`,
                },
            ],
        });

        const choice = (response as any).choices?.[0];
        const text = choice?.message?.content ??
            (typeof choice?.message === 'string' ? choice.message : undefined);

        if (text) {
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                const subtasks = JSON.parse(jsonMatch[0]) as string[];
                return NextResponse.json({ subtasks });
            }
        }

        return NextResponse.json({ subtasks: [] });
    } catch (error: any) {
        console.error('Subtask generation error:', error);
        return NextResponse.json(
            { subtasks: [] },
            { status: 200 }
        );
    }
}
