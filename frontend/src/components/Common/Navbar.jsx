import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Todo App</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
