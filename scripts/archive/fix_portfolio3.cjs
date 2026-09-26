const fs = require('fs');
let code = fs.readFileSync('components/Portfolio.tsx', 'utf8');

code = code.replace(
    /useEffect\(\(\) => \{ if \(portfolioData\) \{ setData\(portfolioData as any\); const initialStates: Record<string, VideoGenerationState> = \{\}; \(portfolioData as any\)\.videos\.forEach\(\(v: Video\) => \{ initialStates\[v\.id\] = \{ status: 'idle' \}; \}\); setVideoStates\(initialStates\); \} \}/,
    "useEffect(() => { if (portfolioData) { setData(portfolioData as any); const initialStates: Record<string, VideoGenerationState> = {}; (portfolioData as any).videos.forEach((v: Video) => { initialStates[v.id] = { status: 'idle' }; }); setVideoStates(initialStates); }"
);

// wait, the original `useEffect` ends somewhere else. Let's look for `}, []);` after this point.
fs.writeFileSync('components/Portfolio.tsx', code);
