import React, { useState } from "react";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardContent } from "./components/ui/Card";

export default function App() {
  const [file, setFile] = useState(null);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState(null);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddPerson = () => {
    const name = prompt("Enter person's name:");
    if (name) {
      setPeople([...people, { name, paidFor: {} }]);
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

  const calculatedTotal = items ? items.reduce((sum, item) => sum + item.price, 0) + tax : 0;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!uploaded ? (
        <div className="space-y-4">
          <Input type="file" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file}>
            Upload PDF
          </Button>
          <div>
            <Button onClick={handleAddPerson}>Add Person</Button>
          </div>
          <div className="mt-2">
            {people.map((person, index) => (
              <span key={index} className="mr-2 p-1 bg-gray-200 rounded">
                {person.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {items &&
            items.map((item, index) => (
              <Card key={index} className="p-2 mb-2">
                <CardContent className="flex justify-between items-center">
                  <span>{item.name} - ${item.price}</span>
                  <div className="space-x-2">
                    {people.map((person) => (
                      <Button
                        key={person.name}
                        variant={person.paidFor[index] ? "default" : "outline"}
                        onClick={() => {togglePayment(index, person.name);}}
                      >
                        {person.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          <div className="mt-4 p-4 border rounded">
            <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
            <p><strong>Calc Total:</strong> ${calculatedTotal.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
