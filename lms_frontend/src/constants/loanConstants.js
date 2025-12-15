// Loan Types
export const LOAN_TYPES = [
  { value: "HOME", label: "Home Loan", interestRate: 8.5 },
  { value: "PERSONAL", label: "Personal Loan", interestRate: 12.5 },
  { value: "EDUCATION", label: "Education Loan", interestRate: 9.0 },
  { value: "VEHICLE", label: "Vehicle Loan", interestRate: 10.0 },
  { value: "BUSINESS", label: "Business Loan", interestRate: 11.0 }
];

// Employment Types
export const EMPLOYMENT_TYPES = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self Employed" },
  { value: "BUSINESS", label: "Business Owner" },
  { value: "RETIRED", label: "Retired" }
];

// Loan Status
export const LOAN_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED'
};

// Document Types
export const DOCUMENT_TYPES = [
  { value: "AADHAR", label: "Aadhar Card" },
  { value: "PAN", label: "PAN Card" },
  { value: "PASSPORT", label: "Passport" },
  { value: "SALARY_SLIP", label: "Salary Slip" },
  { value: "BANK_STATEMENT", label: "Bank Statement" }
];

// Document Categories
export const DOCUMENT_CATEGORIES = [
  { value: "ID_PROOF", label: "ID Proof" },
  { value: "INCOME_PROOF", label: "Income Proof" },
  { value: "ADDRESS_PROOF", label: "Address Proof" }
];

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};