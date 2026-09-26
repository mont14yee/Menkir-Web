import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioDataContext = createContext<any>(null);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        import('../portfolio.json').then((module) => {
            setData(module.default || module);
        }).catch((err) => {
            console.error("Failed to load portfolio data", err);
        });
    }, []);

    return (
        <PortfolioDataContext.Provider value={data}>
            {children}
        </PortfolioDataContext.Provider>
    );
};

export const usePortfolioData = () => useContext(PortfolioDataContext);
