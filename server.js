import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// The 'catch-all' handler: for any request that doesn't match a static file,
// send back index.html. This is required for SPA routing.
// We use a regex to avoid the path-to-regexp error with a simple '*'.
app.get(/.* /, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
