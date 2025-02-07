import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppData } from '../../Data/DataModal';
import { FoldersServiceService } from '../folders-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-folder',
  imports: [RouterLink],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {


 @Input() folder!:AppData;

 private folderService  = inject(FoldersServiceService)
 private router = inject(Router);

 @Output() remainingFolders:any = new EventEmitter<any>();

 constructor(private dialog: MatDialog) {}


 
 openAlert(message:any): void {
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { message }
  });
}

async deleteFolderAlert(id:any){
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the folder?'
    }
  });

  dialogRef.afterClosed().subscribe(async result => {
    // result will be true if the user confirmed, false otherwise.
    if (result) {
      // Proceed with deleting the database
      console.log('User confirmed deletion.');
      const remainingFolders = await this.folderService.deleteFolder(id);
      this.remainingFolders.emit(remainingFolders);
    
       this.openAlert("folder deleted!");
      // this.yourService.deleteDatabase();
    } else {
      console.log('User canceled deletion.');
    }
  });
}


 

async onClick(id:string){


await this.deleteFolderAlert(id);


    console.log('deleted');
  
}

 




onEdit(folderId:string){

  this.router.navigate(["edit-folder",folderId])


}



}
