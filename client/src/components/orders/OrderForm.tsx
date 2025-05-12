import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { orderSchema } from "../../validation/validations";
import CustomButton from "../ui/Button";
import Label from "../ui/Label";
import InputField from "../ui/InputField";

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
        <Form>
          <div className="space-y-4 p-[20px]">
            <div>
              <Label>Customer Name</Label>
              <input
                type="text"
                disabled
                value={customerName}
                className="mt-1 block w-full p-2 border border-[#E0E2E7] rounded-lg my-1 bg-[#F9F9FC] cursor-not-allowed  text-gray-400 sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="productName">Product Name</Label>
              <InputField
                id="productName"
                name="productName"
                type="text"
                placeholder="Enter product name"
                errors={errors.productName}
                touched={touched.productName}
              />
            </div>

            <div>
              <Label htmlFor="productCategory">Product Category</Label>
              <InputField
                id="productCategory"
                name="productCategory"
                type="select"
                placeholder="Select a category"
                errors={errors.productCategory}
                touched={touched.productCategory}
                className="appearance-none"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </InputField>
            </div>

            <div>
              <Label htmlFor="price">Base Price</Label>
              <InputField
                id="price"
                name="price"
                type="number"
                placeholder="0.00"
                errors={errors.price}
                touched={touched.price}
                className="pl-7 pr-12"
              />
            </div>

            <div>
              <Label htmlFor="orderDate">Order Date</Label>
              <InputField
                id="orderDate"
                name="orderDate"
                type="date"
                placeholder="Select a date"
                errors={errors.orderDate}
                touched={touched.orderDate}
              />
            </div>
          </div>
          <hr />
          <div className="flex space-x-[12px] justify-between p-[20px]">
            <CustomButton
              text={isSubmitting ? "Creating Order..." : "Create an Order"}
              onClick={() => handleSubmit}
              disabled={isSubmitting}
            />
            <CustomButton text="Cancel" onClick={onCancel} variant="outlined" />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OrderForm;
