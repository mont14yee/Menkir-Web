const fs = require('fs');
let code = fs.readFileSync('index.css', 'utf8');

// I will just fix the extra `}` and put back the media query
code = code.replace(
    /      \}\n      \}\n      \.design-card:hover \{/,
    "      }\n      @media (min-width: 768px) {\n        .design-card { width: 224px; }\n      }\n      .design-card:hover {"
);

fs.writeFileSync('index.css', code);
