const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');

// Add back MainContent
const mainContentCode = `
    const MainContent = () => (
        <div className="bg-[#030303] text-zinc-500 font-sans selection:bg-zinc-800/50 relative overflow-hidden">
            {/* Extreme Grain overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.25] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            
            <main className="relative z-10">
                <Hero />
                <div className="flex flex-col gap-[40vh] py-[30vh]">
                    {FeatureContent.map((feature, index) => (
                        <FeatureSection
                            key={index}
                            id={feature.id}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                            ref={el => { sectionRefs.current[index] = el }}
                        >
                            {feature.visual}
                        </FeatureSection>
                    ))}
                </div>
                <FinalCTA ref={el => { sectionRefs.current[FeatureContent.length] = el }}/>
            </main>
            <Footer />
        </div>
    );
`;

appContent = appContent.replace(
    "    const seasonalClasses: Record<Season, string> = {\n        [Season.Winter]: 'seasonal-bg-winter',\n        [Season.Spring]: 'seasonal-bg-spring',\n        [Season.Fall]: 'seasonal-bg-fall',\n    };",
    "    const seasonalClasses: Record<Season, string> = {\n        [Season.Winter]: 'seasonal-bg-winter',\n        [Season.Spring]: 'seasonal-bg-spring',\n        [Season.Fall]: 'seasonal-bg-fall',\n    };\n" + mainContentCode
);

appContent = appContent.replace(
    '<Route path="/main" element={<MysteriousMain />} />',
    '<Route path="/main" element={<MainContent />} />'
);

// We need to also pass index to FeatureSection if possible, so we'll update FeatureSection interface later.

fs.writeFileSync('App.tsx', appContent);
