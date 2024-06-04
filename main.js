const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('save-file', async (event, filePath, fileType, data) => {
    console.log('Saving file:', filePath, fileType, data);
    try {
        if (fileType === "application/json") {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } else if (fileType === "text/csv") {
            const csv = Papa.unparse(data);
            fs.writeFileSync(filePath, csv, 'utf-8');
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving file:', error);
        return { success: false, error: error.message };
    }
});