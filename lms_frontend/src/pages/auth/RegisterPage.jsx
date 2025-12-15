import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/api";
import { useNotification } from "../../context/NotificationContext"; // Fix import
import FormInput from "../../components/forms/FormInput";
import "../../styles/RegisterPage.css";
import PasswordRequirements from "../../components/common/PasswordRequirements";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/\d/, "Password must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...payload } = values;
      await axiosInstance.post("/auth/register", payload);
      success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="flex items-center justify-center flex-grow 
      bg-gradient-to-br from-teal-800 to-blue-700
      dark:from-[#14532d] dark:to-[#1e40af]
      pt-4 px-4 transition-colors duration-300"
      >
        <div className="w-full max-w-md">
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobileNumber: "",
              address: "",
              password: "",
              confirmPassword: "",
              Role: "USER",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-2xl mt-8 transition-colors duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center text-teal-700 dark:text-blue-300">
                  Register
                </h2>

                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />
                <FormInput
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />
                <FormInput
                  name="mobileNumber"
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />
                <FormInput
                  name="address"
                  label="Address"
                  placeholder="Enter your address"
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />
                <FormInput
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword(!showPassword)}
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />
                <PasswordRequirements password={values.password} />
                <FormInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  isPassword
                  showPassword={showConfirmPassword}
                  togglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  inputClassName="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  labelClassName="text-gray-700 dark:text-gray-200"
                />

                <button
                  type="submit"
                  className={`w-full bg-teal-600 dark:bg-blue-700 text-white p-3 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-teal-700 dark:hover:bg-blue-800 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Register"
                  )}
                </button>

                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-teal-600 dark:text-blue-300 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
