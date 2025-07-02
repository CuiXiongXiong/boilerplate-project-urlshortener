require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = new Map();
let counter = 1;

// URL验证函数
function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return urlString.startsWith('http://') ||
               urlString.startsWith('https://');
    } catch {
        return false;
    }
}

// POST创建短链
app.post('/api/shorturl', (req, res) => {
    const originalUrl = req.url;

    if (!isValidUrl(originalUrl)) {
        return res.json({ error: 'invalid url' });
    }

    const shortUrl = counter++;
    urlDatabase.set(shortUrl, originalUrl);

    res.json({
        original_url: originalUrl,
        short_url: shortUrl
    });
});

// GET重定向
app.get('/api/shorturl/:shortUrl', (req, res) => {
    const shortUrl = Number(req.params.shortUrl);
    const originalUrl = urlDatabase.get(shortUrl);

    if (!originalUrl) {
        return res.status(404).json({ error: 'short url not found' });
    }

    res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
