const fs = require('fs');
let code = fs.readFileSync('components/Portfolio.tsx', 'utf8');
code = code.replace(
    /export const Portfolio: React\.FC<\{\n    setView: \(view: View\) => void;\n\}> = \(\{ setView \}\) => \{/,
    "export const Portfolio: React.FC<{\n    setView: (view: View) => void;\n}> = ({ setView }) => {\n    const portfolioData = usePortfolioData();"
);
fs.writeFileSync('components/Portfolio.tsx', code);
