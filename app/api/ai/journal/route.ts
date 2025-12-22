import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG } from '@/constants';
import { ApiResponse, ErrorHandler } from '@/lib/errors';
import { z } from 'zod';
import { MoodSchema } from '@/lib/validation/schemas';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

const JournalAnalysisSchema = z.object({
    entry: z.string().min(1, '日志内容不能为空'),
    mood: MoodSchema,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { entry, mood } = JournalAnalysisSchema.parse(body);

        if (!process.env.API_KEY) {
            throw ErrorHandler.aiService('AI 服务未配置');
        }

        const response = await client.chat.completions.create({
            model: API_CONFIG.MODEL,
            max_tokens: API_CONFIG.MAX_TOKENS.SHORT,
            messages: [
                {
                    role: 'user',
                    content: `用户写下了这篇日记，心情是 '${mood}': "${entry}". \n\n 请提供一句心理学上的肯定，或一个温和的问题来加深他们的反思（使用中文）。`,
                },
            ],
        });

        const choice = (response as any).choices?.[0];
        const text = choice?.message?.content ??
            (typeof choice?.message === 'string' ? choice.message : undefined);

        return ApiResponse.success({
            analysis: text || '感谢你的分享。',
        });
    } catch (error: any) {
        if (error.status === 429) {
            return ApiResponse.error(ErrorHandler.rateLimit());
        }
        return ApiResponse.error(error);
    }
}
