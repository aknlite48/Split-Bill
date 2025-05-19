import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, Home, Upload, FileText } from 'lucide-react';

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-900 font-bold text-xl flex items-center space-x-2"
              >
                <Receipt className="w-6 h-6 text-blue-600" />
                <span>Bill Splitter</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/upload')}
              className={`p-2 rounded-lg transition-colors ${
                isActive('/app/upload') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              title="Upload Receipt"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/app/bill')}
              className={`p-2 rounded-lg transition-colors ${
                isActive('/app/bill') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              title="View Bill"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};