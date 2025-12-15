import React, { useEffect } from "react";
import { useFormikContext } from "formik";

const LoanInterestRateHandler = ({ loanTypesData }) => {
  const { values, setFieldValue } = useFormikContext();
  
  useEffect(() => {
    if (values.loanType) {
      const selectedLoan = loanTypesData.find(loan => loan.value === values.loanType);
      if (selectedLoan) {
        setFieldValue("interestRate", selectedLoan.interestRate);
      }
    }
  }, [values.loanType, setFieldValue, loanTypesData]);
  
  return null; // This component doesn't render anything
};

export default LoanInterestRateHandler;