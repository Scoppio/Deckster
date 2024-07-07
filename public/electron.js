const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require('path');
const isDev = app.isPackaged ? false : require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 870,
    icon: 'favicon.png',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.resolve(__dirname, './preload.js'),
    },
  });
  // mainWindow = new BrowserWindow({width: 1280, height: 870});
  mainWindow.loadURL(isDev ? 'http://localhost:3010' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

const template = [
  {
    label: 'Deckster',
    submenu: [{
      role: 'help',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
      click: () => { console.log('Electron rocks!'); }
    },
    {
      role: 'Quit',
      accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
      click: () => { app.quit(); }
    }],
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Cards',
    submenu: [
      {
        label: 'Search Cards',
        accelerator: 'CmdOrCtrl+T',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('search-cards');
        }
      },
    ]
  }
];

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);

app.on('ready', () => {
  createWindow();
  
  app.setAccessibilitySupportEnabled(true);
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


app.on("browser-window-created", (_, window) => {
  require("@electron/remote/main").enable(window.webContents);
  if (isDev) {
    window.webContents.openDevTools();
  }
});