import { Component, inject } from '@angular/core';
import { DbService } from '../db.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  private db:DbService = inject(DbService);

  constructor(private dialog: MatDialog) {}

  openAlert(message:any): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
   export(){

    this.db.exportObjectStore('myFoldersDb', 'myFolders')
    .then(() => console.log('Export successful'))
    .catch((err) => console.error('Export failed', err));

  }
  

// Import function using template reference variable
async importFile(fileInput: HTMLInputElement) {
  const file = fileInput.files?.[0];
  if (file) {
    await this.db.importObjectStore(file);
    console.log('Import started...');
    fileInput.value = ''; // Reset file input after import
    this.openAlert("Db imported!");
  }else{
    this.openAlert("Import file first");
  }
}

async deleteDb(){

  await this.deleteDatabase();
 
}

async deleteDatabase() {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the database?'
    }
  });

  dialogRef.afterClosed().subscribe(async result => {
    // result will be true if the user confirmed, false otherwise.
    if (result) {
      // Proceed with deleting the database
      console.log('User confirmed deletion.');
      await this.db.clearObjectStore("myFoldersDb","myFolders");
      this.openAlert("Database deleted!");
      // this.yourService.deleteDatabase();
    } else {
      console.log('User canceled deletion.');
    }
  });
}


}
