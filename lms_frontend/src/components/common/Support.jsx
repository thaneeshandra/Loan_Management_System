import React, { useState } from 'react';

const faqs = [
  {
    question: 'How can I reset my password?',
    answer: 'Click on "Forgot Password" at the login screen and follow the instructions sent to your email.',
  },
  {
    question: 'Where can I find my account settings?',
    answer: 'Go to the top-right corner of the dashboard and click on your profile icon to access settings.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach us via the contact form below or email support@example.com.',
  },
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Help & Support</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md p-4 shadow-sm">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left font-semibold text-lg"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border p-2 rounded h-32"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
