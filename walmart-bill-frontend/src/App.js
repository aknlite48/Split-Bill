import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardContent } from "./components/ui/Card";
import { Trash2, Edit, Check } from "lucide-react";
import { Dialogue } from "./components/ui/Dialogue";
import { NavBar } from "./components/NavBar"
import { Plus, UserPlus, SplitIcon} from 'lucide-react';

const SCROLL_POSITION = { current: 0 };
const HORIZONTAL_SCROLL_POSITIONS = {};

export default function App() {
  const [file, setFile] = useState(null);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [emptyBillMode, setEmptyBillMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [splitTax, setSplitTax] = useState(false);
  const [editingTax, setEditingTax] = useState(false);
  const [tempTax, setTempTax] = useState(tax);
  const [editValues, setEditValues] = useState({ name: "", price: "" });

  // Dialogue state
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogueType, setDialogueType] = useState(""); // "item" | "person"
  const [dialogueFormData, setDialogueFormData] = useState({ name: "", price: "" });

  // Refs for edit inputs
  const nameInputRef = useRef(null);
  const priceInputRef = useRef(null);

  function handleDeletePerson(nameToDelete) {
    setPeople((prev) => prev.filter((p) => p.name !== nameToDelete));
  }

  function handleAddNameWithoutClosing(name) {
    // Trim the name and check for duplicates (case-insensitive)
    const trimmedName = name.trim();
    
    // Don't add if the name is empty or already exists
    if (trimmedName === "" || people.some(person => 
        person.name.toLowerCase() === trimmedName.toLowerCase())) {
      return false; // Return false to indicate failure
    }
    
    // Add the person if validation passes
    setPeople((prev) => [...prev, { name: trimmedName, paidFor: {} }]);
    return true; // Return true to indicate success
  }

  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    const savedPeople = localStorage.getItem("people");
    const savedTax = localStorage.getItem("tax");
    //const savedTotal = localStorage.getItem("total");

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedPeople) setPeople(JSON.parse(savedPeople));
    if (savedTax) setTax(parseFloat(savedTax));
    //if (savedTotal) setTotal(parseFloat(savedTotal));
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("items", JSON.stringify(items));
    } else {
      localStorage.removeItem("items");
    }
    
    if (people.length > 0) {
      localStorage.setItem("people", JSON.stringify(people));
    } else {
      localStorage.removeItem("people");
    }
    if (tax>0) localStorage.setItem("tax", tax.toString());
    //localStorage.setItem("total", total.toString());
  }, [items, people, tax, total]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddPerson = () => {
    setDialogueType("person");
    setDialogueFormData({ name: "" }); // reset
    setShowDialogue(true);
  };

  // Open the dialogue for adding an item
  const handleAddItem = () => {
    setDialogueType("item");
    setDialogueFormData({ name: "", price: "" }); // reset
    setShowDialogue(true);
  };

  // When form is submitted in the Dialogue
// When form is submitted in the Dialogue
const handleDialogueSubmit = () => {
  if (dialogueType === "person") {
    // Add new person (with duplicate check)
    const trimmedName = dialogueFormData.name.trim();
    
    // Don't add if the name is empty or already exists
    if (trimmedName === "" || people.some(person => 
        person.name.toLowerCase() === trimmedName.toLowerCase())) {
      return false; // Return false to indicate failure
    }
    
    setPeople([...people, { name: trimmedName, paidFor: {} }]);
    setShowDialogue(false);
    return true;
  } else if (dialogueType === "item") {
    // Add new item (make sure to parse float)
    const parsedPrice = parseFloat(dialogueFormData.price);
    if (!isNaN(parsedPrice)) {
      setItems([...items, { name: dialogueFormData.name.trim(), price: parsedPrice }]);
      setShowDialogue(false);
      return true;
    }
    return false;
  }
  return false;
};

  const handleTaxEdit = () => {
    setEditingTax(true);
  };

  const handleTaxChange = (e) => {
    setTempTax(e.target.value);
  };

  const saveTax = () => {
    setTax(parseFloat(tempTax) || 0);
    setEditingTax(false);
  };

  const handleTaxKeyPress = (e) => {
    if (e.key === "Enter") {
      saveTax();
    }
  };

  const togglePayment = (itemIndex, personName) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) => {
        if (person.name === personName) {
          return {
            ...person,
            paidFor: {
              ...person.paidFor,
              [itemIndex]: !person.paidFor[itemIndex],
            },
          };
        }
        return person;
      })
    );
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleEditItem = (index) => {
    if (editingIndex === index) {
      // Save the edited values
      const updatedItems = [...items];
      const newName = nameInputRef.current ? nameInputRef.current.value : items[index].name;
      const newPrice = priceInputRef.current ? parseFloat(priceInputRef.current.value) || 0 : items[index].price;
      
      updatedItems[index] = {
        name: newName,
        price: newPrice
      };
      
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      // Start editing - get the current values
      setEditingIndex(index);
    }
  };

  const calculatedTotal = items.reduce((sum, item) => sum + item.price, 0) + tax;

  const calculateSplit = () => {
    const taxPerPerson = splitTax && people.length > 0 ? tax / people.length : 0;
    return people.map((person) => {
      let personTotal = taxPerPerson;
      items.forEach((item, index) => {
        const payers = people.filter((p) => p.paidFor[index]);
        if (payers.length > 0 && person.paidFor[index]) {
          personTotal += item.price / payers.length;
        }
      });
      return { name: person.name, amount: personTotal };
    });
  };

// Modify your Upload_Page component to include an error card
const Upload_Page = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Add a new state for error handling
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
    // Clear any previous errors when a new file is selected
    setUploadError(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleBrowseClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
      // Clear any previous errors
      setUploadError(null);
    }
  };

  const handleEmptyBill = () => {
    navigate("/bill");
    setEmptyBillMode(true);
    setPeople([]);
    setItems([]);
    setTax(0);
    setTotal(0);
    localStorage.clear();
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    let endpoint = "";
    let call_point = process.env.REACT_APP_LOCAL_IP
    endpoint+=call_point ? call_point : "http://localhost"
  
    // Check the file type
    if (file.type === "application/pdf") {
      formData.append("pdf", file);
      endpoint += ":5001/upload-pdf";
    } else if (file.type.startsWith("image/")) {
      formData.append("image", file);
      endpoint += ":5001/upload-image";
    } else {
      // Set error for unsupported file type
      setUploadError("Unsupported file type. Please upload a PDF or image file.");
      return;
    }
  
    setIsUploading(true);
    setUploadError(null); // Clear previous errors
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setItems(data.extractedData.items);
        setTax(data.extractedData.tax);
        setTotal(data.extractedData.total);
        setPeople([]);
        navigate("/bill");
      } else {
        // Set error from the API
        setUploadError(data.error || "Failed to parse receipt. Please try a different image or upload manually.");
      }
    } catch (error) {
      // Set error for network/server issues
      setUploadError("Failed to upload. Check your internet connection or try again later.");
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Function to dismiss the error
  const dismissError = () => {
    setUploadError(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Error Card */}
        {uploadError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-fade-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{uploadError}</p>
                </div>
              </div>
              <button 
                onClick={dismissError} 
                className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      
        <div
          className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          {file ? (
            <p className="text-gray-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag &amp; drop your PDF here or{" "}
              <span className="text-blue-500 underline">click</span> to select
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className="mt-2">
            {file?.type === "application/pdf" ? (
              <embed
                src={previewUrl}
                width="100%"
                height="500px"
                type="application/pdf"
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Receipt preview" 
                className="max-w-full mx-auto max-h-96 object-contain" 
              />
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Receipt"
            )}
          </Button>

          <Button onClick={handleEmptyBill} variant="outline">
            Empty Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

  const Bill_Page = () => {
    const [showSplitDialog, setShowSplitDialog] = useState(false);
    const scrollContainerRef = useRef(null);
  
  // Save and restore scroll position
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      // Restore scroll position
      container.scrollTop = SCROLL_POSITION.current;
      
      // Save scroll position when scrolling
      const handleScroll = () => {
        SCROLL_POSITION.current = container.scrollTop;
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, [items, editingIndex]);
    
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto overflow-hidden">
        {/* Fixed header with buttons */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
        <div className="flex space-x-2">
        <Button 
          onClick={handleAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </Button>
        <Button 
          onClick={handleAddPerson}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
        >
          <UserPlus size={18} />
          <span>Add Person</span>
        </Button>
      </div>
      <Button 
        onClick={() => setShowSplitDialog(true)} 
        className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
      >
        <SplitIcon size={18} />
        <span>View Split</span>
      </Button>
        </div>
        
        {/* Scrollable items section - takes available space between header and footer */}
        <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-2"
        >
          {items.map((item, index) => (
            <Card key={index} className="p-3 mb-3 relative flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col space-y-3">
                  {/* Item name and price */}
                  {editingIndex === index ? (
                    <div className="flex space-x-2">
                      <input
                        ref={nameInputRef}
                        className="border p-2 flex-grow rounded-md"
                        type="text"
                        defaultValue={item.name}
                        autoFocus
                      />
                      <input
                        ref={priceInputRef}
                        className="border p-2 w-28 rounded-md"
                        type="number"
                        defaultValue={item.price}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold text-lg text-gray-800">{item.name}</span>
                      <span className="font-bold text-lg text-blue-600">${item.price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* People buttons with horizontal scrolling - with scroll position tracking */}
                  <div className="pt-1">
                    <p className="text-sm text-gray-700 mb-2">Paid by:</p>
                    <div 
                      id={`item-${index}-scroll-container`}
                      className="overflow-x-auto pb-1" 
                      style={{ WebkitOverflowScrolling: "touch" }}
                      ref={(el) => {
                        // When component mounts or updates, restore scroll position
                        if (el) {
                          el.scrollLeft = HORIZONTAL_SCROLL_POSITIONS[`item-${index}`] || 0;
                          
                          // Add scroll event listener if not already added
                          if (!el.hasScrollListener) {
                            el.addEventListener('scroll', () => {
                              HORIZONTAL_SCROLL_POSITIONS[`item-${index}`] = el.scrollLeft;
                            });
                            el.hasScrollListener = true;
                          }
                        }
                      }}
                    >
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        minWidth: "min-content"
                      }}>
                        {people.map((person) => (
                          <button
                            key={person.name}
                            onClick={() => {
                              // Save current scroll position before toggling payment
                              const scrollContainer = document.querySelector(`#item-${index}-scroll-container`);
                              if (scrollContainer) {
                                HORIZONTAL_SCROLL_POSITIONS[`item-${index}`] = scrollContainer.scrollLeft;
                              }
                              togglePayment(index, person.name);
                            }}
                            className={`
                              px-3 py-1.5 rounded-full text-sm font-medium transition-all
                              ${person.paidFor[index] 
                                ? "bg-blue-100 text-blue-800 border border-blue-200 shadow-sm" 
                                : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"}
                            `}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {person.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit/Delete buttons */}
                  <div className="flex justify-end space-x-2 pt-2 border-t mt-1">
                    <button
                      onClick={() => handleEditItem(index)}
                      className="text-gray-600 hover:text-blue-600 p-1 transition-colors"
                    >
                      {editingIndex === index ? (
                        <Check size={20} />
                      ) : (
                        <Edit size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-gray-600 hover:text-red-600 p-1 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Fixed footer with tax and total - always visible */}
        <div className="p-4 border-t bg-white sticky bottom-0 z-10">
          <div className="mb-2 p-3 border rounded flex justify-between items-center">
            <div>
              <p>
                <strong>Tax:</strong>
              </p>
            </div>
            <div>
              {editingTax ? (
                <input
                  type="number"
                  className="border p-1 w-20 text-center"
                  value={tempTax}
                  onChange={handleTaxChange}
                  onBlur={saveTax}
                  onKeyDown={handleTaxKeyPress}
                  autoFocus
                />
              ) : (
                <span
                  className="cursor-pointer text-blue-600 font-bold"
                  onClick={handleTaxEdit}
                >
                  ${tax.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={splitTax}
                onChange={() => setSplitTax(!splitTax)}
              />
              <label>Split Tax</label>
            </div>
          </div>
  
          <div className="p-3 border rounded">
            <p>
              <strong>Final Total:</strong> ${calculatedTotal.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Split Details Dialog */}
        {showSplitDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800">Split Details</h3>
                <button
                  onClick={() => setShowSplitDialog(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Calculations summary */}
              <div className="px-6 py-3 bg-blue-50 border-b">
                <div className="flex justify-between text-sm text-blue-800">
                  <span>Total bill amount:</span>
                  <span className="font-semibold">${calculatedTotal.toFixed(2)}</span>
                </div>
                {splitTax && (
                  <div className="flex justify-between text-sm text-blue-800 mt-1">
                    <span>Tax split:</span>
                    <span className="font-semibold">Evenly between {people.length} {people.length === 1 ? 'person' : 'people'}</span>
                  </div>
                )}
              </div>
              
              {/* Person list */}
              <div className="overflow-y-auto max-h-72 p-2">
                {calculateSplit().map((person, index) => (
                  <div 
                    key={person.name} 
                    className={`py-3 px-4 border-b last:border-b-0 flex justify-between items-center ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } rounded-lg my-1`}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium mr-3">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{person.name}</span>
                    </div>
                    <span className="font-bold text-lg text-blue-600">${person.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Footer with total and close button */}
              <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500">Total split: ${calculateSplit().reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
                </div>
                <Button 
                  onClick={() => setShowSplitDialog(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      {/* Dialogue for adding Person or Item */}
      <Dialogue
        isOpen={showDialogue}
        onClose={() => setShowDialogue(false)}
        onSubmit={handleDialogueSubmit}
        dialogueType={dialogueType}
        formData={dialogueFormData}
        setFormData={setDialogueFormData}
        people={people}
        onAddNameNoClose={handleAddNameWithoutClosing}
        onDeletePerson={handleDeletePerson}
      />
      
      {/* Add the NavBar component */}
      <NavBar />
      
      <Routes>
        <Route path="/upload" element={<Upload_Page />} />
        <Route path="/bill" element={<Bill_Page />} />
        {/* Add redirect from root to upload page */}
        <Route path="/" element={<Navigate to="/upload" replace />} />
      </Routes>
    </Router>
  );
}