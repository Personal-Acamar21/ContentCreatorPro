export interface RSSFeed {
  title?: string;
  description?: string;
  items: {
    title?: string;
    content?: string;
    link?: string;
    pubDate?: string;
    categories?: string[];
  }[];
}

export interface MakeWebhookData {
  trigger: string;
  data: any;
}

export interface WorkflowAutomation {
  type: 'publish' | 'schedule' | 'notify' | 'sync';
  platform?: string;
  data: any;
}