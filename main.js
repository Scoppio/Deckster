const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');

require("@electron/remote/main").initialize();
const File = require('./preload');

const isDev = true; // process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const loadTokenFromCredentialsFile = async () => {
  const userProfile = process.env.USERPROFILE;
  const possiblePaths = [
    path.join(userProfile, "OneDrive\\Documents\\deckster_creds.json"), 
    path.join(userProfile, "OneDrive\\Documentos\\deckster_creds.json"),
    path.join(userProfile, "Documents\\deckster_creds.json"),
    path.join(userProfile, "Documentos\\deckster_creds.json")
  ];

  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      // If fs.access succeeds, the file exists, and we can attempt to read it
      const data = await fs.readFile(p, 'utf8');
      console.log("Token loaded from credentials file");
      return JSON.parse(data).token; // Assuming the JSON structure contains a "token" field
    } catch (error) {
      // If an error occurs (file doesn't exist or can't be read), continue to the next path
      continue;
    }
  }

  // If none of the paths are valid, throw an error or handle it as needed
  throw new Error("Credentials file not found in any of the possible paths.");
};

ipcMain.on('load-token', async (event) => {
  try {
    const token = await loadTokenFromCredentialsFile();
    event.reply('load-token', token);
  } catch (error) {
    console.error("Failed to load token:", error);
    event.reply('load-token', null); // Or handle the error as needed
  }
});



const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.resolve('.src/preload.js'),
    },
  });
  win.loadURL("http://localhost:3010");
};


app.setAccessibilitySupportEnabled(true);

app.whenReady().then(() => {
  createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("browser-window-created", (_, window) => {
  require("@electron/remote/main").enable(window.webContents);
  if (isDev) {
    window.webContents.openDevTools();
  }
});
