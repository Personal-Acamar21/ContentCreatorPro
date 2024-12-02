interface LayoutSuggestion {
  type: 'spacing' | 'typography' | 'hierarchy' | 'color';
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface DesignAnalysis {
  readabilityScore: number;
  suggestions: LayoutSuggestion[];
  deviceSpecificSuggestions: {
    mobile: LayoutSuggestion[];
    tablet: LayoutSuggestion[];
    desktop: LayoutSuggestion[];
  };
}

export function analyzeLayout(content: string, currentLayout: any): DesignAnalysis {
  // Analyze content structure
  const paragraphs = content.split('\n\n');
  const headings = content.match(/^#+ .+$/gm) || [];
  const images = content.match(/!\[.*?\]\(.*?\)/g) || [];

  const suggestions: LayoutSuggestion[] = [];

  // Check content density
  if (paragraphs.some(p => p.length > 300)) {
    suggestions.push({
      type: 'spacing',
      suggestion: 'Consider breaking up long paragraphs for better readability',
      priority: 'high'
    });
  }

  // Check heading hierarchy
  if (headings.length > 0) {
    const headingLevels = headings.map(h => h.match(/^#+/)?.[0].length || 0);
    if (headingLevels[0] > 1) {
      suggestions.push({
        type: 'hierarchy',
        suggestion: 'Start with a top-level heading (H1) for better document structure',
        priority: 'high'
      });
    }
  }

  // Generate device-specific suggestions
  const deviceSpecificSuggestions = {
    mobile: [
      {
        type: 'typography',
        suggestion: 'Increase font size for better mobile readability',
        priority: 'high'
      }
    ],
    tablet: [
      {
        type: 'spacing',
        suggestion: 'Optimize margins for tablet viewing',
        priority: 'medium'
      }
    ],
    desktop: [
      {
        type: 'typography',
        suggestion: 'Consider using columns for wide screens',
        priority: 'medium'
      }
    ]
  };

  return {
    readabilityScore: calculateReadabilityScore(content),
    suggestions,
    deviceSpecificSuggestions
  };
}

function calculateReadabilityScore(content: string): number {
  // Basic readability calculation
  const words = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / sentences;
  
  // Simple score based on average words per sentence
  // Ideal range is typically 15-20 words per sentence
  const baseScore = 100 - Math.abs(avgWordsPerSentence - 17.5) * 2;
  return Math.max(0, Math.min(100, baseScore));
}

export function optimizeForDevice(content: string, device: 'mobile' | 'tablet' | 'desktop'): any {
  const baseStyles = {
    fontSize: '16px',
    lineHeight: '1.5',
    maxWidth: '100%'
  };

  switch (device) {
    case 'mobile':
      return {
        ...baseStyles,
        fontSize: '18px',
        padding: '1rem',
        maxWidth: '100vw'
      };
    case 'tablet':
      return {
        ...baseStyles,
        fontSize: '16px',
        padding: '2rem',
        maxWidth: '768px'
      };
    case 'desktop':
      return {
        ...baseStyles,
        fontSize: '16px',
        padding: '2rem',
        maxWidth: '1200px',
        columns: content.length > 1000 ? '2' : '1'
      };
  }
}

export function suggestTypography(content: string): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  spacing: string;
} {
  // Analyze content to suggest typography
  const isLongForm = content.length > 5000;
  const hasCodeBlocks = content.includes('```');
  const hasHeadings = content.match(/^#+ .+$/gm)?.length || 0;

  return {
    fontFamily: hasCodeBlocks ? 
      "'Source Sans Pro', system-ui, sans-serif" : 
      "'Merriweather', Georgia, serif",
    fontSize: isLongForm ? '18px' : '16px',
    lineHeight: isLongForm ? '1.8' : '1.6',
    spacing: hasHeadings > 3 ? '2rem' : '1.5rem'
  };
}