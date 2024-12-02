import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateContent(prompt: string): Promise<string> {
  if (!prompt) {
    throw new Error('Prompt is required');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional content creator and editor. Provide clear, concise, and helpful suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    return content;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
    }
    throw new Error(error.message || 'Failed to generate content');
  }
}

export async function generateBlogPost(topic: string, style: string = 'general'): Promise<string> {
  const prompt = `Write a detailed blog post about ${topic} in a ${style} style. Include headings, subheadings, and key points.`;
  return generateContent(prompt);
}

export async function generateChapterContent(topic: string, type: 'expand' | 'rewrite' | 'summarize' | 'outline'): Promise<string> {
  const prompts = {
    expand: `Write a detailed chapter about ${topic}. Include examples and explanations.`,
    rewrite: `Rewrite the content about ${topic} in a more engaging way.`,
    summarize: `Create a concise summary of ${topic}.`,
    outline: `Create a detailed outline for a chapter about ${topic}.`
  };

  return generateContent(prompts[type]);
}

export async function improveContent(content: string): Promise<string> {
  const prompt = `Improve the following content while maintaining its core message:\n\n${content}`;
  return generateContent(prompt);
}

export async function generateOutline(topic: string): Promise<string> {
  return generateChapterContent(topic, 'outline');
}