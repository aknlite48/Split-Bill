import React, { useState } from "react";
import { Check, Plus, X } from "lucide-react";

export function Dialogue({
  isOpen,
  onClose,
  onSubmit,
  dialogueType,
  formData,
  setFormData,
  people = [],
  onAddNameNoClose,
  onDeletePerson,
}) {
  const [error, setError] = useState("");
  
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For person type, check for duplicates before submitting
    if (dialogueType === "person") {
      const trimmedName = formData.name.trim();
      if (trimmedName === "") {
        setError("Please enter a name");
        return;
      }
      
      // Check for duplicate case-insensitive
      if (people.some(person => person.name.toLowerCase() === trimmedName.toLowerCase())) {
        setError("This person is already in your list");
        return;
      }
    }
    
    onSubmit();
  };

  const handleAddNameNoClose = () => {
    const trimmedName = formData.name.trim();
    
    if (trimmedName === "") {
      setError("Please enter a name");
      return;
    }
    
    // Check for duplicate before adding
    if (people.some(person => person.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError("This person is already in your list");
      return;
    }
    
    onAddNameNoClose(trimmedName);
    setFormData((prev) => ({ ...prev, name: "" }));
    setError("");
  };

  return (
    <>
      {/* Global style to remove arrows/spinners on number inputs */}
      <style>
        {`
          /* Hide arrows for number input in Chrome, Safari, Edge, Opera */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          /* Hide arrows for number input in Firefox */
          input[type="number"] {
            -moz-appearance: textfield;
          }
          
          /* Custom scrollbar styles */
          .people-list::-webkit-scrollbar {
            width: 6px;
          }
          
          .people-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .people-list::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          
          .people-list::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
          }
          
          /* Animation for modal */
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .modal-animation {
            animation: fadeIn 0.2s ease-out forwards;
          }
          
          /* Error shake animation */
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .error-shake {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}
      </style>

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
        {/* Modal container with animation */}
        <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] flex flex-col modal-animation overflow-hidden">
          {/* Header with title and close button */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              {dialogueType === "item" ? "Add Item" : "Add Person"}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* People list section */}
            {dialogueType === "person" && people.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Current People</h3>

                <div className="people-list overflow-y-auto max-h-[30vh] pr-2">
                  <div className="flex flex-wrap gap-2">
                    {people.map((p) => (
                      <div
                        key={p.name}
                        className="
                          group
                          flex
                          items-center
                          bg-blue-50
                          text-blue-700
                          rounded-full
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          max-w-full
                        "
                      >
                        <span className="truncate">{p.name}</span>
                        <button
                          type="button"
                          onClick={() => onDeletePerson(p.name)}
                          className="
                            ml-2
                            text-blue-400
                            hover:text-red-500
                            transition-colors
                          "
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* For adding a person */}
              {dialogueType === "person" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className={`flex items-center ${error ? "error-shake" : ""}`}>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter person name..."
                      value={formData.name || ""}
                      onChange={handleChange}
                      className={`border ${error ? "border-red-500" : "border-gray-300"} rounded-l-lg px-3 py-2 w-full focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:border-transparent`}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAddNameNoClose}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
                      title="Add and continue"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {error ? (
                    <p className="text-xs text-red-500 mt-1 animate-pulse">
                      {error}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Click + to add multiple people without closing
                    </p>
                  )}
                </div>
              )}

              {/* For adding an item */}
              {dialogueType === "item" && (
                <>
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      id="itemName"
                      name="name"
                      type="text"
                      placeholder="What's being purchased?"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Footer with action buttons */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {dialogueType === "item" ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Item
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={onClose}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}