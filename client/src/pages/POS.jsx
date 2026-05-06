import { useEffect, useState } from "react";
import { getProducts, createSale } from "../api";
import { findCustomerByPhone } from "../api";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [completing, setCompleting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (phone.length > 3) {
      findCustomerByPhone(phone)
        .then((res) => {
          if (res.data) setName(res.data.name);
          else setName("");
        })
        .catch(() => {});
    }
  }, [phone]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      if (product.stock === 0) return prev;
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    const clamped = Math.max(1, Math.min(Number(qty), product.stock));
    setCart((prev) =>
      prev.map((item) =>
        item.product === productId ? { ...item, quantity: clamped } : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const completeSale = async () => {
    console.log("NAME:", name);
    console.log("PHONE:", phone);
    if (cart.length === 0) return;
    setError("");
    setSuccess("");
    setCompleting(true);
    try {
      await createSale({
        items: cart,
        total,
        name: name || undefined,
        phone: phone || undefined,
      });
      setCart([]);
      setSuccess("Sale completed successfully!");
      setName("");
      setPhone("");
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete sale");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Point of Sale</h2>
      <p className="text-gray-500 text-sm mb-8">
        Select products to create a sale
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Products</h3>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((p) => (
                <button
                  key={p._id}
                  onClick={() => addToCart(p)}
                  disabled={p.stock === 0}
                  className={`bg-white border rounded-xl p-4 text-left transition-all shadow-sm ${
                    p.stock === 0
                      ? "opacity-40 cursor-not-allowed border-gray-100"
                      : "border-gray-200 hover:border-brand-400 hover:shadow-md cursor-pointer"
                  }`}
                >
                  <p className="font-medium text-gray-800 text-sm leading-tight">
                    {p.name}
                  </p>
                  <p className="text-brand-600 font-bold mt-1">
                    ${p.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${p.stock <= 5 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {p.stock} in stock
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-72 flex-shrink-0">
          <div className="mb-4 bg-white p-3 rounded-lg border">
            <p className="text-sm font-semibold mb-2">Customer (optional)</p>

            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mb-2 text-sm"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Current Cart
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">
                Cart is empty
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {cart.map((item) => (
                  <div key={item.product} className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-800 flex-1 pr-2 leading-tight">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-gray-300 hover:text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQty(item.product, e.target.value)
                          }
                          className="w-14 border border-gray-200 rounded px-2 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-400"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={completeSale}
                disabled={cart.length === 0 || completing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                {completing ? "Processing..." : "Complete Sale"}
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
