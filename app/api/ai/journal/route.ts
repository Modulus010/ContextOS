import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { API_CONFIG } from '@/constants';

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE_URL || API_CONFIG.BASE_URL,
});

export async function POST(request: NextRequest) {
    try {
        const { entry, mood } = await request.json();

        if (!entry || !mood) {
            return NextResponse.json(
                { error: 'Entry and mood are required' },
                { status: 400 }
            );
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

        return NextResponse.json({
            analysis: text || '感谢你的分享。',
        });
    } catch (error: any) {
        console.error('Journal analysis error:', error);
        return NextResponse.json(
            { analysis: '反思已保存。' },
            { status: 200 }
        );
    }
}
