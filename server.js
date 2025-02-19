const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle PDF uploads
app.post("/upload", upload.single("pdf"), async (req, res) => {
    console.log("📥 Received request to /upload");

    if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;

        // Step 1️⃣: Extract text from PDF using pdf-parse
        console.log("🔍 Extracting text from PDF...");
        const fileBuffer = fs.readFileSync(filePath);
        const parsedData = await pdfParse(fileBuffer);
        const extractedText = parsedData.text;
        console.log("✅ Extracted text:", extractedText.substring(0, 500), "..."); // Show first 500 chars for debugging

        // Step 2️⃣: Send extracted text to OpenAI API for structured parsing
        console.log("🚀 Sending extracted text to OpenAI...");
        const openaiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4-turbo",  // Change to "gpt-3.5-turbo" if needed
                messages: [
                    { role: "system", content: "Extract a structured list of items, their costs, tax, and total from this structured data parsed from a Walmart bill pdf. if items are discounted, make to sure include only the prices of items post discount" },
                    { role: "user", content: extractedText }
                ],
                temperature: 0
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Received structured response from OpenAI:", openaiResponse.data);

        // Step 3️⃣: Delete file after processing
        fs.unlinkSync(filePath);

        // Step 4️⃣: Send extracted structured data to frontend
        res.json({
            success: true,
            extractedData: openaiResponse.data.choices[0].message.content
        });

    } catch (error) {
        console.error("❌ OpenAI API Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: "OpenAI API failed",
            details: error.response?.data || error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
