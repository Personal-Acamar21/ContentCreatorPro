export async function triggerMakeWebhook(data: any) {
  try {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response.json();
  } catch (error) {
    console.error('Make.com webhook error:', error);
    throw error;
  }
}