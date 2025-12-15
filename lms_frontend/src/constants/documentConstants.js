// Document types for loan applications
export const DOCUMENT_TYPES = {
  IDENTITY_PROOF: 'Identity Proof',
  ADDRESS_PROOF: 'Address Proof',
  INCOME_PROOF: 'Income Proof',
  BANK_STATEMENT: 'Bank Statement',
  OTHER: 'Other'
};

// Document categories based on the type
export const DOCUMENT_CATEGORIES = {
  IDENTITY_PROOF: [
    { value: 'AADHAAR_CARD', label: 'Aadhaar Card' },
    { value: 'PAN_CARD', label: 'PAN Card' },
    { value: 'PASSPORT', label: 'Passport' }
  ],
  ADDRESS_PROOF: [
    { value: 'UTILITY_BILL', label: 'Utility Bill' },
    { value: 'RENTAL_AGREEMENT', label: 'Rental Agreement' }
  ],
  INCOME_PROOF: [
    { value: 'SALARY_SLIP', label: 'Salary Slip' },
    { value: 'ITR', label: 'Income Tax Return' }
  ],
  BANK_STATEMENT: [
    { value: 'SAVINGS_ACCOUNT', label: 'Savings Account Statement' }
  ],
  OTHER: [
    { value: 'OTHER_DOCUMENT', label: 'Other Document' }
  ]
};

// File size limit (in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Supported file types
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg', 
  'image/png'
];

// Document status
export const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED', 
  REJECTED: 'REJECTED'
};
// export const DOCUMENT_CATEGORIES = {