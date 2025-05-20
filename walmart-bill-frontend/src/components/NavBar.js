import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, Upload, FileText } from 'lucide-react';

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAppPage = location.pathname.startsWith('/app/');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`border-b shadow-sm ${
        isAppPage 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-800' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => navigate('/')}
                className={`font-bold text-xl flex items-center space-x-2 ${
                  isAppPage ? 'text-white' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Receipt className={`w-6 h-6 ${isAppPage ? 'text-white' : 'text-blue-600'} mr-2`} />
                  <span className="font-bold tracking-tight">SplitBill</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/upload')}
              className={`p-2 rounded-lg transition-colors ${
                isActive('/app/upload') 
                  ? isAppPage
                    ? 'text-white bg-blue-800/50' 
                    : 'text-blue-600 bg-blue-50'
                  : isAppPage
                    ? 'text-white/80 hover:text-white hover:bg-blue-800/50'
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
                  ? isAppPage
                    ? 'text-white bg-blue-800/50'
                    : 'text-blue-600 bg-blue-50'
                  : isAppPage
                    ? 'text-white/80 hover:text-white hover:bg-blue-800/50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              title="View Bill"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};