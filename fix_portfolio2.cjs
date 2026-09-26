const fs = require('fs');
let code = fs.readFileSync('components/Portfolio.tsx', 'utf8');

code = code.replace(
    /useEffect\\(\\(\\) => \\{\\s*Promise\\.resolve\\(\\{ json: \\(\\) => Promise\\.resolve\\(portfolioData\\) \\}\\)\\s*\\.then\\(res => res\\.json\\(\\)\\)\\s*\\.then\\(data => \\{\\s*setData\\(data\\);\\s*const initialStates: Record<string, VideoGenerationState> = \\{\\};\\s*data\\.videos\\.forEach\\(\\(v: Video\\) => \\{\\s*initialStates\\[v\\.id\\] = \\{ status: 'idle' \\};\\s*\\}\\);\\s*setVideoStates\\(initialStates\\);\\s*\\}\\)\\s*\\.catch\\(err => console\\.error\\(\\\"Failed to load portfolio data:\\\", err\\)\\);\\s*\\}, \\[\\]\\);/m,
    "useEffect(() => { if (portfolioData) { setData(portfolioData as any); const initialStates: Record<string, VideoGenerationState> = {}; (portfolioData as any).videos.forEach((v: Video) => { initialStates[v.id] = { status: 'idle' }; }); setVideoStates(initialStates); } }, [portfolioData]);"
);

fs.writeFileSync('components/Portfolio.tsx', code);
