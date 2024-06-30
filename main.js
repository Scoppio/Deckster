// const path = require("path");
// const { app, BrowserWindow, Menu } = require("electron");

// require("@electron/remote/main").initialize();


// const isDev = true; // process.env.NODE_ENV !== "production";
// const isMac = process.platform === "darwin";

// const createMenu = () => {
//   const template = [
//       {
//           label: 'File',
//           submenu: [
//               {
//                   label: 'New File',
//                   click: () => {
//                       console.log('New File clicked');
//                   }
//               },
//               {
//                   label: 'Open File',
//                   click: () => {
//                       console.log('Open File clicked');
//                   }
//               },
//               {
//                   type: 'separator'
//               },
//               {
//                   label: 'Exit',
//                   role: 'quit'
//               }
//           ]
//       },
//       {
//           label: 'Edit',
//           submenu: [
//               {
//                   label: 'Undo',
//                   role: 'undo'
//               },
//               {
//                   label: 'Redo',
//                   role: 'redo'
//               },
//               {
//                   type: 'separator'
//               },
//               {
//                   label: 'Cut',
//                   role: 'cut'
//               },
//               {
//                   label: 'Copy',
//                   role: 'copy'
//               },
//               {
//                   label: 'Paste',
//                   role: 'paste'
//               }
//           ]
//       },
//       {
//           label: 'View',
//           submenu: [
//               {
//                   label: 'Reload',
//                   role: 'reload'
//               },
//               {
//                   label: 'Toggle Full Screen',
//                   role: 'togglefullscreen'
//               }
//           ]
//       },
//       {
//           label: 'Help',
//           submenu: [
//               {
//                   label: 'About',
//                   click: () => {
//                       console.log('About clicked');
//                   }
//               }
//           ]
//       }
//   ];

//   // Build the menu from the template
//   const menu = Menu.buildFromTemplate(template);
  
//   // Set the application menu
//   Menu.setApplicationMenu(menu);
// };


//   // Remove default menus
//   const menu = Menu.buildFromTemplate(template);
//   Menu.setApplicationMenu(menu);
// };

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: isDev ? 1200 : 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: false,
//       nodeIntegration: true,
//       enableRemoteModule: true,
//       preload: path.resolve('.src/preload.js'),
//     },
//   });
//   win.loadURL("http://localhost:3010");
// };


// app.setAccessibilitySupportEnabled(true);

// app.whenReady().then(() => {
//   createWindow();
//   createMenu();
//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on("window-all-closed", () => {
//   if (!isMac) {
//     app.quit();
//   }
// });

// app.on("browser-window-created", (_, window) => {
//   require("@electron/remote/main").enable(window.webContents);
//   if (isDev) {
//     window.webContents.openDevTools();
//   }
  
// });

