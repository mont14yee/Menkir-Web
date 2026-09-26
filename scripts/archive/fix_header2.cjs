const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

code = code.replace(
    /useEffect\(\(\) => \{\s*setProfileData\(\(portfolioData as any\)\.profile\);\s*setProfilePic\(\(portfolioData as any\)\.profile\.pictureUrl\);\s*\}, \[\]\);/g,
    "useEffect(() => { if (portfolioData) { setProfileData((portfolioData as any).profile); setProfilePic((portfolioData as any).profile.pictureUrl); } }, [portfolioData]);"
);

code = code.replace(
    /export const Header: React\.FC<HeaderProps> = \(\{ setView, season \}\) => \{/,
    "export const Header: React.FC<HeaderProps> = ({ setView, season }) => { const portfolioData = usePortfolioData();"
);

code = code.replace(
    /const socials = \(portfolioData as any\)\.connect\.filter\(\(c: ConnectLink\) => \['instagram', 'linkedin', 'telegram', 'youtube', 'tiktok'\]\.includes\(c\.id\)\);\s*setConnectLinks\(socials\);\s*if \(\(portfolioData as any\)\.profile && \(portfolioData as any\)\.profile\.pictureUrl\) \{\s*setProfilePic\(\(portfolioData as any\)\.profile\.pictureUrl\);\s*\}/g,
    "if (portfolioData) { const socials = (portfolioData as any).connect.filter((c: ConnectLink) => ['instagram', 'linkedin', 'telegram', 'youtube', 'tiktok'].includes(c.id)); setConnectLinks(socials); if ((portfolioData as any).profile && (portfolioData as any).profile.pictureUrl) { setProfilePic((portfolioData as any).profile.pictureUrl); } }"
);

// We should also modify the useEffect deps for that second block
code = code.replace(
    /useEffect\(\(\) => \{\s*if \(portfolioData\) \{\s*const socials/,
    "useEffect(() => {\n        if (portfolioData) {\n            const socials"
);

fs.writeFileSync('components/Header.tsx', code);
