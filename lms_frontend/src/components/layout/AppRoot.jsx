import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AppRoot = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Apply dark class to html element for Tailwind dark mode
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.mode]);
  
  return null;
};

export default AppRoot;