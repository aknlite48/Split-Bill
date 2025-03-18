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

const SCROLL_POSITION = { current: 0 };

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
    // Only add if the name isn't empty
    setPeople((prev) => [...prev, { name, paidFor: {} }]);
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
  const handleDialogueSubmit = () => {
    if (dialogueType === "person") {
      // Add new person
      setPeople([...people, { name: dialogueFormData.name, paidFor: {} }]);
    } else if (dialogueType === "item") {
      // Add new item (make sure to parse float)
      const parsedPrice = parseFloat(dialogueFormData.price);
      if (!isNaN(parsedPrice)) {
        setItems([...items, { name: dialogueFormData.name, price: parsedPrice }]);
      }
    }
    setShowDialogue(false);
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

  const Upload_Page = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
      }
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
        console.error("Unsupported file type");
        return;
      }
    
      setIsUploading(true);
    
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
          console.error("Parsing failed", data.error);
        }
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    };
    

    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="space-y-4">
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
            accept="application/pdf,image/*" // Updated to accept both PDF and images
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
            <Button onClick={handleAddItem}>Add Item</Button>
            <Button onClick={handleAddPerson}>Add Person</Button>
          </div>
          <Button 
            onClick={() => setShowSplitDialog(true)} 
            variant="outline"
          >
            View Split
          </Button>
        </div>
        
        {/* Scrollable items section - takes available space between header and footer */}
        <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-2"
        >
          {items.map((item, index) => (
            <Card key={index} className="p-3 mb-3 relative flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0"> {/* Remove default padding for better control */}
                <div className="flex flex-col space-y-3">
                  {/* Item name and price with improved styling */}
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
                  
                  {/* Improved People Selector Section */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">Split with</p>
                      <span className="text-xs text-gray-500">{
                        people.filter(person => person.paidFor[index]).length 
                          ? `Split ${people.filter(person => person.paidFor[index]).length} ways`
                          : "Not assigned"
                      }</span>
                    </div>
                    
                    <div className="overflow-x-auto pb-1" style={{ 
                      WebkitOverflowScrolling: "touch"
                    }}>
                      <div className="flex gap-2 pb-1">
                        {people.map((person) => (
                          <button
                            key={person.name}
                            onClick={() => togglePayment(index, person.name)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Split Details</h3>
                <button 
                  onClick={() => setShowSplitDialog(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {calculateSplit().map((person) => (
                  <div key={person.name} className="py-2 border-b last:border-b-0 flex justify-between">
                    <span className="font-medium">{person.name}</span>
                    <span className="font-bold">${person.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowSplitDialog(false)}>
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