import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, Users, Calculator, ArrowRight } from 'lucide-react';

// Add keyframes for the gradient animation
const gradientAnimation = {
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' }
};

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Smart Receipt Parsing",
      description: "Upload your receipt and let our AI do the heavy lifting"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Easy Group Splitting",
      description: "Split bills with friends in seconds, not minutes"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Custom Splits",
      description: "Fine-tune how you split each item with custom percentages"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Split Bills with
            <span className="text-blue-600 relative inline-flex items-center ml-4">
              AI
              <motion.span
                className="ml-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                ✨
              </motion.span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The smartest way to split bills with friends. Upload receipts, customize splits, and settle up in seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/upload')}
            className="relative group bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto overflow-hidden"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite'
            }}
          >
            {/* Animated particles */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-blue-300/30 to-blue-400/30 blur-xl" />
            </motion.div>
            
            {/* Button content */}
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Split your bills in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              number: "1",
              title: "Upload Receipt",
              description: "Take a photo or upload your receipt"
            },
            {
              number: "2",
              title: "Add Friends",
              description: "Invite friends to split the bill with"
            },
            {
              number: "3",
              title: "Split & Pay",
              description: "Customize splits and settle up"
            }
          ].map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gray-200"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Bill Splitter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}; 