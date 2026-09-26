const fs = require('fs');
let data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const proj9 = data.projects.find(p => p.id === 'proj9');
if (proj9) {
    proj9.title = "Ultimate Development Plan";
    proj9.quip = "ANNUAL TEMPLATE";
    // Also updating the overview heading if it matches
    if (proj9.overview) {
        proj9.overview = proj9.overview.replace("## MENKIR WOLDE: Your Future, Designed", "## Ultimate Development Plan: ANNUAL TEMPLATE");
    }
}

fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
