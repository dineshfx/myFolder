const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create a new window
  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen size

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    backgroundColor: '#00000000',  // Transparent background

    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'), // Point to the preload.js file

      nodeIntegration: false, // Allows you to use Node.js in your app
      contextIsolation: false



    },
    autoHideMenuBar: true, 
    icon: path.join(__dirname, 'dist/my-folders/browser/favicon.ico'), // Set the app icon

  });



  

  // Load your Angular app's index.html from the build folder

  //mainWindow.loadFile('dist/my-folders/browser/index.html');

  // mainWindow.loadFile(path.join(__dirname, 'dist', 'my-folders','browser', 'index.html'));  // Use correct path to the built file

  
const indexPath = path.join(__dirname, 'dist', 'my-folders','browser', 'index.html');
  
// Load the Angular app's index.html
mainWindow.loadFile(indexPath);


 // Wait for the page to finish loading and then inject jQuery, Summernote, and Bootstrap JS



  mainWindow.maximize();

  // // Open DevTools (optional)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });


  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key === 'r') {
      event.preventDefault(); // Prevent the default hard reload
      //mainWindow.loadFile(indexPath); // Load index.html explicitly
    }
  });
}




// Intercept the reload event and manually reload the index.html





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

app.disableHardwareAcceleration();

