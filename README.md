# Split Bill App

A modern web application that helps you split bills and receipts with friends and roommates. Simply upload a photo of your receipt, draw it on the screen, or manually enter items, and the app will help you track who paid for what.


<img width="805" alt="image" src="https://github.com/user-attachments/assets/8745d9ff-3931-477d-b4c1-97fb9aaf2545" />

## Features

- **Receipt Scanning**: Upload images or PDFs of receipts to automatically extract items and prices
- **Draw Your Own**: Use the drawing board to sketch a receipt with touch or stylus support
- **Manual Entry**: Add items and prices manually for complete control
- **Smart Splitting**: Assign items to specific people and calculate fair splits
- **Tax Handling**: Include tax in your calculations, either split evenly or proportionally
- **History Tracking**: Access your recent bills for reference
- **Responsive Design**: Works on desktop, tablet and mobile devices

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Lucide icons
- **Backend**: Node.js, Express
- **Receipt Processing**: OpenAI API for OCR and data extraction

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/split-bill-app.git
   cd split-bill-app
   ```

2. Install dependencies (both frontend and backend):
   ```bash
   npm run setup
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PORT=3001
   ```

### Running the App

#### Development Mode

Run both the frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend React app on http://localhost:3000

#### Production Build

Create a production build:
```bash
npm run make
```

Run the production server:
```bash
npm run deploy
```

The app will be available on http://localhost:3001 (or the PORT specified in your environment).

## Project Structure

```
split-bill-app/
├── server.js                # Express backend server
├── routes/                  # API routes
├── controllers/             # Route controllers
├── services/                # Business logic
├── walmart-bill-frontend/   # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # React source files
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   └── App.js           # Main application component
```

## Usage

1. **Upload a Receipt**:
   - Use the drag-and-drop area or click "browse" to upload an image or PDF.
   - Alternatively, click "draw" to sketch your receipt using the drawing board.

2. **Add People**:
   - Add the names of everyone splitting the bill using the "Add Person" button.

3. **Assign Items**:
   - For each item, select who paid for it by clicking on their names.
   - Edit or delete items as needed using the buttons next to each item.

4. **Handle Tax**:
   - Enter the tax amount and decide if you want to split it evenly among all people.

5. **View the Split**:
   - Click "View Split" to see how much each person owes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the OCR and text recognition capabilities
- All contributors who have helped shape this project
