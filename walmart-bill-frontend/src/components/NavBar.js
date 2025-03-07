import React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800 text-white p-4 mb-6">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">SplitBill</div>
        <div className="flex space-x-4">
          <Link 
            to="/upload" 
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/upload" 
                ? "bg-gray-900 font-medium" 
                : "hover:bg-gray-700"
            }`}
          >
            Upload
          </Link>
          <Link 
            to="/bill" 
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/bill" 
                ? "bg-gray-900 font-medium" 
                : "hover:bg-gray-700"
            }`}
          >
            Bill
          </Link>
        </div>
      </div>
    </nav>
  );
};