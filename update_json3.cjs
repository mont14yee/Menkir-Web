const fs = require('fs');
let data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

data.hero.title = "Ultimate Development Plan";
data.hero.subtitle = "ANNUAL TEMPLATE";

data.footer.ctaSubtitle = data.footer.ctaSubtitle.replace(/MENKIR WOLDE/g, "Ultimate Development Plan");
data.footer.copyright = data.footer.copyright.replace(/MENKIR WOLDE/g, "Ultimate Development Plan");

fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace("MENKIR WOLDE: Your Future, Designed", "Ultimate Development Plan: ANNUAL TEMPLATE");
fs.writeFileSync('index.html', html);
