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
  onDeletePerson,
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
        `}
      </style>

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        {/* The parent container has max-w-md, limiting how wide content can grow */}
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
                    // These classes ensure the box can wrap onto multiple lines:
                    className="
                      group
                      inline-flex
                      flex-wrap
                      items-center
                      bg-gray-50
                      rounded-xl
                      px-3
                      py-1
                      max-w-full
                      break-words
                      whitespace-normal
                    "
                  >
                    <span>{p.name}</span>
                    <button
                      type="button"
                      onClick={() => onDeletePerson(p.name)}
                      className="
                        hidden
                        group-hover:inline-block
                        ml-2
                        text-red-500
                        hover:text-red-700
                        font-bold
                      "
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* For adding a person */}
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

            {/* For adding an item */}
            {dialogueType === "item" && (
              <>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="itemName"
                    className="whitespace-nowrap font-medium"
                  >
                    Item:
                  </label>
                  <input
                    id="itemName"
                    name="name"
                    type="text"
                    placeholder="Enter item name…"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none px-1 py-1"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="price"
                    className="whitespace-nowrap font-medium"
                  >
                    Price:
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price…"
                    value={formData.price || ""}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-b-2 focus:border-blue-500 focus:outline-none px-1 py-1"
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
    </>
  );
}
