const fs = require('fs');

let content = fs.readFileSync('components/MysteriousMain.tsx', 'utf8');

// Add a tracking cursor
const newContent = content.replace(
    "const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);",
    `const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    
    // Custom cursor state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);`
).replace(
    "{/* Extreme Grain overlay */}",
    `{/* Spotlight tied to mouse */}
            <motion.div 
                className="fixed top-0 left-0 w-[40vw] h-[40vw] bg-white/5 rounded-full pointer-events-none blur-[100px] mix-blend-overlay z-40"
                animate={{
                    x: mousePos.x - window.innerWidth * 0.2,
                    y: mousePos.y - window.innerWidth * 0.2
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 2 }}
            />
            {/* Extreme Grain overlay */}`
);

fs.writeFileSync('components/MysteriousMain.tsx', newContent);
