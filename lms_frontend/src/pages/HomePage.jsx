// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoanCalculator from '../components/common/LoanCalculator';
import FAQ from '../components/common/FAQ';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme?.mode === 'dark' || theme?.theme === 'dark' || theme?.isDark === true;

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with animated background */}
        <section className={`relative py-24 overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className={`absolute top-20 left-10 w-20 h-20 rounded-full ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            } opacity-10 animate-float`}></div>
            <div className={`absolute top-40 right-20 w-32 h-32 rounded-full ${
              isDarkMode ? 'bg-green-400' : 'bg-green-500'
            } opacity-10 animate-float-delayed`}></div>
            <div className={`absolute bottom-20 left-1/4 w-16 h-16 rounded-full ${
              isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
            } opacity-10 animate-pulse`}></div>
            <div className={`absolute bottom-40 right-1/3 w-24 h-24 rounded-full ${
              isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'
            } opacity-10 animate-float-slow`}></div>
            
            {/* Dollar sign animations */}
            <div className={`absolute top-1/4 left-1/3 text-4xl ${
              isDarkMode ? 'text-green-400' : 'text-green-500'
            } opacity-20 animate-float-up`}>$</div>
            <div className={`absolute bottom-1/3 right-1/4 text-5xl ${
              isDarkMode ? 'text-green-400' : 'text-green-500'
            } opacity-20 animate-float-up-delayed`}>$</div>
          </div>
          
          {/* Content with gradient background */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className={`rounded-2xl shadow-xl text-white p-12 max-w-4xl mx-auto transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800 shadow-blue-900/50' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700'
            }`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Welcome to Loan Management System
              </h1>
              <p className={`text-lg md:text-xl mb-8 ${
                isDarkMode ? 'text-blue-100' : 'text-blue-100'
              }`}>
                Secure, fast, and transparent loan processing. Apply, track, and manage your loan 
                applications all in one place.
              </p>
              <Link
                to="/register"
                className={`inline-block px-8 py-4 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-white text-blue-800 hover:bg-gray-100'
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition / Features Section */}
        <section className={`py-16 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>Why Choose Our Platform</h2>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className={`rounded-lg shadow-md p-8 text-center h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border-t-4 border-blue-500 ${
                  isDarkMode ? 'bg-gray-700 hover:shadow-blue-900/50' : 'bg-white'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                    <span className={`text-2xl ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>✓</span>
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Easy Application</h2>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Apply for your loan in minutes with our simple and intuitive application process.</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className={`rounded-lg shadow-md p-8 text-center h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border-t-4 border-green-500 ${
                  isDarkMode ? 'bg-gray-700 hover:shadow-green-900/50' : 'bg-white'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                  }`}>
                    <span className={`text-2xl ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>⚡</span>
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Fast Approval</h2>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Stay informed with real-time approval updates and quick decisions.</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className={`rounded-lg shadow-md p-8 text-center h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border-t-4 border-purple-500 ${
                  isDarkMode ? 'bg-gray-700 hover:shadow-purple-900/50' : 'bg-white'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                  }`}>
                    <span className={`text-2xl ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>🔒</span>
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Secure Transactions</h2>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Experience reliable, secure processing of all your financial details.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={`py-20 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-700 to-gray-800' 
            : 'bg-gradient-to-b from-gray-100 to-white'
        }`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>How It Works</h2>
            <div className="flex flex-col md:flex-row justify-around max-w-5xl mx-auto">
              <div className={`text-center p-6 mb-8 md:mb-0 relative rounded-xl shadow-md transform transition-all duration-500 hover:scale-105 ${
                isDarkMode ? 'bg-gray-600 shadow-gray-900/50' : 'bg-white'
              }`}>
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}>1</div>
                <div className="pt-8">
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Register</h3>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Create your account in minutes with our easy signup process.</p>
                </div>
              </div>
              
              <div className="hidden md:block w-12 self-center">
                <div className={`border-t-2 border-dashed ${
                  isDarkMode ? 'border-blue-400' : 'border-blue-300'
                }`}></div>
              </div>
              
              <div className={`text-center p-6 mb-8 md:mb-0 relative rounded-xl shadow-md transform transition-all duration-500 hover:scale-105 ${
                isDarkMode ? 'bg-gray-600 shadow-gray-900/50' : 'bg-white'
              }`}>
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}>2</div>
                <div className="pt-8">
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Apply for Loan</h3>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Submit your loan details using our guided application form.</p>
                </div>
              </div>
              
              <div className="hidden md:block w-12 self-center">
                <div className={`border-t-2 border-dashed ${
                  isDarkMode ? 'border-blue-400' : 'border-blue-300'
                }`}></div>
              </div>
              
              <div className={`text-center p-6 relative rounded-xl shadow-md transform transition-all duration-500 hover:scale-105 ${
                isDarkMode ? 'bg-gray-600 shadow-gray-900/50' : 'bg-white'
              }`}>
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}>3</div>
                <div className="pt-8">
                  <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>Get Approved</h3>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Receive approval and secure fund disbursement swiftly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-20 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>What Our Customers Say</h2>
            <div className="flex flex-col md:flex-row justify-around max-w-5xl mx-auto">
              <div className={`shadow-lg rounded-lg p-8 mb-8 md:mb-0 md:mr-6 relative transform transition-all duration-300 hover:-translate-y-2 ${
                isDarkMode ? 'bg-gray-700 shadow-gray-900/50' : 'bg-white'
              }`}>
                <div className={`absolute -top-5 left-8 text-6xl ${
                  isDarkMode ? 'text-blue-400/50' : 'text-blue-200'
                }`}>"</div>
                <p className={`italic mb-6 pt-4 relative z-10 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  This system made applying for my loan so simple and stress-free! The dashboard keeps me updated on everything.
                </p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>JD</div>
                  <div className="ml-4">
                    <h4 className={`font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>John Doe</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Entrepreneur</p>
                  </div>
                </div>
              </div>
              
              <div className={`shadow-lg rounded-lg p-8 md:ml-6 relative transform transition-all duration-300 hover:-translate-y-2 ${
                isDarkMode ? 'bg-gray-700 shadow-gray-900/50' : 'bg-white'
              }`}>
                <div className={`absolute -top-5 left-8 text-6xl ${
                  isDarkMode ? 'text-blue-400/50' : 'text-blue-200'
                }`}>"</div>
                <p className={`italic mb-6 pt-4 relative z-10 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Fast, efficient and reliable. The transparency throughout the entire loan process was impressive.
                </p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
                  }`}>JS</div>
                  <div className="ml-4">
                    <h4 className={`font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>Jane Smith</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Small Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Calculator Section */}
        <section className={`py-20 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-700 to-gray-800' 
            : 'bg-gradient-to-b from-white to-gray-100'
        }`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>Try Our Loan Calculator</h2>
            <LoanCalculator />
          </div>
        </section>

        {/* FAQ Section */}
        {/* <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Frequently Asked Questions
            </h2>
            <FAQ compact={true} />
          </div>
        </section> */}

        {/* Call to Action Section */}
        {/* <section className={`py-16 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-700 to-indigo-800' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-700'
        }`}>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of satisfied customers who have successfully managed their loans with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 transform hover:-translate-y-1"
                >
                  Apply for Loan
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors duration-200 transform hover:-translate-y-1"
                >
                  Login to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
