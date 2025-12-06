import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, model = 'deepseek-chat', max_tokens = 500 } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required' },
                { status: 400 }
            );
        }

        const response = await client.chat.completions.create({
            model,
            max_tokens,
            messages,
        });

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('AI API Error:', error);
        return NextResponse.json(
            { error: error.message || 'AI service error' },
            { status: 500 }
        );
    }
}
