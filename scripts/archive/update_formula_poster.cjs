const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));
const index = data.designs.findIndex(d => d.id === 'design3');

if (index !== -1) {
  data.designs[index].poster = '/images/formula_app_preview.jpg';
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
  console.log("Updated poster successfully");
}
