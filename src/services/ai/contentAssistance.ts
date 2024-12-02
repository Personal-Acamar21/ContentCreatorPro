import { generateContent } from '../openai';
import LanguageDetect from 'languagedetect';
import nlp from 'compromise';

const lngDetector = new LanguageDetect();

interface ContentSuggestion {
  original: string;
  suggestion: string;
  type: 'grammar' | 'style' | 'clarity';
  confidence: number;
}

interface ContentAnalysis {
  readabilityScore: number;
  suggestions: ContentSuggestion[];
  language: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export async function analyzeContent(text: string): Promise<ContentAnalysis> {
  // Detect language
  const detectedLang = lngDetector.detect(text);
  const language = detectedLang[0]?.[0] || 'english';

  // Basic NLP analysis
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  
  // Calculate readability (basic Flesch-Kincaid)
  const words = text.split(/\s+/).length;
  const avgWordsPerSentence = words / sentences.length;
  const readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence));

  // Get sentiment
  const sentiment = doc.sentiment() as number;
  const sentimentCategory = sentiment > 0.2 ? 'positive' : sentiment < -0.2 ? 'negative' : 'neutral';

  // Generate suggestions using OpenAI
  const prompt = `Analyze the following text and provide suggestions for improvement:
    "${text}"
    
    Provide suggestions in the following format:
    1. Original: [text]
       Suggestion: [improvement]
       Type: [grammar/style/clarity]`;

  const suggestionsText = await generateContent(prompt);
  const suggestions = parseSuggestions(suggestionsText);

  return {
    readabilityScore,
    suggestions,
    language,
    sentiment: sentimentCategory
  };
}

export async function generateSection(topic: string, style: 'formal' | 'casual' | 'academic'): Promise<string> {
  const prompt = `Write a ${style} section about "${topic}". Include relevant examples and explanations.`;
  return generateContent(prompt);
}

export async function checkPlagiarism(text: string): Promise<{
  originalityScore: number;
  matches: Array<{ text: string; similarity: number; source?: string }>;
}> {
  // In a real implementation, this would connect to a plagiarism detection service
  // For demo purposes, we'll return a mock response
  return {
    originalityScore: 0.95,
    matches: []
  };
}

function parseSuggestions(text: string): ContentSuggestion[] {
  // Basic parsing of OpenAI response
  const suggestions: ContentSuggestion[] = [];
  const lines = text.split('\n');
  
  let currentSuggestion: Partial<ContentSuggestion> = {};
  
  lines.forEach(line => {
    if (line.startsWith('Original:')) {
      currentSuggestion.original = line.replace('Original:', '').trim();
    } else if (line.startsWith('Suggestion:')) {
      currentSuggestion.suggestion = line.replace('Suggestion:', '').trim();
    } else if (line.startsWith('Type:')) {
      currentSuggestion.type = line.replace('Type:', '').trim() as any;
      if (currentSuggestion.original && currentSuggestion.suggestion && currentSuggestion.type) {
        suggestions.push({
          ...currentSuggestion as ContentSuggestion,
          confidence: 0.8
        });
        currentSuggestion = {};
      }
    }
  });

  return suggestions;
}

export async function improveReadability(text: string): Promise<string> {
  const prompt = `Improve the readability of the following text while maintaining its meaning:
    "${text}"
    
    Make it more concise and clear, using simpler language where appropriate.`;
    
  return generateContent(prompt);
}

export async function generateSummary(text: string, length: 'short' | 'medium' | 'long'): Promise<string> {
  const wordCounts = {
    short: 100,
    medium: 250,
    long: 500
  };

  const prompt = `Summarize the following text in approximately ${wordCounts[length]} words:
    "${text}"`;
    
  return generateContent(prompt);
}