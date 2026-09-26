const fs = require('fs');
let data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));
data.hero.title = "MENKIR WOLDE";
data.hero.subtitle = "Your Future, Designed.";
data.footer.ctaSubtitle = data.footer.ctaSubtitle.replace(/Ultimate Development Plan/g, "MENKIR WOLDE");
data.footer.copyright = data.footer.copyright.replace(/Ultimate Development Plan/g, "MENKIR WOLDE");
fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
