import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/api";
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from "../../context/NotificationContext";
import { demoCredentials } from "../../config/demoUsers";
import "../../styles/LoginPage.css";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { success, error, info } = useNotification();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values, setSubmitting) => {
    try {
      const response = await login(values.email, values.password);

      success(`Welcome back, ${response.userName || 'User'}!`);

      if (response.userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.message || 'Failed to login. Please try again.';
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (type) => {
    const creds = demoCredentials[type];
    info(`Logging in as demo ${type}...`);
    await handleLogin({ email: creds.email, password: creds.password }, () => {});
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow 
  bg-gradient-to-br from-blue-600 to-purple-500 
  dark:from-[#1a237e] dark:to-[#6d28d9] 
  pt-4 px-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLogin(values, actions.setSubmitting)}
          >
            {({ isSubmitting }) => (
              <Form className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl mt-8 transition-colors duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-blue-300">Login</h2>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
                </div>

                <div className="relative mb-4">
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Password</label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full p-3 pl-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                      autoComplete="off"
                      style={{
                        WebkitTextSecurity: showPassword ? "none" : "disc",
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-purple-300 z-20"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex="-1"
                    >
                      {showPassword ? "🙉" : "🙈"}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Field type="checkbox" id="rememberMe" name="rememberMe" className="mr-2" />
                    <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-300">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-indigo-500 dark:text-purple-300 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-indigo-500 dark:bg-purple-700 text-white p-3 rounded-lg transition-all duration-200 hover:bg-indigo-600 dark:hover:bg-purple-800 hover:scale-105 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Login"
                  )}
                </button>

                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo-500 dark:text-purple-300 hover:underline">Register</Link>
                </p>

                {/* <div className="mt-6 flex flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("user")}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-transform hover:scale-105"
                  >
                    Login as Demo User
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("admin")}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-transform hover:scale-105"
                  >
                    Login as Demo Admin
                  </button>
                </div> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
