const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const port = 4000

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// "prettier": "prettier --cache --write \"src/**/*.ts\" \"src/**/*.tsx\" \"pages/**/*.ts\" \"pages/**/*.tsx\" \"components/**/*.ts\" \"components/**/*.tsx\" \"lib/**/*.ts\" \"lib/**/*.tsx\" \"hooks/**/*.ts\" \"hooks/**/*.tsx\" \"utils/**/*.ts\" \"utils/**/*.tsx\" \"styles/**/*.ts\" \"styles/**/*.tsx\" \"public/**/*.ts\" \"public/**/*.tsx\" \"test/**/*.ts\" \"test/**/*.tsx\"
// Lade SSL-Zertifikate
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', '.volumes', 'keys', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '.volumes', 'keys',  'certificate.crt')),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });
});
