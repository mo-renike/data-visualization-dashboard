import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MM/dd/yyyy");
  } catch (e) {
    return dateString;
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
