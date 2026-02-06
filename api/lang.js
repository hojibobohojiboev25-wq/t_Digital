const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const { lang } = req.query;

  if (!lang || !['ru', 'de'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    const filePath = path.join(process.cwd(), 'languages', `${lang}.json`);
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.status(200).json({
      success: true,
      translations: translations
    });
  } catch (error) {
    console.error('Error loading translations:', error);
    res.status(500).json({
      error: 'Failed to load translations'
    });
  }
}