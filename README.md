
## 📘 **Loan Management System (LMS)**

A **Full-stack Loan Management System** built using **Spring Boot** (Backend) and **ReactJS** (Frontend).
The system enables users to apply for loans, upload required documents, calculate loan EMIs, track application status, and receive notifications, while admins verify documents and approve or reject loans.


## 🚀 Features

**👤 User Features**

- User registration & login (JWT-based authentication)
- Apply for loans
- Loan EMI calculator
- Upload required documents (ID, income proof, etc.)
- Track loan application status
- Receive notifications at each stage (submission, verification, approval/rejection)
- Secure access to user-specific data
- Dark mode & Light mode UI support

**🛠 Admin Features**

- View all loan applications
- Review and verify uploaded documents
- Approve or reject loan applications
- Manage users and loan records
- Trigger notifications based on application status




## 🔐 Security

- JWT-based authentication
- Password encryption
- Role-based access control (USER / ADMIN)
- Protected APIs using Spring Security
## 🧱 Tech Stack
**Backend**

- Java
- Spring Boot
- Spring Data JPA (Hibernate)
- Spring Security
- JWT (JSON Web Token)
- MySQL
- Maven (Maven Wrapper)


**Frontend**

- ReactJS
- Axios
- React Router
- Context API
- Formik & Yup (forms & validation)
- CSS
- Dark / Light theme support
## 📂 Project Structure

```
Loan_Management_System/
│
├── lms_backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/trumio/lms/
│ │ │ │ ├── controller/
│ │ │ │ ├── service/
│ │ │ │ ├── repository/
│ │ │ │ └── model/
│ │ │ └── resources/
│ │ │ └── application.properties
│ │ └── test/
│ │ └── java/
│ │ └── com/trumio/lms/
│ │
│ ├── .env.example
│ ├── pom.xml
│ └── mvnw
│
├── lms_frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── context/
│ │
│ ├── public/
│ ├── .env.example
│ └── package.json
│
└── README.md
```
## ⚙️ Prerequisites

Ensure the following are installed:

- Java 17 or above
- Node.js (LTS)
- npm
- MySQL
- Git
## 🔧 Backend Setup

1️⃣ **Clone the repository**

- git clone <your-repo-url>

- cd Loan_Management_System/lms_backend

2️⃣ **Create .env file**

Copy the example file:

- .env.example .env


Update .env with your local values:

DB_USER=your_db_username

DB_PASSWORD=your_db_password

JWT_SECRET_KEY=your_secret_key
JWT_EXPIRATION=86400000


⚠️ .env files are not committed to GitHub for security reasons.


3️⃣ **Run the backend**

- mvnw spring-boot:run


Backend starts on: http://localhost:8081
## 🎨 Frontend Setup

1️⃣ **Navigate to frontend**

- cd ../lms_frontend

2️⃣ **Install dependencies**

- npm install

3️⃣ **Create .env file**

- cp .env.example .env


Example: REACT_APP_API_URL=http://localhost:8081/api

4️⃣ **Start frontend**

- npm start


Frontend runs on: http://localhost:3000

## 🔗 API Overview

🔐 **Authentication**

- POST /api/auth/register – Register user

- POST /api/auth/login – Login user and receive JWT

💼 **Loan Management**

- POST /api/loans/apply – Apply for loan

- GET /api/loans/user – View user loan applications

- GET /api/loans/all – Admin: view all loan applications

- POST /api/loans/calculate – Loan EMI calculation

📂 **Document Management**

- POST /api/documents/upload – Upload documents

- GET /api/documents/{loanId} – View uploaded documents

- PUT /api/documents/verify – Admin: verify documents
## 🔔 Notification Flow

Notifications are sent to users at each stage:

- Loan application submitted
- Documents uploaded
- Documents verified
- Loan approved or rejected
##  🧪 Testing

The application is tested using a combination of **automated backend testing** and **manual frontend and API testing** to ensure correctness, security, and reliability across different user roles and workflows.

- Backend unit and integration tests are implemented using **JUnit 5**.
- **Mockito** is used to mock dependencies and isolate service-layer business logic.
- Test cases cover controller endpoints, service logic, and authentication/authorization flows.
- All backend test cases are organized under the `src/test/java` directory.
- Backend REST APIs are manually tested using **Postman**.
- Frontend form validation is implemented and verified using **Formik & Yup**.
- Role-based application flows are tested for both **USER** and **ADMIN** roles.
## 🌍 Environment Variables Policy

- .env → Local only (never committed)
- .env.example → Committed for reference
- Developers must create their own .env after cloning
## 🧠 Common Issues

- **401 Unauthorized** → Invalid credentials or missing JWT
- **Connection refused** → Backend not running or port mismatch
- **CORS issues** → Check backend CORS configuration
- **Documents not visible** → Pending admin verification
## 📌 Future Enhancements

- Email & SMS notifications
- Loan repayment tracking
- Admin analytics dashboard
- Cloud deployment (Docker / AWS)
## 👨‍💻 Author  

**Thaneesh Andra**
## 📄 License

This project is for learning and demonstration purposes.
