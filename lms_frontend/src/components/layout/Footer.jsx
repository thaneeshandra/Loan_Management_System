// src/components/Footer.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme?.mode === 'dark' || theme?.theme === 'dark' || theme?.isDark === true;

  return (
    <footer className={`py-12 mt-12 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-t border-gray-700'
        : 'bg-gradient-to-br from-blue-800 to-blue-600'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-white'
            }`}>
              LoanManager
            </h3>
            <p className={`mb-4 leading-relaxed transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-200'
            }`}>
              Your trusted partner for secure, fast, and transparent loan processing. 
              We make financial solutions accessible and straightforward for everyone.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a 
                href="#" 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-blue-300 hover:bg-blue-700 hover:text-white border border-gray-700'
                    : 'bg-blue-700 text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
                aria-label="Facebook"
              >
                <span className="text-lg font-bold">f</span>
              </a>
              <a 
                href="#" 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-blue-300 hover:bg-blue-400 hover:text-white border border-gray-700'
                    : 'bg-blue-700 text-blue-100 hover:bg-blue-400 hover:text-white'
                }`}
                aria-label="Twitter"
              >
                <span className="text-lg font-bold">t</span>
              </a>
              <a 
                href="#" 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-blue-300 hover:bg-blue-900 hover:text-white border border-gray-700'
                    : 'bg-blue-700 text-blue-100 hover:bg-blue-900 hover:text-white'
                }`}
                aria-label="LinkedIn"
              >
                <span className="text-lg font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-blue-200' : 'text-white'
            }`}>
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-2">
              <li>
                <Link to="/about" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>How It Works</Link>
              </li>
              <li>
                <Link to="/loan-types" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>Loan Types</Link>
              </li>
              <li>
                <Link to="/faq" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className={`hover:underline transition-colors whitespace-nowrap ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-300' : 'text-gray-100 hover:text-blue-200'
                }`}>Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`border-t py-6 mb-6 transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-blue-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <h5 className={`font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-white'
              }`}>
                📞 Phone
              </h5>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-100'
              }`}>
                +91 1234567890
              </p>
            </div>
            <div>
              <h5 className={`font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-white'
              }`}>
                ✉️ Email
              </h5>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-100'
              }`}>
                support@loanmanager.com
              </p>
            </div>
            <div>
              <h5 className={`font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-white'
              }`}>
                📍 Address
              </h5>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-100'
              }`}>
                123 Business Street, City, State 12345
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`text-center border-t pt-6 transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-blue-800'
        }`}>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-100'
          }`}>
            &copy; {new Date().getFullYear()} LoanManager. All rights reserved.
          </p>
          <p className={`text-sm mt-2 transition-colors duration-300 ${
            isDarkMode ? 'text-blue-700' : 'text-blue-200'
          }`}>
            Built with ❤️ for better financial solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;