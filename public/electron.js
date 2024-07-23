const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require('path');
const isDev = app.isPackaged ? false : require('electron-is-dev');
const { updateElectronApp } = require('update-electron-app');
updateElectronApp();

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
    submenu: [
      {
        label: 'Home',
        accelerator: 'CmdOrCtrl+Shift+N',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        role: 'help',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        role: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('quit-game');
        }
      }
    ],
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      },
      {
        label: 'Resync',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('force-sync');
        }
      },
    ]
  },
  {
    label: 'Actions',
    submenu: [
      {
        label: 'Upkeep Reminder',
        // accelerator: 'CmdOrCtrl+???',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('upkeep-reminder');
        }
      },
      {
        type: 'separator',
      },
      {
        label: 'Search Cards',
        accelerator: 'CmdOrCtrl+M',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('search-cards');
        }
      },
      {
        label: 'No response.',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('no-response');
        }
      },
      {
        label: 'Response!',
        accelerator: 'CmdOrCtrl+T',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('response');
        }
      },
      {
        label: 'I do not pay!',
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('i-do-not-pay');
        }
      },
    ]
  },
  {
    label: 'Roll Dice',
    submenu: [
      {
        label: 'Roll 1d2',
        // accelerator: 'CmdOrCtrl+1',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-2');
        }
      },
      {
        label: 'Roll 1d4',
        // accelerator: 'CmdOrCtrl+4',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-4');
        }
      },
      {
        label: 'Roll 1d6',
        // accelerator: 'CmdOrCtrl+6',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-6');
        }
      },
      {
        label: 'Roll 1d8',
        // accelerator: 'CmdOrCtrl+8',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-8');
        }
      },
      {
        label: 'Roll 1d10',
        // accelerator: 'CmdOrCtrl+0',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-10');
        }
      },
      {
        label: 'Roll 1d12',
        // accelerator: 'CmdOrCtrl+Shift+0',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-12');
        }
      },
      {
        label: 'Roll 1d20',
        // accelerator: 'CmdOrCtrl+Shift+8',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('roll-dice-20');
        }
      },
    ]
  },
  {
    label: 'Life Management',
    submenu: [
      {
        label: 'Gain 1 Health',
        // accelerator: 'CmdOrCtrl+1',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('gain-1-health');
        }
      },
      {
        label: 'Gain 5 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('gain-5-health');
        }
      },
      {
        label: 'Gain 10 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('gain-10-health');
        }
      },
      {
        label: 'Gain 20 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('gain-20-health');
        }
      },
      {
        label: 'Lose 1 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('lose-1-health');
        }
      },
      {
        label: 'Lose 5 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('lose-5-health');
        }
      },
      {
        label: 'Lose 10 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('lose-10-health');
        }
      },
      {
        label: 'Lose 20 Health',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('lose-20-health');
        }
      },
    ]
  },
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