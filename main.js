const { app, BrowserWindow } = require('electron');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

let mainWindow;

function createWindow() {
    // Create the main application window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false, 
        }
    });

    // Load the React app
    const startURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:${process.env.PORT || 3000}`
        : `file://${path.join(__dirname, 'build', 'index.html')}`;

    mainWindow.loadURL(startURL);

    // Open DevTools
    mainWindow.webContents.openDevTools();

    // Cleanup when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Electron lifecycle events
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // Close the app when all windows are closed, except on macOS
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // Reopen a window if the app is activated and no windows are open (macOS)
    if (mainWindow === null) {
        createWindow();
    }
});
