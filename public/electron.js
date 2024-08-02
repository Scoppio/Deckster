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
        label: 'Change Deck',
        accelerator: 'CmdOrCtrl+Shift+C',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('change-deck');
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
    label: 'Responses',
    submenu: [
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
      }
    ]
  },
  {
    label: 'Game Phases',
    submenu: [
      {
        label: 'Next Step',
        accelerator: 'CmdOrCtrl+e',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('next-step');
        }
      },
      {
        label: 'Previous Step',
        accelerator: 'CmdOrCtrl+Shift+e',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('previous-step');
        }
      },
      {
        label: 'Go To First Main Phase',
        // accelerator: 'CmdOrCtrl+1',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('main-phase');
        }
      },
      {
        label: 'Go To Combat Step',
        // accelerator: 'CmdOrCtrl+1',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('combat-phase');
        }
      },
      {
        label: 'Go To Second Main Phase',
        // accelerator: 'CmdOrCtrl+1',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('second-main-phase');
        }
      },
      {
        label: 'Go To End Step',
        accelerator: 'CmdOrCtrl+n',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('end-phase');
        }
      },
      {
        type: 'separator',
      },
      {
        label: 'Pass turn',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('pass-turn');
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
        label: 'Dices',
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
          {
            label: 'Roll 1d100',
            // accelerator: 'CmdOrCtrl+Shift+8',
            click: () => {
              const win = BrowserWindow.getFocusedWindow();
              win.webContents.send('roll-dice-100');
            }
          },
        ]
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
        type: 'separator',
      },
      {
        label: 'Untap all',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('untap-all');
        }
      },
      {
        label: 'Draw Card',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('draw-card');
        }
      },
      {
        type: 'separator',
      },
      {
        label: 'Draw hand',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('draw-hand');
        }
      },
      {
        label: 'Mulligan',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('mulligan');
        }
      },
      {
        label: 'Pass turn',
        // accelerator: 'CmdOrCtrl+W',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.send('pass-turn');
        }
      },
    ]
  },
  {
    label: 'Life and Counters',
    submenu: [
      {
        label: 'Counters',
        submenu: [
          {
            label: 'Poison Counters',
            submenu: [
              {
                label: 'Gain 1 Poison Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-1-poison-counter');
                }
              },
              {
                label: 'Gain 3 Poison Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-3-poison-counter');
                }
              },
              {
                label: 'Gain 5 Poison Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-5-poison-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove 1 Poison Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-1-poison-counter');
                }
              },
              {
                label: 'Remove 3 Poison Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-3-poison-counter');
                }
              },
              {
                label: 'Remove 5 Poison Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-5-poison-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove All Poison Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-all-poison-counter');
                }
              }
            ]
          },
          {
            label: 'Energy Counters',
            submenu: [
              {
                label: 'Gain 1 Energy Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-1-energy-counter');
                }
              },
              {
                label: 'Gain 3 Energy Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-3-energy-counter');
                }
              },
              {
                label: 'Gain 5 Energy Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('gain-5-energy-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove 1 Energy Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-1-energy-counter');
                }
              },
              {
                label: 'Remove 3 Energy Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-3-energy-counter');
                }
              },
              {
                label: 'Remove 5 Energy Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-5-energy-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove All Energy Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-all-energy-counter');
                }
              }
            ]
          },
          {
            label: 'Misc Counters',
            submenu: [
              {
                label: 'Add 1 Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('add-1-counter');
                }
              },
              {
                label: 'Add 5 Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('add-5-counter');
                }
              },
              {
                label: 'Add 10 Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('add-10-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove 1 Counter',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-1-counter');
                }
              },
              {
                label: 'Remove 5 Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-5-counter');
                }
              },
              {
                label: 'Remove 10 Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-10-counter');
                }
              },
              {
                type: 'separator',
              },
              {
                label: 'Remove All Counters',
                click: () => {
                  const win = BrowserWindow.getFocusedWindow();
                  win.webContents.send('remove-all-counter');
                }
              }
            ]
          }
        ]
      },
      {
        label: 'Life',
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
            type: 'separator',
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