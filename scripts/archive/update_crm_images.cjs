const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const index = data.designs.findIndex(d => d.id === 'design4');

if (index !== -1) {
  data.designs[index].poster = '/images/crm_poster.jpg';
  data.designs[index].screenshots = [
    '/images/crm_screenshot_1.jpg',
    '/images/crm_screenshot_2.jpg',
    '/images/crm_screenshot_3.jpg'
  ];
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
  console.log("Updated CRM images successfully");
} else {
  console.log("Could not find design4");
}
