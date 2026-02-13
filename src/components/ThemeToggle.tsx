import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'night' : 'day'} mode`}
        >
            {theme === 'light' ? (
                <Moon size={20} className="theme-icon" />
            ) : (
                <Sun size={20} className="theme-icon" />
            )}
        </button>
    );
};

export default ThemeToggle;
