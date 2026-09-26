import fs from 'fs';

let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace("import { createServer as createViteServer } from 'vite';", "");
server = server.replace(
    "const vite = await createViteServer({",
    "const { createServer: createViteServer } = await import('vite');\n    const vite = await createViteServer({"
);

fs.writeFileSync('server.ts', server, 'utf8');
