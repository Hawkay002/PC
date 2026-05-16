export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { imageBase64 } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!imageBase64 || !botToken || !chatId) {
    return res.status(400).json({ error: 'Missing required fields or environment variables.' });
  }

  try {
    // Convert base64 back to a buffer for Telegram
    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'postcard.jpg');

    // Send to Telegram
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API Error');
    }

    // Extract the highest resolution photo file_id
    const photoArray = data.result.photo;
    const bestPhoto = photoArray[photoArray.length - 1];

    // Return the file_id (for image display) and message_id (for future deletion)
    return res.status(200).json({
      file_id: bestPhoto.file_id,
      message_id: data.result.message_id,
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Failed to upload image.' });
  }
}
