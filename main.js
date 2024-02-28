const path = require("path");
const { app, BrowserWindow } = require("electron");

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

app.setAccessibilitySupportEnabled(true);

app.whenReady().then(() => {
  createWindow();

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
