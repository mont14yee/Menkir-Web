const fs = require('fs');
let appContent = fs.readFileSync('App.tsx', 'utf8');

// Add import for MysteriousMain
appContent = appContent.replace("import { DownloadModal } from './components/DownloadModal';", "import { DownloadModal } from './components/DownloadModal';\nimport { MysteriousMain } from './components/MysteriousMain';");

// Remove the old MainContent function definition entirely
const mainContentRegex = /const MainContent = \(\) => \([\s\S]*?<\/>\n    \);/g;
appContent = appContent.replace(mainContentRegex, "");

// Replace <MainContent /> in Routes
appContent = appContent.replace(/<Route path="\/main" element={<MainContent \/>} \/>/g, '<Route path="/main" element={<MysteriousMain />} />');

fs.writeFileSync('App.tsx', appContent);
