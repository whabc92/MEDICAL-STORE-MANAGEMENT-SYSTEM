const { app, BrowserWindow } = require('electron');
const path = require('path');
const expressApp = require('./app/express');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false // Don't show immediately until page is loaded
  });

  // Load the Express app
  const serverUrl = 'http://localhost:3000';
  mainWindow.loadURL(serverUrl)
    .then(() => {
      console.log(`Successfully loaded ${serverUrl}`);
      mainWindow.show(); // Show window only after content is loaded
    })
    .catch(err => {
      console.error('Failed to load URL:', err);
      // Provide feedback to user
      mainWindow.loadFile(path.join(__dirname, 'app/views/error.html'));
      mainWindow.show();
    });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load page:', { errorCode, errorDescription });
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Check if server is running
  const checkServer = setInterval(() => {
    fetch('http://localhost:3000')
      .then(() => console.log('Server is running'))
      .catch(err => console.error('Server not responding:', err));
  }, 1000);
  
  // Stop checking after 10 seconds
  setTimeout(() => clearInterval(checkServer), 10000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// Handle any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});