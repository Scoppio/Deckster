const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const path = require('path');
const url = require('url');
const isDev = app.isPackaged ? false : require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1280, height: 870});
  mainWindow.loadURL(isDev ? 'http://localhost:3010' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}


// const menu = new Menu()
// menu.append(new MenuItem({
//   label: 'Deckster',
//   submenu: [{
//     role: 'help',
//     accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
//     click: () => { console.log('Electron rocks!') }
//   },
//   {
//     role: 'Quit',
//     accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
//     click: () => { app.quit() }
//   }]
// }))

// Menu.setApplicationMenu(menu)

app.on('ready', createWindow);

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
