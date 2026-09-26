const fs = require('fs');
let heroContent = fs.readFileSync('components/Hero.tsx', 'utf8');
heroContent = heroContent.replace("{heroData?.title || 'Ultimate Development Plan'}", "'Ultimate Development Plan'");
heroContent = heroContent.replace("{heroData?.subtitle || 'ANNUAL TEMPLATE'}", "'ANNUAL TEMPLATE'");
fs.writeFileSync('components/Hero.tsx', heroContent);
