import { generateContent } from '../openai';
import nlp from 'compromise';

export interface ContentSuggestion {
  original: string;
  suggestion: string;
  type: 'grammar' | 'style' | 'clarity' | 'structure';
  confidence: number;
}

export interface ContentAnalysis {
  suggestions: ContentSuggestion[];
  readabilityScore: number;
  wordCount: number;
  sentenceCount: number;
}

export async function analyzeContent(content: string): Promise<ContentAnalysis> {
  if (!content.trim()) {
    throw new Error('Content is required for analysis');
  }

  try {
    // Basic text analysis
    const doc = nlp(content);
    const sentences = doc.sentences().out('array');
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate readability score
    const avgWordsPerSentence = sentences.length > 0 ? words / sentences.length : 0;
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence));

    // Generate AI suggestions
    const prompt = `Analyze this text and provide 3-5 specific suggestions for improvement. For each suggestion, include:
    - The original problematic text
    - Your suggested improvement
    - The type of improvement (grammar/style/clarity/structure)

    Format each suggestion exactly like this:
    Original: [text]
    Suggestion: [improvement]
    Type: [type]

    Text to analyze:
    "${content}"`;

    const aiResponse = await generateContent(prompt);
    const suggestions = parseAISuggestions(aiResponse);

    return {
      suggestions,
      readabilityScore,
      wordCount: words,
      sentenceCount: sentences.length
    };
  } catch (error) {
    console.error('Content analysis error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze content');
  }
}

function parseAISuggestions(aiResponse: string): ContentSuggestion[] {
  const suggestions: ContentSuggestion[] = [];
  const blocks = aiResponse.split('\n\n');

  for (const block of blocks) {
    const lines = block.split('\n');
    let suggestion: Partial<ContentSuggestion> = {};

    for (const line of lines) {
      if (line.startsWith('Original:')) {
        suggestion.original = line.replace('Original:', '').trim();
      } else if (line.startsWith('Suggestion:')) {
        suggestion.suggestion = line.replace('Suggestion:', '').trim();
      } else if (line.startsWith('Type:')) {
        const type = line.replace('Type:', '').trim().toLowerCase();
        if (['grammar', 'style', 'clarity', 'structure'].includes(type)) {
          suggestion.type = type as ContentSuggestion['type'];
        }
      }
    }

    if (suggestion.original && suggestion.suggestion && suggestion.type) {
      suggestions.push({
        ...suggestion as Required<typeof suggestion>,
        confidence: 0.8
      });
    }
  }

  return suggestions;
}

export async function improveContent(content: string): Promise<string> {
  if (!content.trim()) {
    throw new Error('Content is required for improvement');
  }

  const prompt = `Improve this text while maintaining its core message and style:

"${content}"

Focus on:
1. Clarity and conciseness
2. Engaging language
3. Professional tone
4. Proper structure

Return only the improved text without any explanations.`;

  return generateContent(prompt);
}

export async function generateSuggestions(topic: string, type: 'expand' | 'outline' | 'conclusion'): Promise<string> {
  if (!topic.trim()) {
    throw new Error('Topic is required for suggestions');
  }

  const prompts = {
    expand: `Provide detailed suggestions for expanding content about "${topic}". Include key points and examples.`,
    outline: `Create a structured outline for content about "${topic}". Include main sections and subsections.`,
    conclusion: `Suggest a strong conclusion for content about "${topic}". Summarize key points and provide a call to action.`
  };

  return generateContent(prompts[type]);
}