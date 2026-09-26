const fs = require('fs');
let data = fs.readFileSync('portfolio.json', 'utf8');
data = data.replace(/"Full Proposal"/g, '"Design"');
fs.writeFileSync('portfolio.json', data);
