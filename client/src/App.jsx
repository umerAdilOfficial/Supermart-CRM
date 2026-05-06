import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import Customers from "./pages/Customers";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/inventory", label: "Inventory", icon: "📦" },
  { path: "/pos", label: "Point of Sale", icon: "🛒" },
  { path: "/customers", label: "Customers", icon: "👥" },
];

function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-green-600 text-white flex flex-col shadow-xl">
      <div className="px-6 py-5 border-b border-brand-700">
        <h1 className="text-xl font-bold tracking-tight">FreshMart CRM</h1>
        <p className="text-brand-300 text-xs text-gray-100 mt-0.5">
          Supermarket Management
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-brand-200 hover:bg-brand-700 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-brand-700 text-gray-200 text-xs">
        &copy; 2026 FreshMart
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
