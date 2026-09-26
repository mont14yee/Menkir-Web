const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
    'family=Playfair+Display:ital,wght@0,700;1,700&display=swap',
    'family=Playfair+Display:ital,wght@0,700;1,700&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap'
);
fs.writeFileSync('index.html', html);
