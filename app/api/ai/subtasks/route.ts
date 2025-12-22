import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG } from '@/constants';
import { ApiResponse, ErrorHandler } from '@/lib/errors';
import { z } from 'zod';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

const SubtaskRequestSchema = z.object({
    taskTitle: z.string().min(1, '任务标题不能为空'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { taskTitle } = SubtaskRequestSchema.parse(body);

        if (!process.env.API_KEY) {
            throw ErrorHandler.aiService('AI 服务未配置');
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
                return ApiResponse.success({ subtasks });
            }
        }

        return ApiResponse.success({ subtasks: [] });
    } catch (error: any) {
        if (error.status === 429) {
            return ApiResponse.error(ErrorHandler.rateLimit());
        }
        return ApiResponse.error(error);
    }
}
