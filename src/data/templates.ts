import { BlogTemplate } from '../types/blog';

export const templates: BlogTemplate[] = [
  {
    id: 'how-to',
    name: 'How-To Guide',
    description: 'Step-by-step instructions for completing a specific task',
    type: 'how-to',
    structure: `
1. Introduction
2. What You'll Need
3. Step-by-Step Instructions
4. Tips and Tricks
5. Common Mistakes to Avoid
6. Conclusion
    `,
    prompt: 'Write a comprehensive how-to guide about {topic}. Include clear steps, required materials, and expert tips.',
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Engaging list-based article',
    type: 'listicle',
    structure: `
1. Introduction
2. List Items (with descriptions)
3. Summary
4. Call to Action
    `,
    prompt: 'Create an engaging listicle about {topic}. Include detailed explanations for each item and relevant examples.',
  },
  {
    id: 'opinion',
    name: 'Opinion Piece',
    description: 'Well-structured opinion article',
    type: 'opinion',
    structure: `
1. Introduction & Thesis
2. Background
3. Main Arguments
4. Counter-Arguments
5. Conclusion
    `,
    prompt: 'Write a balanced opinion piece about {topic}. Present clear arguments supported by evidence and address potential counter-arguments.',
  },
  {
    id: 'review',
    name: 'Product/Service Review',
    description: 'Detailed review with pros and cons',
    type: 'review',
    structure: `
1. Overview
2. Features & Specifications
3. Pros
4. Cons
5. Comparison
6. Verdict
    `,
    prompt: 'Write a comprehensive review of {topic}. Include detailed analysis of features, benefits, drawbacks, and comparisons with alternatives.',
  },
  {
    id: 'news',
    name: 'News Article',
    description: 'Current events in journalistic style',
    type: 'news',
    structure: `
1. Headline
2. Lead Paragraph
3. Key Details
4. Background
5. Quotes & Sources
6. Conclusion
    `,
    prompt: 'Write a news article about {topic} following journalistic best practices. Include relevant facts, quotes, and context.',
  },
];