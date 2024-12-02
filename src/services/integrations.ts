import { generateContent } from './openai';
import { triggerMakeWebhook } from './make';
import { fetchRSSFeeds } from './rss';
import type { WorkflowAutomation } from '../types/integrations';

// Content workflow automation
export async function automateContentWorkflow(workflow: WorkflowAutomation) {
  try {
    // 1. Generate content with OpenAI
    const content = await generateContent(`Create ${workflow.type} content for ${workflow.platform}`);
    
    // 2. Send to Make.com for workflow automation
    await triggerMakeWebhook({
      trigger: workflow.type,
      data: {
        content,
        platform: workflow.platform,
        ...workflow.data
      }
    });

    return { success: true, content };
  } catch (error) {
    console.error('Workflow automation error:', error);
    throw error;
  }
}

// RSS feed integration
export async function setupRSSWorkflow(feedUrls: string[]) {
  try {
    // 1. Fetch RSS feeds
    const feeds = await fetchRSSFeeds(feedUrls);
    
    // 2. Process through Make.com workflow
    await triggerMakeWebhook({
      trigger: 'rss_update',
      data: { feeds }
    });

    return { success: true, feeds };
  } catch (error) {
    console.error('RSS workflow error:', error);
    throw error;
  }
}