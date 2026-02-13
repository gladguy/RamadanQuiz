import { createContext, useContext, useEffect, ReactNode } from 'react';

// Sobha Premium Theme - Always Active
type Theme = 'dark';  // Only one theme: Sobha Premium

interface ThemeContextType {
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Always use dark theme (Sobha Premium)
    const theme: Theme = 'dark';

    useEffect(() => {
        // Apply Sobha Premium theme to document
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('sobha-premium-theme');
    }, []);

    const value = {
        theme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
