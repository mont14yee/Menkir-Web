const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const index = data.designs.findIndex(d => d.id === 'design2');
if (index !== -1) {
    data.designs.splice(index, 1);
    fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
    console.log("Removed design2 successfully");
} else {
    console.log("Could not find design2");
}
