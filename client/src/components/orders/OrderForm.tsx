import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define form schema
const orderSchema = Yup.object({
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

interface OrderFormValues {
  productName: string;
  productCategory: string;
  price: number;
  orderDate: string;
}

interface OrderFormProps {
  onSubmit: (data: OrderFormValues) => void;
  onCancel: () => void;
  customerName: string;
}

const categories = ["Drama", "Comedy", "Sci-Fi", "Horror", "Documentary"];

const OrderForm = ({ onSubmit, onCancel, customerName }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: OrderFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues: OrderFormValues = {
    productName: "",
    productCategory: "",
    price: 0,
    orderDate: new Date().toISOString().split("T")[0],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={orderSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              disabled
              value={customerName}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <Field
              id="productName"
              name="productName"
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.productName && touched.productName
                  ? "border-red-300"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            <ErrorMessage
              name="productName"
              component="p"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="productCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Product Category
            </label>
            <Field
              as="select"
              id="productCategory"
              name="productCategory"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.productCategory && touched.productCategory
                  ? "border-red-300"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="productCategory"
              component="p"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Field
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className={`block w-full pl-7 pr-12 py-2 border ${
                  errors.price && touched.price
                    ? "border-red-300"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="0.00"
              />
            </div>
            <ErrorMessage
              name="price"
              component="p"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div>
            <label
              htmlFor="orderDate"
              className="block text-sm font-medium text-gray-700"
            >
              Order Date
            </label>
            <Field
              id="orderDate"
              name="orderDate"
              type="date"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.orderDate && touched.orderDate
                  ? "border-red-300"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            <ErrorMessage
              name="orderDate"
              component="p"
              className="mt-1 text-xs text-red-600"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OrderForm;
