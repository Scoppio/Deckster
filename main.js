const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

require("@electron/remote/main").initialize();

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win.loadURL("http://localhost:3010");
};

const setMainMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Entry',
          click: () => {
            console.log('New Entry clicked');
            // Perform your action here. For example, show an alert in the main window.
            const mainWindow = BrowserWindow.getFocusedWindow();
            mainWindow && mainWindow.webContents.executeJavaScript('alert("New Entry Action")');
          }
        },
        // Add other File menu items here
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    // Add other top-level menu items here
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.setAccessibilitySupportEnabled(true);

app.whenReady().then(() => {
  createWindow();
  setMainMenu(); // Set the custom main menu

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
