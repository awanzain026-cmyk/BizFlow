'use client';

export async function generateAIDescription(context: string): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Write a professional invoice line item description for: ${context}. Keep it concise (max 15 words) and business-appropriate.`,
      }),
    });
    const data = await res.json();
    return data.text || data.content || 'Professional service';
  } catch {
    return 'Professional service';
  }
}

export async function generateAIInsight(data: string): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `You are a business analyst. Given this business data: ${data}. Provide 1 short actionable business insight in 2 sentences. Focus on Pakistan market context.`,
      }),
    });
    const result = await res.json();
    return result.text || result.content || '';
  } catch {
    return '';
  }
}
