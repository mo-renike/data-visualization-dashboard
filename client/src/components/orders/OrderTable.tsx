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
              <Box />

              {headers.map((header, index) => (
                <TableHeader key={index}>{header}</TableHeader>
              ))}
              <th className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className="text-[#64748B]">•••</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#F1F5F9]">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-blue-50 align-middle">
                <Box />
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
    </div>
  );
};

export default OrderTable;
