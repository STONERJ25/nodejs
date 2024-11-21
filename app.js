const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const PORT = 8675;


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  });

  const wss = new WebSocket.Server({ server });

  // Handle WebSocket connections from clients
  wss.on('connection', (ws, req) => {
    console.log("New WebSocket connection.");
  
    // Listen for video frames (Base64-encoded JPEGs) from the client
    ws.on('message', (message) => {
      console.log("Received a frame.");
  
      // Decode the Base64-encoded image
      const buffer = Buffer.from(message, 'base64');
      const filePath = path.join(__dirname, 'public', 'burner.jpg'); // Always save as burner.jpg
  
      // Save the frame as burner.jpg, overwriting the previous image
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Error saving image:', err);
        } else {
          // Dynamically generate the URL to the saved image
          const imageUrl = `http://${req.headers.host}/images/burner.jpg`;
          ws.send(imageUrl); // Send the image URL back to the client
        }
      });
    });
  
    ws.on('close', () => {
      console.log("WebSocket connection closed.");
    });
  });
  
  // Ensure the 'images' directory exists
  const imagesDir = path.join(__dirname, 'public');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  // Start the server
  server.listen(PORT, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
  });
  
