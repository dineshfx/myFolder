import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { FoldersServiceService } from './folders-service.service';
import { AppData } from '../Data/DataModal';
import { Router } from '@angular/router';
import { DbService } from './db.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [FolderComponent,DragDropModule],
  templateUrl: './folders.component.html',
  styleUrl: './folders.component.css'
})
export class FoldersComponent {

  foldersService = inject(FoldersServiceService);
  private router = inject(Router);
  private db = inject(DbService);

  // WritableSignal for all folders data
  allData: WritableSignal<AppData[]> = signal([]);

  // Flag to toggle horizontal/vertical drag
  isHorizontal: boolean = true; // Default to horizontal

  ngOnInit() {
    this.loadData();
    // this.checkOrientation();
  }

  async loadData() {
    const allData = await this.foldersService.getAllFolders();
    const sortedData = allData().sort((a, b) => a.order - b.order);

    this.allData.set(sortedData);
  }


  move() {
    this.router.navigate(["add-folder"]);
  }

  export() {
    this.db.exportObjectStore('myFoldersDb', 'myFolders')
      .then(() => console.log('Export successful'))
      .catch((err) => console.error('Export failed', err));
  }

  settings() {
    this.router.navigate(["settings"]);
  }

  async drop(event: CdkDragDrop<AppData[]>) {
    const updatedData = [...this.allData()]; // Copy current data
    
    // Move the item in the array
    moveItemInArray(updatedData, event.previousIndex, event.currentIndex); 
  
    // Update the 'order' field based on the new index
    updatedData.forEach((item, index) => {
      item.order = index + 1; // Set the new order based on the index
    });
  
    // Set the updated data
    this.allData.set(updatedData); 
  
    // Log to see the updated data
  
    // Update IndexedDB with the reordered data
   await this.db.updateIndexedDb(updatedData);
   console.log(this.allData());

  }


  onDelete(event:any){

    const sortedData = event.sort((a:any, b:any) => a.order - b.order);
    this.allData.set(sortedData); 

  }

  
}
