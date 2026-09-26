import fs from 'fs';

function fixComponent(file) {
    let code = fs.readFileSync(file, 'utf8');

    // Hero.tsx
    if (file === 'components/Hero.tsx') {
        code = code.replace(
            "export const Hero: React.FC = () => {",
            "export const Hero: React.FC = () => { const portfolioData = usePortfolioData();"
        );
        code = code.replace(
            "useEffect(() => { setHeroData((portfolioData as any).hero); }, []);",
            "useEffect(() => { if(portfolioData) setHeroData((portfolioData as any).hero); }, [portfolioData]);"
        );
    }
    
    // Footer.tsx
    if (file === 'components/Footer.tsx') {
        code = code.replace(
            "export const Footer: React.FC<{ variant?: 'app' | 'portfolio' }> = ({ variant = 'app' }) => {",
            "export const Footer: React.FC<{ variant?: 'app' | 'portfolio' }> = ({ variant = 'app' }) => { const portfolioData = usePortfolioData();"
        );
        code = code.replace(
            "useEffect(() => { setFooterData((portfolioData as any).footer); }, []);",
            "useEffect(() => { if(portfolioData) setFooterData((portfolioData as any).footer); }, [portfolioData]);"
        );
    }
    
    // Header.tsx
    if (file === 'components/Header.tsx') {
        code = code.replace(
            "const ProfileModal: FC<{ isOpen: boolean; onClose: () => void; season: Season; }> = ({ isOpen, onClose, season }) => {",
            "const ProfileModal: FC<{ isOpen: boolean; onClose: () => void; season: Season; }> = ({ isOpen, onClose, season }) => { const portfolioData = usePortfolioData();"
        );
        code = code.replace(
            "useEffect(() => {        setProfileData((portfolioData as any).profile);        setProfilePic((portfolioData as any).profile.pictureUrl);    }, []);",
            "useEffect(() => { if(portfolioData) { setProfileData((portfolioData as any).profile); setProfilePic((portfolioData as any).profile.pictureUrl); } }, [portfolioData]);"
        );
        code = code.replace(
            "export const Header: React.FC<HeaderProps> = ({ setView, season }) => {",
            "export const Header: React.FC<HeaderProps> = ({ setView, season }) => { const portfolioData = usePortfolioData();"
        );
        code = code.replace(
            "useEffect(() => {        const socials = (portfolioData as any).connect.filter((c: ConnectLink) => ['instagram', 'linkedin', 'telegram', 'youtube', 'tiktok'].includes(c.id));        setConnectLinks(socials);        if ((portfolioData as any).profile && (portfolioData as any).profile.pictureUrl) {            setProfilePic((portfolioData as any).profile.pictureUrl);        }    }, []);",
            "useEffect(() => { if(portfolioData) { const socials = (portfolioData as any).connect.filter((c: ConnectLink) => ['instagram', 'linkedin', 'telegram', 'youtube', 'tiktok'].includes(c.id)); setConnectLinks(socials); if ((portfolioData as any).profile && (portfolioData as any).profile.pictureUrl) { setProfilePic((portfolioData as any).profile.pictureUrl); } } }, [portfolioData]);"
        );
        // Header one-liner versions might exist because of regex, let's catch them too:
        code = code.replace(
            "useEffect(() => { setProfileData((portfolioData as any).profile); setProfilePic((portfolioData as any).profile.pictureUrl); }, []);",
            "useEffect(() => { if(portfolioData) { setProfileData((portfolioData as any).profile); setProfilePic((portfolioData as any).profile.pictureUrl); } }, [portfolioData]);"
        );
    }
    
    // Portfolio.tsx
    if (file === 'components/Portfolio.tsx') {
        code = code.replace(
            "export const Portfolio: React.FC<{    setView: (view: View) => void;}> = ({ setView }) => {",
            "export const Portfolio: React.FC<{    setView: (view: View) => void;}> = ({ setView }) => { const portfolioData = usePortfolioData();"
        );
        // And inline
        code = code.replace(
            "export const Portfolio: React.FC<{ setView: (view: View) => void; }> = ({ setView }) => {",
            "export const Portfolio: React.FC<{ setView: (view: View) => void; }> = ({ setView }) => { const portfolioData = usePortfolioData();"
        );
    }

    fs.writeFileSync(file, code);
}

fixComponent('components/Hero.tsx');
fixComponent('components/Footer.tsx');
fixComponent('components/Header.tsx');
fixComponent('components/Portfolio.tsx');
