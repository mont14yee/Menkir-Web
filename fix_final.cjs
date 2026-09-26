const fs = require('fs');

// Header.tsx
let headerCode = fs.readFileSync('components/Header.tsx', 'utf8');
headerCode = headerCode.replace(
    /export const Header: React\.FC<\{\s*setView: \(view: View\) => void,\s*season: Season\s*\}> = \(\{ setView, season \}\) => \{/,
    "export const Header: React.FC<{ setView: (view: View) => void, season: Season }> = ({ setView, season }) => { const portfolioData = usePortfolioData();"
);
fs.writeFileSync('components/Header.tsx', headerCode);

// Portfolio.tsx
let portfolioCode = fs.readFileSync('components/Portfolio.tsx', 'utf8');
portfolioCode = portfolioCode.replace(
    /useEffect\(\(\) => \{\s*Promise\.resolve\(\{ json: \(\) => Promise\.resolve\(portfolioData\) \}\)\s*\.then\(res => res\.json\(\)\)\s*\.then\(data => \{\s*setData\(data\);\s*const initialStates: Record<string, VideoGenerationState> = \{\};\s*data\.videos\.forEach\(\(v: Video\) => \{\s*initialStates\[v\.id\] = \{ status: 'idle' \};\s*\}\);\s*setVideoStates\(initialStates\);\s*\}\)/,
    "useEffect(() => { if (portfolioData) { setData(portfolioData as any); const initialStates: Record<string, VideoGenerationState> = {}; (portfolioData as any).videos.forEach((v: Video) => { initialStates[v.id] = { status: 'idle' }; }); setVideoStates(initialStates); } }"
);
// Make sure .catch is also removed since it's now synchronous inside the useEffect
portfolioCode = portfolioCode.replace(
    /\s*\.catch\(err => console\.error\("Failed to load portfolio data:", err\)\);/,
    ""
);

fs.writeFileSync('components/Portfolio.tsx', portfolioCode);
