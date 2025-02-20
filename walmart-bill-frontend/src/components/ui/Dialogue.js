import React from "react";

export function Dialogue({
  isOpen,
  onClose,
  onSubmit,
  dialogueType,
  formData,
  setFormData,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {dialogueType === "item" ? "Add Item" : "Add Person"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (always visible) */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              required
            />
          </div>

          {/* Price Field (only for item) */}
          {dialogueType === "item" && (
            <div>
              <label className="block mb-1 font-medium" htmlFor="price">
                Price:
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {dialogueType === "item" ? "Add Item" : "Add Person"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
