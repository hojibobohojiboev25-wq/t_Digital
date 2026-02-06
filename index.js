// Vercel serverless function for serving static files
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }

  // Handle other static files
  const filePath = path.join(__dirname, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[ext] || 'text/plain';

    const fileContent = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
    return;
  }

  // 404 for everything else
  res.status(404).send('Not Found');
};