const fs = require('fs');

// 1. Fix portfolio.json
let data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));
data.hero.title = "MENKIR WOLDE";
data.hero.subtitle = "Your Future, Designed.";
data.footer.ctaSubtitle = data.footer.ctaSubtitle.replace(/Ultimate Development Plan/g, "MENKIR WOLDE");
data.footer.copyright = data.footer.copyright.replace(/Ultimate Development Plan/g, "MENKIR WOLDE");
fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));

// 2. Fix Footer.tsx
let footerContent = fs.readFileSync('components/Footer.tsx', 'utf8');
// For portfolio variant, it relies on footerData?.copyright, which will now correctly be MENKIR WOLDE
footerContent = footerContent.replace("'Ultimate Development Plan. All rights reserved.'", "'Menkir Wolde. All rights reserved.'");
// For app variant
footerContent = footerContent.replace("{footerData?.copyright || 'THE FUTURE. All rights reserved.'}", "'Ultimate Development Plan. All rights reserved.'");
fs.writeFileSync('components/Footer.tsx', footerContent);

