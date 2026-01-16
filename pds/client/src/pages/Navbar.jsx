import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, User, Scale, ShoppingBag, Users, Building2, FileCheck, Shield, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ userName, role, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userLinks = [
    { path: '/user/dashboard', label: 'Dashboard', icon: Home },
    { path: '/user/transactions', label: 'Transaction History', icon: History },
    { path: '/user/profile', label: 'Profile', icon: User },
  ];

  const shopkeeperLinks = [
    { path: '/shopkeeper/dashboard', label: 'Dashboard', icon: Home },
    { path: '/shopkeeper/weight-monitor', label: 'Weight Monitor', icon: Scale },
    { path: '/shopkeeper/transactions', label: 'Transaction History', icon: History },
    { path: '/shopkeeper/profile', label: 'Profile', icon: User },
  ];

  const authorityLinks = [
    { path: '/authority/dashboard', label: 'Dashboard', icon: Home },
    { path: '/authority/users', label: 'Users', icon: Users },
    { path: '/authority/shops', label: 'Shops', icon: Building2 },
    { path: '/authority/requests', label: 'Requests', icon: FileCheck },
    { path: '/authority/audit', label: 'Audit', icon: Shield },
  ];

  const links = role === 'user' ? userLinks : role === 'shopkeeper' ? shopkeeperLinks : authorityLinks;

  const getRoleColor = () => {
    switch (role) {
      case 'user':
        return 'bg-blue-600';
      case 'shopkeeper':
        return 'bg-green-600';
      case 'authority':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getRoleName = () => {
    switch (role) {
      case 'user':
        return 'Citizen Portal';
      case 'shopkeeper':
        return 'Shopkeeper Portal';
      case 'authority':
        return 'Authority Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <nav className={`${getRoleColor()} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg">{getRoleName()}</h1>
              <p className="text-xs opacity-90">{userName}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}