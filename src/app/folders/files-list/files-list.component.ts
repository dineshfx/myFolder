import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoldersServiceService } from '../folders-service.service';
import { AppData } from '../../Data/DataModal';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DbService } from '../db.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-files-list',
  imports: [RouterLink,DragDropModule],
  templateUrl: './files-list.component.html',
  styleUrl: './files-list.component.css'
})
export class FilesListComponent {

  private foldersServive = inject(FoldersServiceService);
  private db = inject(DbService);
  private activatedroute = inject(ActivatedRoute);
  private route  =  inject(Router);

  private folder!:AppData;

  private folderId:string | null = "";

  public filesList:any;

  public files:any;

    constructor(private dialog: MatDialog) {}
  

  ngOnInit(){
    this.activatedroute.paramMap.subscribe({

      next: async (paramMap)=> {
       
        this.folderId = paramMap.get('folderId');
   
       this.filesList = await this.foldersServive.getAllFiles(this.folderId);
       this.files = this.filesList.files;
      // console.log(this.filesList)

   
      }
    });
  }

    openAlert(message:any): void {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '300px',
        data: { message }
      });
    }

  async deleteFileAlert(folderId:any , fileId:any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete the file?'
      }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      // result will be true if the user confirmed, false otherwise.
      if (result) {
        // Proceed with deleting the database
        console.log('User confirmed deletion.');
        this.filesList = await this.foldersServive.deleteFile(folderId,fileId);
        this.files = this.filesList.files;
         this.openAlert("file deleted!");
        // this.yourService.deleteDatabase();
      } else {
        console.log('User canceled deletion.');
      }
    });
  }
  


  async onDelete(folderId:any , fileId:any){



  await this.deleteFileAlert(folderId,fileId);

  }


  onEdit(folderId:any , fileId:any){

this.route.navigate(["/edit-file",folderId,fileId])

  
  }
  
  async drop(event: any) {
    const updatedData = [...this.files]; // Copy current data
    
    // Move the item in the array
    moveItemInArray(updatedData, event.previousIndex, event.currentIndex); 
    this.files = updatedData;
    const upDatedFolder = {...this.filesList,files:this.files}
    await this.db.updateFolder(upDatedFolder);
    console.log("re arranged")
    

  }
  

}
