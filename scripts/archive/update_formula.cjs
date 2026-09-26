const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const index = data.designs.findIndex(d => d.id === 'design3');

if (index !== -1) {
  data.designs[index] = {
    "id": "design3",
    "style": "Education / Engineering",
    "name": "CIVIL ENGINEERING FORMULA",
    "description": "A professional reference app helping students and engineers discover formulas, perform calculations, and visualize structural behavior instantly.",
    "poster": "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=400&h=711&fit=crop",
    "poster_prompt": "Cinematic, modern app store poster for 'CIVIL ENGINEERING FORMULA', featuring blueprint schematics, bridge structures, and structural calculation diagrams overlaid on a clean, professional dark mode UI. Bright accents of construction yellow and blueprint blue. Top title: 'CIVIL ENGINEERING FORMULA'. Tagline: 'Every Formula. One Place.'",
    "tech_stack": "Calculators, Schematics, Diagrams & References",
    "price": "Free",
    "install_url": "#",
    "rating": "4.9",
    "reviews": "(4.2k)",
    "hover_quip": "Every Formula. One Place. Discover → Understand → Calculate → Visualize.",
    "downloads": "100K+",
    "contentRating": "E",
    "editorChoice": true,
    "primaryButtonLabel": "Install",
    "secondaryButtonLabel": "Learn More",
    "developer": "Menkir Wolde",
    "screenshots": [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&h=711&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&h=711&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=400&h=711&fit=crop"
    ]
  };
  fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
  console.log("Updated design3 successfully");
} else {
  console.log("Could not find design3");
}
