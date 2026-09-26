const fs = require('fs');
let code = fs.readFileSync('components/Portfolio.tsx', 'utf8');

code = code.replace(
    /        \};\n    \}, \[\]\);/m,
    "        };\n    }, [portfolioData]);"
);

fs.writeFileSync('components/Portfolio.tsx', code);
