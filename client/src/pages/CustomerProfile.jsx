import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://supermart-crm-1.onrender.com/api/customers/${id}/profile`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setData(null);
      });
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-1">
        {data.customerName || "Customer"}
      </h2>
      <p className="text-gray-500 text-sm mb-4">Customer Profile</p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h3 className="font-bold text-lg">${data.totalSpent.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Orders</p>
          <h3 className="font-bold text-lg">{data.totalOrders}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Avg Order</p>
          <h3 className="font-bold text-lg">${data.averageOrder.toFixed(2)}</h3>
        </div>
      </div>

      {/* LAST PURCHASE */}
      <p className="text-sm text-gray-500 mb-4">
        Last Purchase:{" "}
        {data.lastPurchase
          ? new Date(data.lastPurchase).toLocaleString()
          : "N/A"}
      </p>

      {/* HISTORY */}
      <h3 className="text-lg font-semibold mb-3">Purchase History</h3>

      {data.sales.length === 0 ? (
        <p className="text-gray-400">No purchases yet</p>
      ) : (
        data.sales.map((sale) => (
          <div
            key={sale._id}
            className="bg-white border rounded-lg p-4 mb-4 shadow-sm"
          >
            {/* ORDER INFO */}
            <p className="text-xs text-gray-400">
              Order #{sale._id.slice(-6)} • {sale.items.length} items
            </p>

            {/* DATE */}
            <p className="text-xs text-gray-500 mb-2">
              {new Date(sale.createdAt).toLocaleString()}
            </p>

            {/* ITEMS */}
            <div className="space-y-1">
              {sale.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${sale.total?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
