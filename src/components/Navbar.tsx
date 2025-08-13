import React from 'react';
import { TrendingUp, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', path: '/analytics' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-blue-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Training Insights</h1>
              <p className="text-xs text-gray-500">Performance Analytics Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) => `px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) => `px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-md ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};