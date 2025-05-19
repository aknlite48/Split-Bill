import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomSplitDialogue = ({ isOpen, onClose, people, itemName, onSave, currentSplits, selectedPeople }) => {
  const [splits, setSplits] = useState({});
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [error, setError] = useState('');

  // Initialize splits when component mounts or when people/currentSplits change
  useEffect(() => {
    if (people && currentSplits) {
      const initialSplits = {};
      // Only initialize splits for selected people
      selectedPeople.forEach(person => {
        initialSplits[person] = currentSplits[person] || '';
      });
      setSplits(initialSplits);
      calculateTotal(initialSplits);
    }
  }, [people, currentSplits, selectedPeople]);

  const calculateTotal = (currentSplits) => {
    const total = Object.values(currentSplits).reduce((sum, value) => {
      const numValue = parseFloat(value);
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);
    setTotalPercentage(total);
    setError(total !== 100 ? 'Percentages must add up to 100%' : '');
  };

  const handleSplitChange = (personName, value) => {
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const newSplits = { ...splits, [personName]: value };
      setSplits(newSplits);
      calculateTotal(newSplits);
    }
  };

  const handleSave = () => {
    if (totalPercentage === 100) {
      // Convert empty strings to 0 before saving
      const finalSplits = Object.entries(splits).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? 0 : parseFloat(value);
        return acc;
      }, {});
      onSave(finalSplits);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Custom Split for {itemName}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {selectedPeople.map((personName) => (
                  <div key={personName} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{personName}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        min="0"
                        max="100"
                        step="0.01"
                        value={splits[personName] || ''}
                        onChange={(e) => handleSplitChange(personName, e.target.value)}
                        className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Error */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className={`font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPercentage.toFixed(2)}%
                  </span>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={totalPercentage !== 100}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  totalPercentage === 100
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Split
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 