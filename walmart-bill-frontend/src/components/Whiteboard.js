import React, { useRef, useState, useEffect } from 'react';
import { X, Save, Trash, RefreshCw, Edit, Eraser } from 'lucide-react';
import { Button } from './ui/Button';

export const Whiteboard = ({ isOpen, onClose, onSaveDrawing }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
  const eraserSize = 20; // Size of the eraser
  const penSize = 3; // Size of the pen

  // Initialize canvas when component mounts or when dialog opens
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = penSize;
      ctx.strokeStyle = '#000';
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configure context based on mode
    if (mode === 'draw') {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = penSize;
      ctx.strokeStyle = '#000';
      ctx.globalCompositeOperation = 'source-over';
    } else if (mode === 'erase') {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = eraserSize;
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    setIsDrawing(true);
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const startDrawingTouch = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configure context based on mode
    if (mode === 'draw') {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = penSize;
      ctx.strokeStyle = '#000';
      ctx.globalCompositeOperation = 'source-over';
    } else if (mode === 'erase') {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = eraserSize;
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    setIsDrawing(true);
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const drawTouch = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const processDrawing = async () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Create a temporary canvas with white background
      const origCanvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = origCanvas.width;
      tempCanvas.height = origCanvas.height;
      
      // Fill with white background first
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw the original canvas content on top
      tempCtx.drawImage(origCanvas, 0, 0);
      
      // Get preview URL
      const previewUrl = tempCanvas.toDataURL('image/png');
      
      // Convert to blob for file creation
      tempCanvas.toBlob(async (blob) => {
        const drawingFile = new File([blob], 'receipt-drawing.png', { type: 'image/png' });
        
        // Just save the drawing and preview URL to parent component
        await onSaveDrawing(drawingFile, previewUrl);
        
        // Debug save if needed
        //saveDrawingForDebug();
      }, 'image/png');
    } catch (error) {
      console.error('Canvas conversion error', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveDrawingForDebug = () => {
    try {
      // Create a temporary canvas with white background
      const origCanvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = origCanvas.width;
      tempCanvas.height = origCanvas.height;
      
      // Fill with white background first
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw the original canvas content on top
      tempCtx.drawImage(origCanvas, 0, 0);
      
      // Convert temp canvas to data URL (PNG format)
      const dataUrl = tempCanvas.toDataURL('image/png');
      
      // Log the data URL to console for debugging
      console.log('Debug - Drawing data URL:', dataUrl);
      
      // Store in localStorage with timestamp for history
      const timestamp = new Date().toISOString();
      localStorage.setItem(`debug-drawing-${timestamp}`, dataUrl);
      console.log(`Debug - Drawing saved to localStorage with key: debug-drawing-${timestamp}`);
    
      // Download image file
      const link = document.createElement('a');
      link.download = `debug-drawing-${timestamp}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Debug - Error saving drawing:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-3 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Draw Your Receipt</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Drawing toolbar */}
        <div className="bg-gray-50 px-6 py-2 border-b flex justify-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('draw')}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                mode === 'draw' 
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300 shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Draw"
            >
              <Edit className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => setMode('erase')}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                mode === 'erase' 
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300 shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Erase"
            >
              <Eraser className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Canvas area */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-white shadow-md rounded-lg touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawingTouch}
            onTouchMove={drawTouch}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        {/* Footer with controls */}
        <div className="px-6 py-3 border-t flex justify-between items-center bg-gray-50">
          <Button 
            onClick={clearCanvas}
            variant="outline"
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button 
            onClick={processDrawing}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Process Drawing
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};