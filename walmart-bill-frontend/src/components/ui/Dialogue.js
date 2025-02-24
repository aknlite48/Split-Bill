import React from "react";
import { Check } from "lucide-react";

export function Dialogue({
  isOpen,
  onClose,
  onSubmit,
  dialogueType,
  formData,
  setFormData,
  people = [],
  onAddNameNoClose,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleAddNameNoClose = () => {
    if (formData.name.trim() !== "") {
      onAddNameNoClose(formData.name);
      setFormData((prev) => ({ ...prev, name: "" }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {dialogueType === "item" ? "Add Item" : "Add Person"}
        </h2>

        {dialogueType === "person" && people.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Current People:</h3>
            <div className="flex flex-col items-start space-y-2 mt-2">
              {people.map((p) => (
                <div
                  key={p.name}
                  className="inline-block bg-gray-50 rounded-xl px-3 py-1"
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {dialogueType === "person" && (
            <div className="flex items-center">
              <input
                name="name"
                type="text"
                placeholder="Enter name…"
                value={formData.name || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                required
              />
              <button
                type="button"
                onClick={handleAddNameNoClose}
                className="ml-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                <Check size={20} />
              </button>
            </div>
          )}

          {dialogueType === "item" && (
            <>
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter name…"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  required
                />
              </div>
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
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            >
              Cancel
            </button>

            {dialogueType === "item" ? (
              <button
                type="form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Add Item
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={onClose}
              >
                Done
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
