export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message_id } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!message_id) {
    return res.status(400).json({ error: 'Missing message_id' });
  }

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Missing Telegram environment variables.' });
  }

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/deleteMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id }),
      }
    );

    const data = await telegramRes.json();

    // Telegram returns ok:false if the message is already gone — treat that as success
    if (!data.ok && data.error_code !== 400) {
      throw new Error(data.description || 'Telegram deleteMessage failed');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram delete error:', error);
    return res.status(500).json({ error: 'Failed to delete Telegram message.' });
  }
}
