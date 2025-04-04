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
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, AlertCircle, X, FileText, Image, Upload, RefreshCw } from "lucide-react";
import { Whiteboard } from "./components/Whiteboard";

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

  //previous splits
  const [previousSplit,setPreviousSplit] = useState([]);

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
    const savedPreviousSplit = localStorage.getItem("previousSplit");
    //const savedTotal = localStorage.getItem("total");

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedPeople) setPeople(JSON.parse(savedPeople));
    if (savedTax) setTax(parseFloat(savedTax));
    if (savedPreviousSplit) setPreviousSplit(JSON.parse(savedPreviousSplit));
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
    if (previousSplit.length > 0) {
      localStorage.setItem("previousSplit",JSON.stringify(previousSplit))
    } else {
      localStorage.removeItem("previousSplit");
    }
    //localStorage.setItem("total", total.toString());
  }, [items, people, tax, total,previousSplit]);

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
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  //<=== whiteboard ===>
    const handleProcessDrawing = async (drawingFile) => {
      setUploadError(null);
      
      try {
        // Create form data for API request
        const formData = new FormData();
        formData.append('image', drawingFile);
        
        // Make the API request
        const response = await fetch('/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Add to previous splits history
          addToPreviousSplits();
          
          // Update with extracted data
          setItems(data.extractedData.items);
          setTax(data.extractedData.tax);
          setTotal(data.extractedData.total);
          setPeople([]);
          
          // Close whiteboard and navigate to bill page
          setShowWhiteboard(false);
          navigate('/bill');
        } else {
          setUploadError(data.error || 'Failed to process drawing. Please try again or use a different method.');
        }
      } catch (error) {
        setUploadError('Failed to process drawing. Check your internet connection or try again later.');
        console.error('Drawing processing failed', error);
      }
    };
  //<=== whiteboard ===>    

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
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
      setUploadError(null);
    }
  };

  const addToPreviousSplits = () => {
    let previousSplitMaxLength = 5;
    let tempPreviousSplit = [{people: people,items: items,tax: tax, time_created: Date.now()},...previousSplit]
    tempPreviousSplit = (tempPreviousSplit.length>previousSplitMaxLength) ? tempPreviousSplit.slice(0, previousSplitMaxLength) : tempPreviousSplit;
    if (items.length>0) {
      setPreviousSplit(tempPreviousSplit);
    }
  }

  const handleRestoreSplit = (splitIndex, navigate) => {
    // Get the selected split from the previousSplit array
    const selectedSplit = previousSplit[splitIndex];
    
    if (!selectedSplit) {
      console.error("Split not found");
      return;
    }
    
    // Restore the split data to the app state
    setItems(selectedSplit.items);
    setPeople(selectedSplit.people);
    setTax(parseFloat(selectedSplit.tax) || 0);
    
    // Calculate total based on items and tax
    const calculatedTotal = selectedSplit.items.reduce(
      (sum, item) => sum + parseFloat(item.price), 
      0
    ) + parseFloat(selectedSplit.tax || 0);
    
    setTotal(calculatedTotal);
    
    // Save to localStorage
    localStorage.setItem("items", JSON.stringify(selectedSplit.items));
    localStorage.setItem("people", JSON.stringify(selectedSplit.people));
    localStorage.setItem("tax", selectedSplit.tax.toString());
    
    // Remove this split from the previous splits history
    const updatedPreviousSplits = [...previousSplit];
    updatedPreviousSplits.splice(splitIndex, 1);
    setPreviousSplit(updatedPreviousSplits);
    localStorage.setItem("previousSplit", JSON.stringify(updatedPreviousSplits));
    
    // Navigate to the bill page
    navigate("/bill");
  };


  const handleEmptyBill = () => {
    navigate("/bill");
    setEmptyBillMode(true);

    addToPreviousSplits();
    setPeople([]);
    setItems([]);
    setTax(0);
    setTotal(0);
    localStorage.clear(); 
  };
//{previousSplit.map((items,index)=>{return <li>{items.tax}</li>})}
const ShowPreviousSplits = () => {
  const navigate = useNavigate();
  
  if (previousSplit.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-8 max-w-md mx-auto"
    >
      <div className="flex items-center justify-center mb-2">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Recent Bills</h3>
      </div>
      
      <div className="space-y-0 overflow-hidden bg-transparent border-t border-gray-200/50">
        {previousSplit.map((split, index) => {
          // Calculate total amount of the split
          const itemsTotal = split.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
          const totalAmount = itemsTotal + parseFloat(split.tax);
          
          // Calculate time difference and format relative time
          const timeCreated = split.time_created || Date.now(); // Fallback to current time if not available
          const timeDiff = Date.now() - timeCreated;
          
          // Format the time difference
          let timeLabel;
          if (timeDiff < 60000) { // Less than 1 minute (in milliseconds)
            const seconds = Math.floor(timeDiff / 1000);
            timeLabel = `${seconds}s ago`;
          } else if (timeDiff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(timeDiff / 60000);
            timeLabel = `${minutes} min${minutes === 1 ? '' : 's'} ago`;
          } else if (timeDiff < 86400000) { // Less than 1 day
            const hours = Math.floor(timeDiff / 3600000);
            timeLabel = `${hours} hr${hours === 1 ? '' : 's'} ago`;
          } else { // 1 day or more
            const days = Math.floor(timeDiff / 86400000);
            timeLabel = `${days} day${days === 1 ? '' : 's'} ago`;
          }
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="py-2 px-3 hover:cursor-pointer hover:bg-gray-50/30 rounded-md transition-all duration-150 border-b border-gray-200/50 last:border-b-0"
              onClick={() => {
                // Get the selected split
                const selectedSplit = previousSplit[index];
                
                // Restore the split data
                setItems(selectedSplit.items);
                setPeople(selectedSplit.people);
                setTax(parseFloat(selectedSplit.tax) || 0);
                
                // Save to localStorage
                localStorage.setItem("items", JSON.stringify(selectedSplit.items));
                localStorage.setItem("people", JSON.stringify(selectedSplit.people));
                localStorage.setItem("tax", selectedSplit.tax.toString());
                
                // Remove from history
                const updatedSplits = [...previousSplit];
                updatedSplits.splice(index, 1);
                setPreviousSplit(updatedSplits);
                localStorage.setItem("previousSplit", JSON.stringify(updatedSplits));
                
                addToPreviousSplits();
                // Navigate to bill page
                navigate("/bill");
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">${totalAmount.toFixed(2)}</span>
                  <span className="mx-2 text-gray-300 opacity-50">•</span>
                  <span className="text-gray-500 text-xs">{split.items.length} {split.items.length === 1 ? 'item' : 'items'}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">{timeLabel}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    let endpoint;

  
    if (file.type === "application/pdf") {
      formData.append("pdf", file);
      endpoint = "/upload-pdf";
    } else if (file.type.startsWith("image/")) {
      formData.append("image", file);
      endpoint = "/upload-image";
    } else {
      setUploadError("Unsupported file type. Please upload a PDF or image file.");
      return;
    }
  
    setIsUploading(true);
    setUploadError(null);
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        //split history
        addToPreviousSplits();

        setItems(data.extractedData.items);
        setTax(data.extractedData.tax);
        setTotal(data.extractedData.total);
        setPeople([]);
        navigate("/bill");
      } else {
        setUploadError(data.error || "Failed to parse receipt. Please try a different image or upload manually.");
      }
    } catch (error) {
      setUploadError("Failed to upload. Check your internet connection or try again later.");
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const dismissError = () => {
    setUploadError(null);
  };

  const getFileIcon = () => {
    if (!file) return <FileUp className="h-12 w-12 text-blue-500 mb-2" />;
    return file.type === "application/pdf" ? 
      <FileText className="h-12 w-12 text-red-500 mb-2" /> : 
      <Image className="h-12 w-12 text-green-500 mb-2" />;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Upload Your Receipt</h2>
        
        <AnimatePresence>
          {uploadError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{uploadError}</p>
                  </div>
                </div>
                <button 
                  onClick={dismissError} 
                  className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="Dismiss error"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ease-in-out cursor-pointer ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : file 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center justify-center">
            {getFileIcon()}
            
            <div className="space-y-2">
              {file ? (
                <>
                  <p className="text-lg font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB • Click to change
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-700">
                    Drag & drop your receipt here
                  </p>
                  <p className="text-sm text-gray-500">
                    Or <span className="text-blue-500 font-medium">browse</span> to select a file
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports PDF and image files (JPG, PNG)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {previewUrl && (
          <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm font-medium text-gray-500 mb-2">Preview:</p>
            {file?.type === "application/pdf" ? (
              <div className="border rounded overflow-hidden">
                <embed
                  src={previewUrl}
                  width="100%"
                  height="400px"
                  type="application/pdf"
                  className="rounded"
                />
              </div>
            ) : (
              <div className="border rounded overflow-hidden bg-white">
                <img 
                  src={previewUrl} 
                  alt="Receipt preview" 
                  className="max-w-full mx-auto max-h-96 object-contain" 
                />
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Process Receipt
              </>
            )}
          </Button>

          <Button 
            onClick={handleEmptyBill} 
            variant="outline"
            className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
          >
            Start Empty Bill
          </Button>
          
          {/* Add new Whiteboard Button */}
          <Button 
            onClick={() => setShowWhiteboard(true)}
            variant="outline"
            className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
          >
            <Edit className="h-5 w-5 mr-2" />
            Draw Receipt
          </Button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>After uploading, you'll be able to edit the bill details and split costs with friends</p>
        </div>
        
      </div>
      <ShowPreviousSplits />
            <Whiteboard 
              isOpen={showWhiteboard}
              onClose={() => setShowWhiteboard(false)}
              onProcessDrawing={handleProcessDrawing}
            />
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