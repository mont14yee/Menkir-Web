const fs = require('fs');
let code = fs.readFileSync('components/Portfolio.tsx', 'utf8');

code = code.replace("import portfolioData from '../portfolio.json';", "import { usePortfolioData } from './PortfolioDataProvider';");

code = code.replace(
    /export const Portfolio: React\\.FC<\\{\\s*setView: \\(view: View\\) => void;\\s*\\}> = \\(\\{ setView \\}\\) => \\{\\s*const \\{ searchQuery \\} = useSearch\\(\\);/m,
    "export const Portfolio: React.FC<{\n    setView: (view: View) => void;\n}> = ({ setView }) => {\n    const portfolioData = usePortfolioData();\n    const { searchQuery } = useSearch();"
);

code = code.replace(
    /useEffect\\(\\(\\) => \\{\\s*setData\\(portfolioData as any\\);\\s*const initialStates: Record<string, VideoGenerationState> = \\{\\};\\s*\\(portfolioData as any\\)\\.videos\\.forEach\\(\\(v: Video\\) => \\{\\s*initialStates\\[v\\.id\\] = \\{ status: 'idle' \\};\\s*\\}\\);\\s*setVideoStates\\(initialStates\\);\\s*\\}, \\[\\]\\);/m,
    "useEffect(() => { if (portfolioData) { setData(portfolioData as any); const initialStates: Record<string, VideoGenerationState> = {}; (portfolioData as any).videos.forEach((v: Video) => { initialStates[v.id] = { status: 'idle' }; }); setVideoStates(initialStates); } }, [portfolioData]);"
);

fs.writeFileSync('components/Portfolio.tsx', code);
