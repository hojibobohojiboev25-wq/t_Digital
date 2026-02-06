const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, service, budget, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Telegram message
    const telegramMessage = `
📬 New contact form submission:

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone || 'Not provided'}
🏢 Company: ${company || 'Not provided'}
🛠️ Service: ${service || 'Not specified'}
💰 Budget: ${budget || 'Not specified'}

💬 Message:
${message}

⏰ Time: ${new Date().toLocaleString('de-DE')}
    `;

    // Send to Telegram (you need to set environment variables in Vercel)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message'
    });
  }
}