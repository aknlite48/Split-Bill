import React, { useState } from "react";
import axios from "axios";

function App() {
    const [pdf, setPdf] = useState(null);
    const [items, setItems] = useState([]);
    const [people, setPeople] = useState([]);
    const [assignments, setAssignments] = useState({});

    // Handle file upload
    const handleFileChange = (event) => {
        setPdf(event.target.files[0]);
    };

    // Upload and process PDF
    const handleUpload = async () => {
        if (!pdf) {
            alert("Please upload a PDF file");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", pdf);

        try {
            const response = await axios.post("http://localhost:5001/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Assume response is a structured JSON list of items
            setItems(response.data.items);
            setAssignments(response.data.items.reduce((acc, item) => {
                acc[item.name] = [];
                return acc;
            }, {}));

        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("Failed to process the PDF");
        }
    };

    // Add a new person
    const addPerson = () => {
        const name = prompt("Enter the person's name:");
        if (name) setPeople([...people, name]);
    };

    // Assign item to a person
    const assignItem = (itemName, person) => {
        setAssignments((prev) => {
            const newAssignments = { ...prev };
            if (newAssignments[itemName].includes(person)) {
                newAssignments[itemName] = newAssignments[itemName].filter(p => p !== person);
            } else {
                newAssignments[itemName].push(person);
            }
            return newAssignments;
        });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h2>Walmart Bill Splitter</h2>

            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload & Process</button>

            <h3>People Splitting the Bill</h3>
            <button onClick={addPerson}>Add Person</button>
            <ul>
                {people.map((person, index) => (
                    <li key={index}>{person}</li>
                ))}
            </ul>

            <h3>Bill Items</h3>
            {items.length > 0 ? (
                <table border="1" style={{ width: "100%", marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Cost</th>
                            <th>Assign</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.cost.toFixed(2)}</td>
                                <td>
                                    {people.map((person) => (
                                        <button 
                                            key={person}
                                            onClick={() => assignItem(item.name, person)}
                                            style={{
                                                margin: "2px",
                                                backgroundColor: assignments[item.name]?.includes(person) ? "green" : "gray",
                                                color: "white"
                                            }}
                                        >
                                            {person}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No items yet. Upload a PDF to extract the bill details.</p>
            )}
        </div>
    );
}

export default App;
