import React, { useEffect, useState } from "react";
import axios from "axios";
import { type Order } from "../types/Order";

const API_URL = "http://localhost:5000/api/orders";

const OrderList: React.FC<{ seedTrigger?: number }> = ({ seedTrigger }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Order[]>(API_URL);
      setOrders(res.data);
      // Set last sync time on fetch
      setLastSync(new Date().toLocaleString());
      localStorage.setItem("lastSync", new Date().toISOString());
    } catch (err) {
      setMessage("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const syncOrders = async () => {
    try {
      await axios.post(`${API_URL}/sync`);
      setMessage("Orders synced successfully.");
      setLastSync(new Date().toLocaleString());
      localStorage.setItem("lastSync", new Date().toISOString());
      fetchOrders();
    } catch {
      setMessage("Failed to sync orders.");
    }
  };

  const retryOrder = async (id: string) => {
    try {
      await axios.post(`${API_URL}/retry/${id}`);
      setMessage(`Retry attempted for order ${id}.`);
      fetchOrders();
    } catch {
      setMessage("Retry failed.");
    }
  };

  useEffect(() => {
    
    const stored = localStorage.getItem("lastSync");
    if (stored) {
      setLastSync(new Date(stored).toLocaleString());
    }
    fetchOrders();
  }, [seedTrigger]);

  
  useEffect(() => {
    const interval = setInterval(async () => {
      const failedOrders = orders.filter((order) => order.status === "failed");
      if (failedOrders.length > 0) {
        await Promise.all(
          failedOrders.map((order) =>
            axios.post(`${API_URL}/retry/${order._id}`)
          )
        );
        fetchOrders();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="p-4 ">
      <div className=" flex justify-between">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold mb-4 pr-2">Sync order</h2>
          {lastSync && (
            <p className="mb-2 text-sm text-gray-500">On: {lastSync}</p>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={syncOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

          </button>
        </div>
      </div>

      {message && (
        <p className="mb-4 text-sm text-gray-700 font-medium">{message}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3 border border-gray-200 rounded-lg">
          <div className="flex items-start border-b border-gray-200 p-3 ">
            <div className="flex-1 text-left">Id</div>
            <div className="flex-1 text-left">Platforms </div>
            <div className="flex-1 text-left">Status</div>
            <div className="flex-1 text-left">Time</div>
          </div>
          {orders.map((order) => (
            <div key={order._id} className="flex items-left p-3 rounded shadow">
              <div className="flex-1 text-left">{order.orderId}</div>
              <div className="flex-1 text-left text-sm text-gray-600">
                {order.channel}
              </div>
              <div className="flex-1 text-left">
                {order.status === "failed" ? (
                  <button
                    onClick={() => retryOrder(order._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Retry
                  </button>
                ) : (
                  <p
                    className={`text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>
                )}
              </div>
              <div className="flex-1 text-left text-xs text-gray-500">
                {order.lastSyncTime && (
                  <> {new Date(order.lastSyncTime).toLocaleString()} </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status: string) => {
  if (status === "success") return "text-green-600";
  if (status === "failed") return "text-red-600";
  return "text-yellow-600";
};

export default OrderList;
