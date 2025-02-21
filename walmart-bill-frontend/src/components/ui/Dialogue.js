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
  onAddNameNoClose, // <-- new prop to add a person without closing
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // “Done” button uses this, which calls the parent’s onSubmit (closing the dialog)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Tick button uses this, which calls the parent’s onAddNameNoClose (stays open)
  const handleAddNameNoClose = () => {
    if (formData.name.trim() !== "") {
      onAddNameNoClose(formData.name);
      // Clear the name field so user can type another name
      setFormData((prev) => ({ ...prev, name: "" }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {dialogueType === "item" ? "Add Item" : "Add Person"}
        </h2>

        {/* Display existing people if we're adding a person */}
        {dialogueType === "person" && people.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Current People:</h3>
            <ul className="list-disc list-inside">
              {people.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* For adding a person: remove label, show placeholder, add tick button */}
          {dialogueType === "person" && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleAddNameNoClose}
                className="mr-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                <Check size={20} />
              </button>
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
          )}

          {/* For adding an item, you can keep the label for price, or remove it similarly */}
          {dialogueType === "item" && (
            <>
              <div>
                {/* No label above name, just a placeholder, if you prefer consistency */}
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
            
            {dialogueType === "item" ?  (<button type="form" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Add Item</button>) :
             (<button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={onClose}>Done</button>)}
          </div>
        </form>
      </div>
    </div>
  );
}
