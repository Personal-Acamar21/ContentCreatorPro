import { generateContent } from '../openai';
import nlp from 'compromise';

interface ReaderProfile {
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    theme: 'light' | 'dark' | 'sepia';
    textAlign: 'left' | 'justify';
  };
  accessibility: {
    highContrast: boolean;
    dyslexicFont: boolean;
    lineSpacing: string;
    paragraphSpacing: string;
  };
}

export async function analyzeReadingLevel(content: string): Promise<'beginner' | 'intermediate' | 'advanced'> {
  const doc = nlp(content);
  const sentences = doc.sentences().out('array');
  
  // Calculate complexity metrics
  const avgWordsPerSentence = content.split(/\s+/).length / sentences.length;
  const complexWords = content.match(/\w{3,}/g)?.length || 0;
  const totalWords = content.split(/\s+/).length;
  const complexityRatio = complexWords / totalWords;

  if (avgWordsPerSentence > 20 && complexityRatio > 0.3) {
    return 'advanced';
  } else if (avgWordsPerSentence > 15 && complexityRatio > 0.2) {
    return 'intermediate';
  }
  return 'beginner';
}

export async function adaptContent(
  content: string,
  targetLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<string> {
  const prompt = `Adapt the following content for a ${targetLevel} reading level while maintaining the core message:
    "${content}"`;
  
  return generateContent(prompt);
}

export function generateAccessibilityStyles(profile: ReaderProfile): React.CSSProperties {
  return {
    fontSize: profile.preferences.fontSize,
    fontFamily: profile.accessibility.dyslexicFont ? 
      'OpenDyslexic, sans-serif' : 
      profile.preferences.fontFamily,
    lineHeight: profile.accessibility.lineSpacing,
    textAlign: profile.preferences.textAlign as any,
    backgroundColor: profile.preferences.theme === 'dark' ? '#1a1a1a' :
                    profile.preferences.theme === 'sepia' ? '#f4ecd8' : '#ffffff',
    color: profile.preferences.theme === 'dark' ? '#ffffff' : '#000000',
    margin: profile.accessibility.paragraphSpacing,
    filter: profile.accessibility.highContrast ? 'contrast(1.2)' : 'none',
  };
}

export function getDefaultProfile(): ReaderProfile {
  return {
    readingLevel: 'intermediate',
    preferences: {
      fontSize: '16px',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.6',
      theme: 'light',
      textAlign: 'left'
    },
    accessibility: {
      highContrast: false,
      dyslexicFont: false,
      lineSpacing: '1.6',
      paragraphSpacing: '1.5rem'
    }
  };
}

export async function suggestContentCustomizations(content: string): Promise<{
  vocabulary: 'simple' | 'moderate' | 'advanced';
  structureSuggestions: string[];
  formatSuggestions: string[];
}> {
  const readingLevel = await analyzeReadingLevel(content);
  
  return {
    vocabulary: readingLevel,
    structureSuggestions: [
      'Break long paragraphs into smaller chunks',
      'Add subheadings for better navigation',
      'Include bullet points for key concepts'
    ],
    formatSuggestions: [
      'Increase line spacing for better readability',
      'Use left alignment for easier tracking',
      'Add margin notes for definitions'
    ]
  };
}