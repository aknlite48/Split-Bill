import React, { useState } from "react";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardContent } from "./components/ui/Card";
import { Trash2, Edit, Check, Circle } from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [emptyBillMode, setEmptyBillMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", price: "" });
  const [splitTax, setSplitTax] = useState(false); // State for tax split selection
  const [editingTax, setEditingTax] = useState(false); // State to track tax edit
  const [tempTax, setTempTax] = useState(tax); // Temporary tax value while editing

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddPerson = () => {
    const name = prompt("Enter person's name:");
    if (name) {
      setPeople([...people, { name, paidFor: {} }]);
    }
  };

  const handleAddItem = () => {
    const name = prompt("Enter item name:");
    const price = parseFloat(prompt("Enter item price:"));
    if (name && !isNaN(price)) {
      setItems([...items, { name, price }]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.extractedData.items);
        setTax(data.extractedData.tax);
        setTotal(data.extractedData.total);
        setUploaded(true);
      } else {
        console.error("Parsing failed", data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleEmptyBill = () => {
    setUploaded(true);
    setEmptyBillMode(true);
    setItems([]);
    setTax(0);
    setTotal(0);
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
  };

  const handleEditItem = (index) => {
    if (editingIndex === index) {
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { name: editValues.name, price: parseFloat(editValues.price) || 0 } : item
        )
      );
      setEditingIndex(null);
    } else {
      setEditValues({ name: items[index].name, price: items[index].price });
      setEditingIndex(index);
    }
  };

  const handleInputChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!uploaded ? (
        <div className="space-y-4">
          <Input type="file" onChange={handleFileChange} />
          <div className="flex space-x-2">
            <Button onClick={handleUpload} disabled={!file}>Upload PDF</Button>
            <Button onClick={handleEmptyBill} variant="outline">Empty Bill</Button>
          </div>
          <div><Button onClick={handleAddPerson}>Add Person</Button></div>
          <div className="mt-2">
            {people.map((person, index) => (
              <span key={index} className="mr-2 p-1 bg-gray-200 rounded">{person.name}</span>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Button onClick={handleAddItem}>Add Item</Button>
          {items.map((item, index) => (
            <Card key={index} className="p-2 mb-2 relative flex flex-col">
              <CardContent className="flex justify-between items-center">
                {editingIndex === index ? (
                  <>
                    <input
                      className="border p-1 mr-2"
                      value={editValues.name}
                      onChange={(e) => handleInputChange(e, "name")}
                    />
                    <input
                      className="border p-1 w-16"
                      value={editValues.price}
                      onChange={(e) => handleInputChange(e, "price")}
                      type="number"
                    />
                  </>
                ) : (
                  <span>{item.name} - ${item.price.toFixed(2)}</span>
                )}
                <div className="space-x-2 flex">
                  {people.map((person) => (
                    <Button
                      key={person.name}
                      variant={person.paidFor[index] ? "default" : "outline"}
                      onClick={() => togglePayment(index, person.name)}
                    >
                      {person.name}
                    </Button>
                  ))}
                  <button onClick={() => handleEditItem(index)} className="text-gray-600 hover:text-black">
                    {editingIndex === index ? <Check size={20} /> : <Edit size={20} />}
                  </button>
                  <button onClick={() => handleDeleteItem(index)} className="text-gray-600 hover:text-black">
                    <Trash2 size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4 p-4 border rounded flex justify-between items-center">
            <div>
              <p><strong>Tax:</strong></p>
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
            <p><strong>Final Total:</strong> ${calculatedTotal.toFixed(2)}</p>
          </div>
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Split Amounts:</h3>
            {calculateSplit().map((person) => (
              <p key={person.name}>{person.name}: ${person.amount.toFixed(2)}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
