const fs = require('fs');
const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

const blogs = data.blogs;
const indexSolar = blogs.findIndex(b => b.title === "Comprehensive Overview of Floating Solar (FPV) Technology");
const solarBlog = blogs[indexSolar];

blogs.splice(indexSolar, 1);

const indexPower = blogs.findIndex(b => b.title === "Your New Career Choice: Professional Human Power Plant");

blogs.splice(indexPower + 1, 0, solarBlog);

fs.writeFileSync('portfolio.json', JSON.stringify(data, null, 2));
console.log("Success!");
