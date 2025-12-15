import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/api";

const ForgotPasswordPage = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axiosInstance.post("/auth/forgot-password", values);
      setStatus("Password reset link sent to your email.");
    } catch (error) {
      setStatus("Failed to send reset link. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow bg-gradient-to-br from-purple-400 to-indigo-500 pt-4 px-4">
        <div className="w-full max-w-md">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="w-full bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl mt-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Forgot Password</h2>

                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 mb-4"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm text-center mb-2" />

                <button
                  type="submit"
                  className={`w-full bg-purple-600 text-white p-3 rounded-lg transition-transform duration-300 hover:scale-105 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                {status && <p className="text-center text-sm text-green-600 mt-4">{status}</p>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
