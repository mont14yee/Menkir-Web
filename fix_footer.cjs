const fs = require('fs');
let code = fs.readFileSync('components/Footer.tsx', 'utf8');
code = code.replace("import portfolioData from '../portfolio.json';", "import { usePortfolioData } from './PortfolioDataProvider';");
code = code.replace(
    /export const Footer: React\\.FC<\\{ variant\\?: 'app' \\| 'portfolio' \\}> = \\(\\{ variant = 'app' \\}\\) => \\{\\s*const \\[footerData, setFooterData\\] = useState<any>\\(null\\);/m,
    "export const Footer: React.FC<{ variant?: 'app' | 'portfolio' }> = ({ variant = 'app' }) => {\n    const portfolioData = usePortfolioData();\n    const [footerData, setFooterData] = useState<any>(null);"
);
code = code.replace(
    /useEffect\\(\\(\\) => \\{ setFooterData\\(\\(portfolioData as any\\)\\.footer\\); \\}, \\[\\]\\);/m,
    "useEffect(() => { if (portfolioData) setFooterData((portfolioData as any).footer); }, [portfolioData]);"
);
fs.writeFileSync('components/Footer.tsx', code);
