import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = ({ compact = false }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqData = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email and follow the instructions sent to your inbox.',
      category: 'Account'
    },
    {
      question: 'What loan types are available?',
      answer: 'We offer Personal, Home, Education, and Business loans. Each has different eligibility criteria and interest rates.',
      category: 'Loans'
    },
    {
      question: 'How long does the loan approval process take?',
      answer: 'Most applications are processed within 2-3 business days, though complex cases may take longer.',
      category: 'Loans'
    },
    {
      question: 'How can I make loan repayments?',
      answer: 'Payments can be made through the "Make Payment" section in your dashboard using various payment methods.',
      category: 'Repayment'
    },
    {
      question: 'Can I repay my loan early?',
      answer: 'Yes, you can make prepayments or foreclosure. Check your loan terms for any applicable prepayment penalties.',
      category: 'Repayment'
    },
    {
      question: 'What documents are required for loan application?',
      answer: 'Typically, you\'ll need ID proof, address proof, income proof, and bank statements. Specific requirements vary by loan type.',
      category: 'Loans'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we employ industry-standard encryption and security practices to protect your personal and financial information.',
      category: 'Security'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'Use the "Help & Support" option in the sidebar or email us at support@yourloanapp.com.',
      category: 'Support'
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const displayData = compact ? faqData.slice(0, 4) : faqData;

  return (
    <div className={compact ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-900 py-8'}>
      <div className={`max-w-3xl mx-auto ${compact ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {/* Header - only show if not compact */}
        {!compact && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about our loan management system
            </p>
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayData.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </h3>
                </div>
                <div className="ml-4 flex-shrink-0 text-gray-500 dark:text-gray-400">
                  {openQuestion === index ? (
                    <FiChevronUp className="w-5 h-5" />
                  ) : (
                    <FiChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {openQuestion === index && (
                <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-600">
                  <div className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show more link for compact version */}
        {compact && (
          <div className="text-center mt-8">
            <a
              href="/faq"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              View All FAQs
            </a>
          </div>
        )}

        {/* Contact Support - only show if not compact */}
        {!compact && (
          <div className="mt-12">
            <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
              <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
              <p className="text-blue-100 mb-6">
                Our support team is here to help you with any additional questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:support@yourloanapp.com"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Email Support
                </a>
                <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;