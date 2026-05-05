export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!id) return res.status(400).json({ error: 'Missing file_id' });

  try {
    // 1. Ask Telegram for the temporary file path
    const pathRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${id}`);
    const pathData = await pathRes.json();

    if (!pathData.ok) throw new Error('File not found');

    // 2. Fetch the actual image data from Telegram
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${pathData.result.file_path}`;
    const imageRes = await fetch(fileUrl);
    
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. CACHING MAGIC: Tell Vercel's Edge Network to cache this forever
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('Content-Type', 'image/jpeg');
    
    // 4. Send the image to the frontend
    res.send(buffer);
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.status(500).json({ error: 'Failed to load image' });
  }
}
