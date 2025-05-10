import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import OrderTable from "../../components/orders/OrderTable";
import OrderForm from "../../components/orders/OrderForm";
import { Plus, X } from "lucide-react";
import { API_URL } from "../../../utils/utils";

interface Order {
  id: string;
  productName: string;
  productCategory: string;
  price: number;
  orderDate: string;
  customerName: string;
}

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
      const response = await axios.get(`${API_URL}/orders/customer`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderSubmit = async (
    orderData: Omit<Order, "id" | "customerName">
  ) => {
    try {
      await axios.post(`${API_URL}/orders`, orderData);
      setIsFormOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Create an Order
        </button>
      </div>

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
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create your first order
          </button>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}

      {/* Order Creation Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#09122782] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create an Order</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <OrderForm
              onSubmit={handleOrderSubmit}
              onCancel={() => setIsFormOpen(false)}
              customerName={user?.name || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
