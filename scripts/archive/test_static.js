const express = require('express');
const path = require('path');
const app = express();
const distPath = path.join(process.cwd(), 'dist');
console.log('Serving from:', distPath);
app.use(express.static(distPath));
app.get('*all', (req, res) => res.send('Fallback'));
app.listen(3001, () => {
  console.log('Listening 3001');
});
