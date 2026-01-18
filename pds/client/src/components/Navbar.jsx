import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  History,
  User,
  Scale,
  ShoppingBag,
  Users,
  Building2,
  FileCheck,
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function Navbar({ userName, role, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userLinks = [
    { path: "/citizen/dashboard", label: "Dashboard", icon: Home },
    { path: "/citizen/transactions", label: "Transaction History", icon: History },
    { path: "/citizen/profile", label: "Profile", icon: User }
  ];

  const shopkeeperLinks = [
    { path: "/shopkeeper/dashboard", label: "Dashboard", icon: Home },
    { path: "/shopkeeper/weight-monitor", label: "Weight Monitor", icon: Scale },
    { path: "/shopkeeper/transactions", label: "Transaction History", icon: History },
    { path: "/shopkeeper/profile", label: "Profile", icon: User }
  ];

  const authorityLinks = [
    { path: "/authority/dashboard", label: "Dashboard", icon: Home },
    { path: "/authority/users", label: "Users", icon: Users },
    { path: "/authority/shops", label: "Shops", icon: Building2 },
    { path: "/authority/requests", label: "Requests", icon: FileCheck },
    { path: "/authority/audit", label: "Audit", icon: Shield }
  ];

  const links =
    role === "user"
      ? userLinks
      : role === "shopkeeper"
      ? shopkeeperLinks
      : authorityLinks;

  const getRoleColor = () => {
    if (role === "user") return "bg-blue-600";
    if (role === "shopkeeper") return "bg-green-600";
    return "bg-purple-600";
  };

  const getRoleName = () => {
    if (role === "user") return "Citizen Portal";
    if (role === "shopkeeper") return "Shopkeeper Portal";
    return "Authority Portal";
  };

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("citizen");

    if (onLogout) {
      onLogout();
    }

    setMobileMenuOpen(false);
  };

  return (
    <nav className={`${getRoleColor()} text-white shadow-lg`}>
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg sm:text-xl">{getRoleName()}</h1>
              <p className="text-xs sm:text-sm opacity-90">{userName}</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    isActive
                      ? "bg-white bg-opacity-20"
                      : "hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* ✅ LOGOUT BUTTON (FIXED) */}
            <Link
              to="/"
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* ✅ MOBILE LOGOUT (FIXED) */}
            <Link
              to="/"
              onClick={handleLogoutClick}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
