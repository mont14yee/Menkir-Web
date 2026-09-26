const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));
const index = data.designs.findIndex(d => d.id === 'design4');

if (index !== -1) {
  // Update the install URL
  data.designs[index].install_url = 'https://mont14yee-menkr-impo-3wd3.bolt.host/';
  
  // Update poster to new icon
  data.designs[index].poster = '/images/crm_icon_v2.jpg';
  
  // Update screenshots to match the web app
  data.designs[index].screenshots = [
    '/images/crm_screen1_v2.jpg',
    '/images/crm_screen2_v2.jpg',
    '/images/crm_screen3_v2.jpg'
  ];
  
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
  console.log("Updated CRM install link and images successfully.");
} else {
  console.log("Could not find design4");
}
