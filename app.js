const { app, BrowserWindow,Menu ,shell ,dialog ,clipboard   } = require('electron');
const { exec } = require('child_process'); // Use exec for command execution
const path = require('path');
const express = require('express');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto'); // For generating random filenames
const multer = require('multer');





let mainWindow;
const serverPort = 3001; // Choose an available port 

// Create the Express app
const expressApp = express();

// Define the path to your Angular production build (after running ng build --prod)
const angularDistPath = path.join(__dirname, 'dist', 'my-folders','browser');

// Serve static files from the Angular dist folder
expressApp.use(express.static(angularDistPath));



const isPackaged = app.isPackaged;
const videoDirectory = isPackaged 
    ? path.join(process.resourcesPath, 'indexedDb/static')  // In packaged app
    : path.join(__dirname, 'indexedDb/static'); // In development

if (!fs.existsSync(videoDirectory)) {
    fs.mkdirSync(videoDirectory, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, videoDirectory);
  },
  filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname); // Get the original file extension
      const randomName = crypto.randomBytes(12).toString('hex'); // Generate a random string
      cb(null, randomName + fileExt); // Save file with random name + original extension
  }
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
      cb(null, true);
  } else {
      cb(new Error('Not a video file!'), false);
  }
};

const upload = multer({ storage, fileFilter });

expressApp.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded or invalid file type' });
  }

  const fileUrl = `http://localhost:3000/videos/${req.file.filename}`;
  
  res.status(200).send({ 
      message: 'File uploaded successfully', 
      url: fileUrl 
  });
});


//it also work
//expressApp.use('/indexeddb/static', express.static(videoDirectory));

// Ensure this route is before `expressApp.get('*', ...)`
expressApp.get('/videos/:filename', (req, res) => {
  const filePath = path.join(videoDirectory, req.params.filename);
  console.log("Attempting to serve:", filePath);

  if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
  } else {
      res.status(404).send("File not found");
  }
});






// For any routes, send back the index.html file
expressApp.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

// Start the Express server
const server = expressApp.listen(serverPort, () => {
  console.log(`Express server listening on port ${serverPort}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${serverPort} is already in use. Please close the existing process.`);
    
    // Show an error dialog in Electron
    dialog.showErrorBox(
      "Port Conflict",
      `Port ${serverPort} is already in use. Please close the existing process and restart the app.`
    );

    // Quit Electron app after showing the error
    app.quit();
  } else {
    console.error('❌ Server error:', err);
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create the Electron BrowserWindow after the server is up
function createWindow() {

    const { screen } = require('electron');
    const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen size
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      // Configure as needed; note that with nodeIntegration off,
      // you're relying on the Angular build for module management.
      nodeIntegration: false,
      contextIsolation: true,
         
        

    },
    autoHideMenuBar: true, 
    icon: path.join(__dirname, 'dist/my-folders/browser/favicon.ico'),
  });

  // Load the Angular app via the local server
  mainWindow.loadURL(`http://localhost:${serverPort}`);

  mainWindow.maximize();

  // Optionally open the dev tools for debugging
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });



    // Right-Click Context Menu
    mainWindow.webContents.on('context-menu', (event, params) => {
      const menu = Menu.buildFromTemplate([
        {
          label: 'Reload',
          role: 'reload'
        },
        
        {
          label: 'Inspect Element',
          click: () => {
            mainWindow.webContents.inspectElement(params.x, params.y);
          }
        },
      {
        label: 'Open Image',
        visible:  isValidImage(params.srcURL),
        click: () => {
          openImageWindow(params.srcURL);
        }
    },
    {
      label: 'Save Image As...',
      visible: isValidImage(params.srcURL),
      click: () => saveImage(params.srcURL)
  },

  {
    label: 'Copy Link Address',
    visible: params.linkURL && params.linkURL !== '',
    click: () => clipboard.writeText(params.linkURL),
  },

  {
    label: 'Copy Image Address',
    visible: isValidImage(params.srcURL),
    click: () => clipboard.writeText(params.srcURL),
  },

  {
    label: 'Copy Video Address',
    visible: params.mediaType === 'video',
    click: () => clipboard.writeText(params.srcURL),
  },


  
      ]);
  
      menu.popup();
    });



}

app.on('ready', createWindow);
// Clean up the Express server when Electron quits
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    server.close(); // Stop the Express server
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// app.commandLine.appendSwitch('disable-renderer-accessibility');

function openImageWindow(imageUrl) {

  
  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen size
  let imageWindow = new BrowserWindow({
      width,
      height,
      title: "Image Preview",
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      
      },
      autoHideMenuBar: true, 
      icon: path.join(__dirname, 'dist/my-folders/browser/favicon.ico'),
  });

  // Load a simple HTML page with the image
  imageWindow.loadURL(`data:text/html,
      <html>
          <head><title>Image Viewer</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${imageUrl}" style="max-width:100%; max-height:100%;"/>
          </body>
      </html>`);

      imageWindow.maximize()
}

function isValidImage(url) {
  if (!url) return false;

  // Check for common image file extensions
  if (url.match(/\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i)) return true;

  // Check if it's a valid base64 image
  return /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/.test(url);
}


function handleImageOpening(imageUrl) {
  if (imageUrl.startsWith("data:image")) {
      // If it's a base64 data URL, save it as a temp file
      const filePath = saveBase64Image(imageUrl);
      openInChrome(`file://${filePath}`, filePath);
  } else {
      // Otherwise, open the normal image URL
    console.log('test' + imageUrl)
  }
}

function saveBase64Image(dataUrl) {
  const base64Data = dataUrl.split(",")[1]; // Extract base64 content
  const buffer = Buffer.from(base64Data, "base64");
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `image-${Date.now()}.png`);

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function openInChrome(imagePath, tempFilePath = null) {
  const chromePath = getChromePath();

  if (!chromePath) {
      shell.openExternal(imagePath); // Open in default browser as fallback
      return;
  }

  const formattedPath = `"${imagePath}"`;

  let command;
  if (process.platform === "win32") {
      command = `"${chromePath}" ${formattedPath}`;
  } else {
      command = `open -a "${chromePath}" ${formattedPath}`;
  }

  exec(command, (error) => {
      if (error) {
          console.error("Failed to open image in Chrome:", error);
      } else if (tempFilePath) {
          // Wait for a few seconds before deleting to ensure Chrome loads it
          setTimeout(() => {
              deleteFile(tempFilePath);
          }, 5000);
      }
  });
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
      if (err) {
          console.error(`Error deleting file: ${filePath}`, err);
      } else {
          console.log(`Deleted temp image: ${filePath}`);
      }
  });
}

function getChromePath() {
  const chromePaths = {
      win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      darwin: "Google Chrome",
      linux: "/usr/bin/google-chrome"
  };

  return chromePaths[process.platform] || null;
}


//save image as

function isValidImage(url) {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i) !== null || url.startsWith("data:image");
}

async function saveImage(imageUrl) {
  let extension = getImageExtension(imageUrl) || "png"; // Default to PNG if unknown
  let randomName = generateRandomFilename(extension);

  // Show "Save As" dialog with a random filename
  const { filePath: savePath } = await dialog.showSaveDialog({
      title: "Save Image As",
      defaultPath: path.join(os.homedir(), randomName),
      filters: [{ name: "Images", extensions: [extension] }]
  });

  if (!savePath) return; // User canceled

  if (imageUrl.startsWith("data:image")) {
      saveBase64Image(imageUrl, savePath);
  } else {
      downloadImage(imageUrl, savePath);
  }
}

function getImageExtension(url) {
  if (url.startsWith("data:image/")) {
      return url.split(";")[0].split("/")[1]; // Extract from base64 data
  }
  return path.extname(url).substring(1); // Extract from URL
}

function generateRandomFilename(extension) {
  const randomString = crypto.randomBytes(6).toString('hex'); // Generates a random 12-character string
  return `image-${randomString}.${extension}`;
}

function saveBase64Image(dataUrl, filePath) {
  const base64Data = dataUrl.split(",")[1]; // Remove "data:image/png;base64,"
  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  shell.showItemInFolder(filePath);
}

function downloadImage(url, filePath) {
  const file = fs.createWriteStream(filePath);
  https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
          file.close();
          shell.showItemInFolder(filePath); // Open folder where file was saved
      });
  }).on("error", (err) => {
      console.error("Image download failed:", err);
  });
}



/**=======================================================================================================================
 * ==========================================================================================================================**/

