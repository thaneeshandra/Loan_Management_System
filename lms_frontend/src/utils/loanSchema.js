import * as Yup from 'yup';

const loanSchema = Yup.object().shape({
  // Basic loan information
  loanType: Yup.string()
    .required('Loan type is required'),
  
  // Employment details
  employmentType: Yup.string()
    .required('Employment type is required'),
  
  // Financial details
  amountRequested: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(1000, 'Amount must be at least ₹1,000')
    .max(10000000, 'Maximum loan amount is ₹1,00,00,000'),
  
  interestRate: Yup.number()
    .required('Interest rate is required')
    .min(0.1, 'Interest rate must be positive'),
  
  loanTenure: Yup.number()
    .required('Tenure is required')
    .positive('Tenure must be positive')
    .integer('Tenure must be a whole number')
    .min(1, 'Tenure must be at least 1 year')
    .max(30, 'Tenure cannot exceed 30 years'),
  
  // Terms and conditions agreement
  agree: Yup.boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
});

export default loanSchema;