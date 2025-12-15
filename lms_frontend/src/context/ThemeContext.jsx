import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Define theme palettes
const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#3f51b5',
    secondary: '#f50057',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    border: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#7986cb',
    secondary: '#ff4081',
    background: '#303030',
    surface: '#424242',
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    border: '#5c5c5c',
    error: '#e57373',
    success: '#81c784',
    warning: '#ffb74d',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.24)',
    medium: '0 4px 6px rgba(0,0,0,0.22)',
    large: '0 10px 15px rgba(0,0,0,0.2)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('lms-theme-mode');
    return savedTheme === 'dark' ? darkTheme : lightTheme;
  });

  // Toggle between light and dark themes
  const toggleTheme = React.useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme.mode === 'light' ? darkTheme : lightTheme;
      // Save to localStorage
      localStorage.setItem('lms-theme-mode', newTheme.mode);
      return newTheme;
    });
  }, []);
  
  // Set specific theme
  const setThemeMode = React.useCallback((mode) => {
    if (mode !== 'light' && mode !== 'dark') return;
    const newTheme = mode === 'light' ? lightTheme : darkTheme;
    localStorage.setItem('lms-theme-mode', mode);
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    // Apply theme to document body
    const body = document.body;
    body.dataset.theme = theme.mode;
    
    // You can also set CSS variables for global theming
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          body.style.setProperty(`--${key}-${subKey}`, subValue);
        });
      } else {
        body.style.setProperty(`--${key}`, value);
      }
    });
  }, [theme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({ theme, toggleTheme, setThemeMode }),
    [theme, toggleTheme, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};