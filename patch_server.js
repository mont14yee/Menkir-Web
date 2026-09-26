import fs from 'fs';

let server = fs.readFileSync('server.ts', 'utf8');

// replace PORT
server = server.replace('const PORT = 3000;', 'const PORT = process.env.PORT || 3000;');

// add compression import
if (!server.includes("import compression")) {
    server = server.replace("import express from 'express';", "import express from 'express';\nimport compression from 'compression';");
}

// add compression middleware
if (!server.includes("app.use(compression())")) {
    server = server.replace("app.use(express.json());", "app.use(compression());\n  app.use(express.json());");
}

// add static cache control
server = server.replace(
    "app.use(express.static(distPath));", 
    "app.use(express.static(distPath, {\n      setHeaders: (res, filePath) => {\n        if (filePath.includes('/assets/')) {\n          res.setHeader('Cache-Control', 'public, max-age=15552000');\n        }\n      }\n    }));"
);

fs.writeFileSync('server.ts', server, 'utf8');
