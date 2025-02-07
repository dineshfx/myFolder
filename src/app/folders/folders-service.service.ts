import { inject, Injectable, Signal, signal } from '@angular/core';
import { sampleData } from '../Data/sample';
import { AppData } from '../Data/DataModal';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class FoldersServiceService {

  public AllData = signal<AppData[]>([]);
  private db = inject(DbService);


//   constructor() {
//     this.db.exportObjectStore('myFoldersDb', 'myFolders')
//     .then(() => console.log('Export successful'))
//     .catch((err) => console.error('Export failed', err));
//  }



 async fetchDataInitiallyFromDb() {
  
  const folders = await this.db.getAllFolders();
  this.AllData.set(folders);


}

async getAllFolders(){

  await this.fetchDataInitiallyFromDb();
  return this.AllData;

  
  
  
}


async getAllFiles(folderId:string | null) {
  await this.fetchDataInitiallyFromDb();  // Wait until data is loaded
  return this.AllData().find((data)=>data.folderId === folderId)


}



  //  getAllFiles(folderId:string | null):AppData | undefined {

  //   const files = this.AllData().find((data)=>data.folderId === folderId)

  //   return files;
  // }




  async getFile(folderId:string | null , fileId:string | null){

    const folder:AppData | undefined =  await this.getAllFiles(folderId);
    const file = folder?.files.find((file)=>{
     return file.fileId === fileId
   });

    return file;



  }

  async deleteFolder(id:string | null){

    const filteredFolders = this.AllData().filter((folders)=>folders.id !==id)

    this.AllData.set(filteredFolders)
    await this.db.deleteFolder(id);
    return filteredFolders;
   
  }

  async deleteFile(folderId:any, fileId:any){



    let folderObj:any = await this.getAllFiles(folderId);

    const filteredFiles = folderObj?.files.filter((file:any)=>file.fileId !== fileId)



    const updatedFolder = { ...folderObj, files: filteredFiles };

    await this.db.deleteFile(updatedFolder);


    // Step 3: Update IndexedDB
    await this.db.updateFolder(updatedFolder); // Update in database



    return updatedFolder;

}



  addFolder(data:any)
   {

    this.AllData().push(data);
    this.db.addFolder(data)

  }

  updateFolder(folderId:any,folderName:any){

    this.AllData().forEach((folder)=>{
      if(folder.folderId === folderId){
        folder.folderName = folderName
        this.db.updateFolder(folder)
      }
    });
    
  }


  async addFile(folderId:any,data:any){

    const folder = await this.getAllFiles(folderId);

    folder?.files.push(data);
    this.db.addFile(folder);

  
  }


  async updateFile(folderId:any , fileId:any , title:any,contents:any){

    const folder = await this.getAllFiles(folderId);
    folder?.files.forEach((file)=>{

      if(file.fileId === fileId){
        file.fileTitle = title;
        file.contents = contents;
    
       
      }

    });

    await this.db.updateFile(folder);


}



}
