## Demo Credentials Setup

For development with demo login functionality:

1. Copy `.env.example` to `.env`
2. Set your demo credentials in the `.env` file
3. Restart your development server

# Development Notes

## Demo Authentication

This application includes demo user functionality for testing purposes. 

⚠️ **IMPORTANT**: Demo credentials should NEVER be used in production environments. The demo authentication
feature should be disabled in production by not setting the demo environment variables.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Step-by-Step Guide

### For Users

#### Getting Started
1. **Create an Account**
   - Navigate to the [Register](https://yourapp.com/register) page
   - Enter your personal details
   - Submit the form to create your account

2. **Complete Your Profile**
   - Access your profile from the sidebar menu
   - Fill in all required personal information
   - Add your address and contact details
   - Save changes to complete your profile

3. **Apply for a Loan**
   - Navigate to "Apply for Loan" in the sidebar
   - Choose your preferred loan type
   - Enter the requested amount and tenure
   - Provide employment and income details
   - Review and submit your application

4. **Upload Required Documents**
   - Go to "Documents" in the sidebar
   - Select the document type (ID, Income, Address proof)
   - Upload clear, legible documents in supported formats
   - Submit for verification

5. **Track Your Application**
   - Check loan status from the Dashboard
   - View detailed information in "Loan History"
   - Track status changes (Pending → Approved/Rejected)

6. **Managing Repayments**
   - View your repayment schedule in the loan details page
   - Make payments through the "Make Payment" option
   - Download receipts for completed transactions
   - Set reminders for upcoming payments

### For Administrators

1. **Dashboard Overview**
   - Access key metrics on the Admin Dashboard
   - Monitor total users, loans, and pending approvals
   - Track system performance and loan activity

2. **Managing Loan Applications**
   - Review pending loan applications from the "Manage Loans" page
   - Analyze applicant details and uploaded documents
   - Approve or reject applications based on eligibility
   - Add notes for internal reference

3. **User Management**
   - View all registered users
   - Modify user roles and permissions
   - Address account-related issues

4. **System Configuration**
   - Update interest rates and loan parameters
   - Configure document requirements
   - Manage system notifications and alerts

loan transactions,
token refresher,
loan documents,
profile pic,
kyc,
bank details,
Credit score analysis.
dynamic emi calculator,
eligibility criteria and docs req,
check personal loan eligibility,
step by steep guide
## Frequently Asked Questions

### Account Management

**Q: How do I reset my password?**  
A: Click on "Forgot Password" on the login page. Enter your registered email and follow the instructions sent to your inbox.

**Q: Can I update my personal information after registration?**  
A: Yes, navigate to your Profile page from the sidebar menu to update your personal details.

**Q: What should I do if I can't log in?**  
A: Ensure you're using the correct email and password. If problems persist, use the "Forgot Password" option or contact support.

**Q: How can I change my account email address?**  
A: Email addresses cannot be changed directly. Please contact support for assistance.

### Loan Applications

**Q: What loan types are available?**  
A: We offer Personal, Home, Education, and Business loans. Each has different eligibility criteria and interest rates.

**Q: How is the EMI calculated?**  
A: EMI is calculated based on principal amount, interest rate, and loan tenure using the formula: P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal, r is monthly interest rate, and n is number of months.

**Q: What documents are required for loan application?**  
A: Typically, you'll need ID proof, address proof, income proof, and bank statements. Specific requirements vary by loan type.

**Q: How long does the loan approval process take?**  
A: Most applications are processed within 2-3 business days, though complex cases may take longer.

**Q: Why was my loan application rejected?**  
A: Applications may be rejected due to insufficient income, poor credit history, incomplete documentation, or not meeting eligibility criteria.

### Loan Repayment

**Q: How can I make loan repayments?**  
A: Payments can be made through the "Make Payment" section in your dashboard using various payment methods.

**Q: Can I repay my loan early?**  
A: Yes, you can make prepayments or foreclosure. Check your loan terms for any applicable prepayment penalties.

**Q: Will I be charged for late payments?**  
A: Yes, late payments incur penalties as specified in your loan agreement. Regular on-time payments help maintain a good credit score.

**Q: How do I download payment receipts?**  
A: Visit your payment history section and click on "Download Receipt" for the transaction you need.

### Technical Support

**Q: The website is not loading properly. What should I do?**  
A: Clear your browser cache, ensure you're using the latest browser version, or try accessing from a different browser.

**Q: How can I contact customer support?**  
A: Use the "Help & Support" option in the sidebar or email us at support@yourloanapp.com.

**Q: Is my data secure?**  
A: Yes, we employ industry-standard encryption and security practices to protect your personal and financial information.
