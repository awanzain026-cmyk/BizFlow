import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://sodeom.com/v1';

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Pakistani small business owners. Be concise, professional, and practical. Use Pakistani Rupees (Rs.) when mentioning money.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('AI API error:', data.error);
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
