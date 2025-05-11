import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "../ui/InputField";
import CustomButton from "../ui/Button";
import { registerSchema } from "../../validation/validations";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setError(null);
      await registerUser(
        values.name,
        values.email,
        values.password,
        values.role
      );
      if (values.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="rounded-md shadow-sm p-4">
              <InputField
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                errors={errors.name}
                touched={touched.name}
              />
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
                autoComplete="new-password"
                showPasswordToggle
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
                errors={errors.password}
                touched={touched.password}
              />
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                showPasswordToggle
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
                errors={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
              <div>
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                    errors.role && touched.role
                      ? "border-red-300"
                      : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                >
                  <option value="">Select A Role</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>
              <br />
              <CustomButton
                text={isSubmitting ? "Creating account..." : "Create account"}
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

export default Register;
