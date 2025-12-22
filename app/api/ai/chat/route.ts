import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { ApiResponse, ErrorHandler } from '@/lib/errors';
import { z } from 'zod';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || 'https://api.deepseek.com/v1',
});

// Request validation schema
const ChatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
    })).min(1, '消息列表不能为空'),
    model: z.string().default('deepseek-chat'),
    max_tokens: z.number().int().positive().default(500),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const validatedData = ChatRequestSchema.parse(body);

        if (!process.env.API_KEY) {
            throw ErrorHandler.aiService('AI 服务未配置，请检查 API_KEY 环境变量');
        }

        const response = await client.chat.completions.create({
            model: validatedData.model,
            max_tokens: validatedData.max_tokens,
            messages: validatedData.messages,
        });

        return ApiResponse.success(response);
    } catch (error: any) {
        // Handle OpenAI specific errors
        if (error.status === 429) {
            return ApiResponse.error(ErrorHandler.rateLimit('AI 服务请求过于频繁'));
        }
        if (error.status === 401) {
            return ApiResponse.error(ErrorHandler.unauthorized('AI 服务认证失败'));
        }

        return ApiResponse.error(error);
    }
}
