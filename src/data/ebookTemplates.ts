import { EbookTemplate } from '../types/ebook';

export const ebookTemplates: EbookTemplate[] = [
  {
    id: 'step-by-step-guide',
    name: 'Step-by-Step Guide',
    description: 'Perfect for tutorials and how-to guides',
    structure: {
      title: 'Complete Guide to [Topic]',
      chapters: [
        {
          title: 'Introduction',
          description: 'Overview and what to expect'
        },
        {
          title: 'Getting Started',
          description: 'Basic concepts and prerequisites'
        },
        {
          title: 'Step-by-Step Instructions',
          description: 'Detailed walkthrough'
        },
        {
          title: 'Tips and Best Practices',
          description: 'Expert advice and common pitfalls'
        },
        {
          title: 'Conclusion',
          description: 'Summary and next steps'
        }
      ]
    }
  },
  {
    id: 'industry-report',
    name: 'Industry Report',
    description: 'Professional analysis and insights',
    structure: {
      title: '[Industry] Trends and Analysis',
      chapters: [
        {
          title: 'Executive Summary',
          description: 'Key findings and highlights'
        },
        {
          title: 'Market Overview',
          description: 'Current state and trends'
        },
        {
          title: 'Key Players and Competition',
          description: 'Analysis of major companies'
        },
        {
          title: 'Future Outlook',
          description: 'Predictions and opportunities'
        },
        {
          title: 'Recommendations',
          description: 'Strategic insights'
        }
      ]
    }
  },
  {
    id: 'course-material',
    name: 'Course Material',
    description: 'Educational content and lessons',
    structure: {
      title: '[Subject] Course Book',
      chapters: [
        {
          title: 'Course Overview',
          description: 'Learning objectives and outcomes'
        },
        {
          title: 'Module 1: Fundamentals',
          description: 'Core concepts and principles'
        },
        {
          title: 'Module 2: Advanced Topics',
          description: 'In-depth exploration'
        },
        {
          title: 'Practical Exercises',
          description: 'Hands-on activities'
        },
        {
          title: 'Assessment Guide',
          description: 'Tests and evaluations'
        }
      ]
    }
  }
];