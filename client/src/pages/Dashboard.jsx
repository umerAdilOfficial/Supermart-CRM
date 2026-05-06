import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2`}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
      <p className="text-gray-500 text-sm mb-8">Overview of your store performance</p>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Revenue"
            value={`$${stats.totalSalesAmount.toFixed(2)}`}
            sub={`from ${stats.totalSalesCount} transaction(s)`}
            color="text-green-600"
          />
          <StatCard
            label="Total Transactions"
            value={stats.totalSalesCount}
            sub="completed sales"
            color="text-blue-600"
          />
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            sub="in inventory"
            color="text-orange-500"
          />
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            sub="registered"
            color="text-brand-600"
          />
        </div>
      )}
    </div>
  );
}
