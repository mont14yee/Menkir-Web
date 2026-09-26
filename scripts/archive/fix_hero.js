const fs = require('fs');
let code = fs.readFileSync('components/Hero.tsx', 'utf8');
code = code.replace("import portfolioData from '../portfolio.json';", "import { usePortfolioData } from './PortfolioDataProvider';");
code = code.replace(
    /export const Hero: React\\.FC = \\(\\) => \\{\\s*const \\[isSparkVisible, setIsSparkVisible\\] = useState\\(false\\);/m,
    "export const Hero: React.FC = () => {\n    const portfolioData = usePortfolioData();\n    const [isSparkVisible, setIsSparkVisible] = useState(false);"
);
code = code.replace(
    /useEffect\\(\\(\\) => \\{ setHeroData\\(\\(portfolioData as any\\)\\.hero\\); \\}, \\[\\]\\);/m,
    "useEffect(() => { if (portfolioData) setHeroData((portfolioData as any).hero); }, [portfolioData]);"
);
fs.writeFileSync('components/Hero.tsx', code);
