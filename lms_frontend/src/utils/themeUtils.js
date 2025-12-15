import { useTheme } from '../context/ThemeContext';

// Common theme-aware class generator
export const useThemeClasses = () => {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  
  return {
    // Text colors
    text: isDark ? 'text-gray-200' : 'text-gray-800',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    
    // Background colors
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    bgAlt: isDark ? 'bg-gray-800' : 'bg-gray-50',
    
    // Card/container styles
    card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    
    // Form elements
    input: isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    inputFocus: isDark ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-blue-600 focus:ring-blue-600',
    
    // Buttons
    buttonPrimary: isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    
    // Tables
    tableHeader: isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700',
    tableRow: isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50',
    
    // Transitions
    transition: 'transition-colors duration-200',
    
    // Other common UI elements as needed
  };
};