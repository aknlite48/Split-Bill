import React from "react";
import {Link, useLocation} from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md p-4 mb-6">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <div className="text-xl font-bold">SplitBill</div>
        </div>
        <div className="flex space-x-2">
          <Link 
            to="/upload" 
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
              location.pathname === "/upload" 
                ? "bg-white text-blue-700 font-medium" 
                : "hover:bg-blue-700 hover:bg-opacity-70"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </Link>
          <Link 
            to="/bill" 
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
              location.pathname === "/bill" 
                ? "bg-white text-blue-700 font-medium" 
                : "hover:bg-blue-700 hover:bg-opacity-70"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1"
            >
              <path d="M3 3v18h18" />
              <path d="M18 8V3H8v5h10z" />
              <path d="M18 15v-2h-4v2h4z" />
              <rect x="8" y="13" width="4" height="6" />
            </svg>
            Bill
          </Link>
        </div>
      </div>
    </nav>
  );
};