import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "../ui/InputField";
import CustomButton from "../ui/Button";
import { loginSchema } from "../../validation/validations";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setError(null);
      await login(values.email, values.password);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/customer");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="max-w-md w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="rounded-md shadow-sm p-4">
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                errors={errors.email}
                touched={touched.email}
              />
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                errors={errors.password}
                touched={touched.password}
              />
              <br />
              <CustomButton
                text={isSubmitting ? "Signing in..." : "Sign in"}
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="contained"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
