import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  request!:IDBOpenDBRequest;
   db!:IDBDatabase;
   allData:any;
   dbReady!: Promise<void>; // Promise to track when DB is ready


  
   constructor() {
    this.dbReady = this.init();
  }

  init(): Promise<void> {


    if (this.db) {
      this.db.close();
      console.log("Closed existing database connection before initializing.");
    }

    return new Promise((resolve, reject) => {
      this.request = indexedDB.open("myFoldersDb", 1);

      this.request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains("myFolders")) {
          const store = db.createObjectStore("myFolders", { keyPath: "id" , autoIncrement: true });
          store.createIndex('folderId', 'folderId', { unique: true }); // Keep folderId unique
        }
      };

      this.request.onsuccess = (event) => {
        this.db = (event.target as IDBRequest).result;
        console.log("Database initialized successfully");
        resolve(); // Resolve the promise when DB is ready
      };

      this.request.onerror = (event) => {
        console.error("Error initializing database", this.request.error);
        reject(this.request.error);
      };
    });
  }

  async getAllFolders(): Promise<any[]> {
    await this.dbReady; // Ensure DB is ready before accessing it

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database is not initialized yet.");
        return;
      }

      const readTransaction = this.db.transaction("myFolders", "readonly");
      const readStore = readTransaction.objectStore("myFolders");

      const getAllRequest = readStore.getAll();
      getAllRequest.onsuccess = () => {
        // console.log("All stored folders:", getAllRequest.result);
        resolve(getAllRequest.result);
      };
      getAllRequest.onerror = () => {
        reject("Error fetching stored folders");
      };
    });
  }

  async addFolder(data:any){
    await this.dbReady; 

    const readTransaction = this.db.transaction("myFolders", "readwrite");
    const store = readTransaction.objectStore("myFolders");


      // Get all folders to calculate the highest order value
  const getAllRequest = store.getAll();
  
  getAllRequest.onsuccess = () => {
    const folders = getAllRequest.result;

    // Find the highest order value (if any folders exist) // we can do it differently
    let highestOrder = 0;
    if (folders.length > 0) {
      highestOrder = Math.max(...folders.map((folder: any) => folder.order));
    }

    // Assign the next order (highestOrder + 1)
    data.order = highestOrder + 1;

    // Add the new folder to the store
    const request = store.add(data);
    
    request.onsuccess = () => {
      console.log("Folder added successfully with order:", data.order);
    };
    
    request.onerror = () => {
      console.error("Error adding folder.");
    };
  };
  
  getAllRequest.onerror = () => {
    console.error("Error fetching folders to calculate order.");
  };

  }


  async addFile(data:any){
    await this.dbReady; 

    const readTransaction = this.db.transaction("myFolders", "readwrite");
    const readStore = readTransaction.objectStore("myFolders");
    const request  = readStore.put(data);
    request.onsuccess = () =>{
      console.log("File added successfully!")
    }
  }

  async updateFile(data:any){
    await this.dbReady; 

    const readTransaction = this.db.transaction("myFolders", "readwrite");
    const readStore = readTransaction.objectStore("myFolders");
    const request  = readStore.put(data);
    request.onsuccess = () =>{
      console.log("File updated successfully!")
    }
  }



  
  async updateFolder(data:any){
    await this.dbReady; 

    console.log("called")

    const readTransaction = this.db.transaction("myFolders", "readwrite");
    const readStore = readTransaction.objectStore("myFolders");
    const request  = readStore.put(data);
    request.onsuccess = () =>{
      console.log("Folder updated successfully!")
    }
  }


  



  async deleteFolder(id: any) {

    await this.dbReady; 

    const tx = this.db.transaction('myFolders', 'readwrite');
    const store = tx.objectStore('myFolders');
  
    const deleteRequest = store.delete(id);
  
    deleteRequest.onsuccess = () => {
      console.log(`Folder with ID "${id}" deleted successfully.`);
    };
  
    deleteRequest.onerror = (event:any) => {
      console.error(`Error deleting folder with ID "${id}":`, event);
    };
  }


  async deleteFile(data:any) {

    await this.dbReady; 

    console.log("called")

    const readTransaction = this.db.transaction("myFolders", "readwrite");
    const readStore = readTransaction.objectStore("myFolders");
    const request  = readStore.put(data);
    request.onsuccess = () =>{
      console.log("File deleted successfully!")
    }
  }


  //if we pass folder id to delete

  // async deleteFolder(folderId: any) {

  //   // we can only delete by using primary key
  //   await this.dbReady; // Ensure DB is ready
  
  //   const tx = this.db.transaction('myFolders', 'readwrite');
  //   const store = tx.objectStore('myFolders');
  //   const index = store.index('folderId'); // Use the index
  
  //   // Step 1: Get the primary key (`id`) using `folderId`
  //   const getKeyRequest = index.getKey(folderId);
    
  //   getKeyRequest.onsuccess = async () => {
  //     const id = getKeyRequest.result; // This is the primary key
  //     if (id) {
  //       // Step 2: Delete using primary key (`id`)
  //       const deleteRequest = store.delete(id);
  
  //       deleteRequest.onsuccess = () => {
  //         console.log(`Folder with folderId "${folderId}" deleted successfully.`);
  //       };
  
  //       deleteRequest.onerror = (event: any) => {
  //         console.error(`Error deleting folder with folderId "${folderId}":`, event);
  //       };
  //     } else {
  //       console.warn(`Folder with folderId "${folderId}" not found.`);
  //     }
  //   };
  
  //   getKeyRequest.onerror = (event: any) => {
  //     console.error(`Error finding folderId "${folderId}":`, event);
  //   };
  // }


  //export function generated by chatgpt

  async exportObjectStore(dbName: string, storeName: string) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onsuccess = async (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();
  
        getAllRequest.onsuccess = () => {
          const jsonData = JSON.stringify(getAllRequest.result);
          const blob = new Blob([jsonData], { type: 'application/json' });
  
          // Generate timestamp in IST (12-hour format)
          const now = new Date();
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata" // IST timezone
          };
  
          const formatter = new Intl.DateTimeFormat("en-IN", options);
          const formattedDate = formatter.format(now)
            .replace(/\//g, '-') // Replace slashes with hyphens (DD-MM-YYYY)
            .replace(',', '')     // Remove comma
            .replace(/ /g, '_')   // Replace space with underscore
            .replace(/:/g, '-');  // Replace colons with hyphens in time
  
          // Create a download link
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${storeName}_backup_${formattedDate}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
  
          resolve(true);
        };
  
        getAllRequest.onerror = (event: any) => reject(event);
      };
  
      request.onerror = (event) => reject(event);
    });
  }
  
  
  
  // import  function generated by chatgpt

  async importObjectStore(file: File) {
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      const jsonData = JSON.parse(event.target.result);

      // Open IndexedDB
      const request = indexedDB.open('myFoldersDb');

      request.onsuccess = async (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction('myFolders', 'readwrite');
        const store = transaction.objectStore('myFolders');

        // Insert each folder into IndexedDB
        jsonData.forEach((item: any) => {
          store.put(item); // Overwrites if key exists
        });

        console.log('Import completed successfully for myFolders');
      };

      request.onerror = (event) => console.error('Import failed', event);
    };

    reader.readAsText(file);
  }

  // delete db code generated by chatgpt

  async clearObjectStore(dbName: string, storeName: string) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
  
        const clearRequest = store.clear();  // This clears all objects in the store
  
        clearRequest.onsuccess = () => {
          console.log(`All objects in object store "${storeName}" cleared successfully.`);
          resolve(true);
        };
  
        clearRequest.onerror = (event:any) => {
          console.error(`Error clearing object store "${storeName}":`, event);
          reject(event);
        };
      };
  
      request.onerror = (event) => {
        console.error(`Error opening database "${dbName}" for clearing object store:`, event);
        reject(event);
      };
    });
  }
  

  //test

  async updateIndexedDb(updatedData: any) {
    const dbName = 'myFoldersDb';
    const storeName = 'myFolders';
  
 
      // Open IndexedDB directly using indexedDB.open()

  
      // Start a read-write transaction
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      store.clear()
  
      // Update the object store with the reordered data
      updatedData.forEach((item:any) => {
        store.put(item); // Insert or update the item based on folderId
      });
  

      console.log('IndexedDB has been updated with the new order.');
    }




    

}