const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const newDesign = {
  "id": "design4",
  "style": "Business / Productivity",
  "name": "CRM — MenkiR",
  "description": "A polished professional workspace helping freelancers, consultants, and small teams manage clients, projects, tasks, schedules, documents, templates, and finances in one connected platform. One CRM. One workspace. Complete control.",
  "poster": "/images/crm_menkir_preview.jpg",
  "poster_prompt": "A high-fidelity mobile app preview of a premium SaaS CRM application. Clean, spacious dashboard showing client management, active projects, tasks, and financial charts. Warm neutral surfaces, refined typography, subtle borders, restrained accents. Professional business software aesthetic, modern marketplace advertisement, highly attractive.",
  "tech_stack": "Client Management, Project Tracking, Financials & Scheduling",
  "price": "Free",
  "install_url": "#",
  "rating": "4.9",
  "reviews": "(12.5k)",
  "hover_quip": "Manage Clients. Projects. Work.",
  "downloads": "500K+",
  "contentRating": "E",
  "editorChoice": true,
  "primaryButtonLabel": "Install",
  "secondaryButtonLabel": "View Details",
  "developer": "Menkir Wolde",
  "screenshots": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=711&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&h=711&fit=crop",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&h=711&fit=crop"
  ]
};

const existingIndex = data.designs.findIndex(d => d.id === 'design4');
if (existingIndex >= 0) {
    data.designs[existingIndex] = newDesign;
} else {
    data.designs.push(newDesign);
}

fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
console.log("Added CRM design successfully");
