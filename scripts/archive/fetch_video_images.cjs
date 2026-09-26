const https = require('https');
const topics = ['green roof', 'highway interchange', 'concrete machinery', 'futuristic floor'];

topics.forEach(q => {
    https.get('https://source.unsplash.com/400x711/?' + encodeURIComponent(q), { headers: {"User-Agent":"Mozilla/5.0"} }, (res) => {
        console.log(q, ':', res.headers.location);
    });
});
