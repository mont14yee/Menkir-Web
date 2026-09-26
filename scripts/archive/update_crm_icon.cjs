const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const index = data.designs.findIndex(d => d.id === 'design4');

if (index !== -1) {
  data.designs[index].poster = '/images/crm_icon_poster.jpg';
  data.designs[index].poster_prompt = "A minimalist, high-fidelity app icon presentation for 'CRM — MenkiR' on a 9:16 vertical product card. The central focus is a bold, modern app icon that visually represents productivity and client management (e.g., stylized interconnected nodes, abstract growth charts, or a refined geometric 'M'). Clean, professional aesthetic, warm neutral background surfaces, refined gradients, subtle borders, and restrained metallic or corporate color accents. No UI dashboards—just the striking, premium iconography.";
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
  console.log("Updated CRM icon successfully");
} else {
  console.log("Could not find design4");
}
