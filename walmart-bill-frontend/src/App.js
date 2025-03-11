import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardContent } from "./components/ui/Card";
import { Trash2, Edit, Check } from "lucide-react";
import { Dialogue } from "./components/ui/Dialogue";
import { NavBar } from "./components/NavBar"; // Import the new NavBar component

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
    if (items.length > 0) localStorage.setItem("items", JSON.stringify(items));
    if (people.length > 0) localStorage.setItem("people", JSON.stringify(people));
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
    
      // Check the file type
      if (file.type === "application/pdf") {
        formData.append("pdf", file);
        endpoint = "http://localhost:5001/upload-pdf";
      } else if (file.type.startsWith("image/")) {
        formData.append("image", file);
        endpoint = "http://localhost:5001/upload-image";
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
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div>
          <div className="flex space-x-2">
            <Button onClick={handleAddItem}>Add Item</Button>
            <Button onClick={handleAddPerson}>Add Person</Button>
          </div>
          {items.map((item, index) => (
            <Card key={index} className="p-2 mb-2 relative flex flex-col">
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {/* Item name and price */}
                  {editingIndex === index ? (
                    <div className="flex space-x-2">
                      <input
                        ref={nameInputRef}
                        className="border p-1 flex-grow"
                        type="text"
                        defaultValue={item.name}
                        autoFocus
                      />
                      <input
                        ref={priceInputRef}
                        className="border p-1 w-24"
                        type="number"
                        defaultValue={item.price}
                      />
                    </div>
                  ) : (
                    <div className="font-medium">
                      {item.name} - ${item.price.toFixed(2)}
                    </div>
                  )}
                  
                  {/* Person buttons with horizontal scrolling */}
                  <div className="relative">
                    <div className="overflow-x-auto" style={{ 
                      padding: "4px 0",
                      WebkitOverflowScrolling: "touch"
                    }}>
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        minWidth: "min-content"
                      }}>
                        {people.map((person) => (
                          <Button
                            key={person.name}
                            variant={person.paidFor[index] ? "default" : "outline"}
                            onClick={() => togglePayment(index, person.name)}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {person.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit/Delete buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditItem(index)}
                      className="text-gray-600 hover:text-black p-1"
                    >
                      {editingIndex === index ? (
                        <Check size={20} />
                      ) : (
                        <Edit size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-gray-600 hover:text-black p-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mt-4 p-4 border rounded flex justify-between items-center">
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

          <div className="mt-4 p-4 border rounded">
            <p>
              <strong>Final Total:</strong> ${calculatedTotal.toFixed(2)}
            </p>
          </div>

          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Split Amounts:</h3>
            {calculateSplit().map((person) => (
              <p key={person.name}>
                {person.name}: ${person.amount.toFixed(2)}
              </p>
            ))}
          </div>
        </div>
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