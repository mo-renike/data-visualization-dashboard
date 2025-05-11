import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords don't match"),
  role: Yup.string().required("Role is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const orderSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters long")
    .max(100, "Product name must be less than 100 characters"),
  productCategory: Yup.string().required("Please select a category"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  orderDate: Yup.string()
    .required("Order date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)"),
});
