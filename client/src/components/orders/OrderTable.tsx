import { useState } from "react";
import { Order } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";
import TextComponent from "../ui/TextComponent";
import { formatDate, formatPrice } from "../../utils/helper";
import Box from "../ui/Box";
import { TableBtn, TableCell, TableHeader } from "./TableUtils";

interface OrderTableProps {
  orders: Order[];
  onOpenForm?: () => void;
}

const OrderTable = ({ orders, onOpenForm }: OrderTableProps) => {
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === "admin";

  const headers = [
    "Customer name",
    "Product name",
    "Category",
    "Date",
    "Price",
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white overflow-hidden p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <TextComponent text="Orders" smallTitleText />
        {!isAdmin && (
          <TableBtn onClick={onOpenForm}>
            <Plus size={18} className="mr-1" />
            Create an Order
          </TableBtn>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 rounded-lg">
              <th>
                {" "}
                <Box />
              </th>

              {headers.map((header, index) => (
                <TableHeader key={index}>{header}</TableHeader>
              ))}
              <th className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className="text-[#64748B]">•••</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F1F5F9]">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50 align-middle">
                <th>
                  {" "}
                  <Box />
                </th>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.productCategory}</TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>{formatPrice(order.price)}</TableCell>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <span className="text-[#64748B]">•••</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            currentPage === 1 ? "bg-gray-200" : "bg-blue-500 text-white text-xs"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 text-xs rounded ${
            currentPage === totalPages
              ? "bg-gray-200"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderTable;
