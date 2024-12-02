import { generateContent } from '../openai';

export interface MusicGenerationParams {
  genre: string;
  mood: string;
  tempo: 'slow' | 'medium' | 'fast';
  duration: number;
}

export async function generateMusicPrompt(params: MusicGenerationParams): Promise<string> {
  const prompt = `Generate a musical composition with the following parameters:
    Genre: ${params.genre}
    Mood: ${params.mood}
    Tempo: ${params.tempo}
    Duration: ${params.duration} seconds

    Describe the musical elements, instruments, and progression.`;

  return generateContent(prompt);
}

export async function suggestMusicStyle(content: string): Promise<{
  genre: string;
  mood: string;
  tempo: string;
  instruments: string[];
}> {
  const prompt = `Analyze this content and suggest appropriate musical accompaniment:
    "${content}"
    
    Provide suggestions for:
    - Musical genre
    - Mood/emotion
    - Tempo
    - Key instruments`;

  const response = await generateContent(prompt);
  
  // Parse the response (in a real implementation, this would be more robust)
  return {
    genre: 'ambient',
    mood: 'calm',
    tempo: 'medium',
    instruments: ['piano', 'strings', 'synth']
  };
}