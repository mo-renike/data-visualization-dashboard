import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import OrderTable from "../../components/orders/OrderTable";
import OrderForm from "../../components/orders/OrderForm";
import { X } from "lucide-react";
import {
  createOrder,
  fetchCustomerOrders,
} from "../../services/dashboardService";
import { Order } from "../../types";
import toast from "react-hot-toast";
import TextComponent from "../../components/ui/TextComponent";
import Sidebar from "../../components/layout/SIdebar";
import Header from "../../components/layout/Header";

import { TableBtn } from "../../components/orders/TableUtils";
import Spinner from "../../components/common/Spinner";

const CustomerDashboard = () => {
  const { auth } = useAuth();
  const user = auth.user;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCustomerOrders();
      setOrders(response);

      setError(null);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderSubmit = async (orderData) => {
    try {
      await createOrder(orderData);
      setIsFormOpen(false);
      toast.success("Order created successfully!");
      await fetchOrders();
    } catch (err) {
      setError("Failed to create order. Please try again.");
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="container mx-auto max-w-6xl p-[32px]">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : orders?.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center flex flex-col items-center">
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>{" "}
              <br />
              <TableBtn onClick={() => setIsFormOpen(true)}>
                Create An Order
              </TableBtn>
            </div>
          ) : (
            <OrderTable
              orders={orders}
              onOpenForm={() => setIsFormOpen(true)}
            />
          )}

          {isFormOpen && (
            <div className="fixed inset-0 bg-[#09122782] bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-[20px]">
                  <TextComponent
                    bodyText
                    text="Create an Order"
                    className="font-semibold"
                    color="#0F172A"
                  />
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-[#232323] hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <hr />
                <OrderForm
                  onSubmit={handleOrderSubmit}
                  onCancel={() => setIsFormOpen(false)}
                  customerName={user?.name || ""}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
