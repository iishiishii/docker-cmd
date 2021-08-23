"use strict";

// Require electron and node.js modules. Use ES6 style const declaration to store the
// Module names as these will not change.
// const electron = require('electron');
const path=require('path');
// require('./src/server/server-prod.js')
// const app=electron.app;  // Module to control application life.
// const  = electron.BrowserWindow;  // Module to create native browser window.
const { BrowserWindow, app, shell, globalShortcut }	= require('electron'); // include the ipc module to communicate with render process ie to receive the message from render process
const url = require('url');

// Store a reference to the mainWindow. Once this is created the application will not terminate
// until this is set (back) to null to free the pointer to the window (once it is closed)
let mainWindow=null;

// Function to create the application window
var createWindow=function() {

    let opts= {width: 800, height: 500};
    let fullURL='file://' + path.join(__dirname , './index.html');
    
    // This is the key here -- this script is run before the html file is loaded
    // and can include node-style requires even if the rest of the window
    // has no node integration (turned off below nodeIntegration:false).
    // let preload=  path.resolve(__dirname, 'electronpreload.js');
    
    // Create main window
    mainWindow=new BrowserWindow({width: opts.width,
     				  height: opts.height,
     				  show: true,
     				  webPreferences: {
                        plugins: true,
                        nodeIntegration: true,
                        enableRemoteModule: true,
                        contextIsolation: false
     				  },
     				 });
                 
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(fullURL);
    console.log('localhost loaded');

    // mainWindow.webContents.openDevTools();
    // Register callbacks
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.setMenuBarVisibility(false);


    mainWindow.on("close", () => {
        mainWindow.webContents.send("stop-server");
      });
    mainWindow.on('closed', () => { mainWindow = null;});
    
    // Load the URL to start
    // mainWindow.loadURL(fullURL);
};

// This is boilerplate from electron examples. 
// Application level Callbacks
     // Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    globalShortcut.register("Alt+CommandOrControl+L", () => {
      mainWindow.webContents.send("show-server-log");
    })
  }).then(createWindow);

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
});

 
//ipcMain.on will receive the “btnclick” info from renderprocess 
// ipcMain.on("btnclick",function (event, arg) {
//         //create new window
//         var newWindow        = new BrowserWindow({ width: 450, height: 300, show: 
//                                               false,webPreferences: {webSecurity: false,plugins:
//                                               true,nodeIntegration: false} });  // create a new window
 
//         // var dockerURL     =  "http://localhost:8080/express_backend"; // loading an external url. We can
//         //                                                     //load our own another html file , like how we load index.html earlier
 
//         const request = net.request(
//             'https://alphamev.ai/'
//         );
//         request.on('response', (response) => {
//             console.log(`STATUS: ${response.statusCode}`);
//             response.on('error', (error) => {
//               console.log(`ERROR: ${JSON.stringify(error)}`)
//             })
//           });
//         newWindow.loadURL('https://alphamev.ai/');
//         newWindow.show();

 
// });