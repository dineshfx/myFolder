import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-column-width-dialog',
  templateUrl: './column-width-dialog.component.html',
  imports:[MatDialogModule,  MatButtonModule,
    MatInputModule,FormsModule],
  styleUrls: ['./column-width-dialog.component.css']
})
export class ColumnWidthDialogComponent {
  imageWidth: number;
  textWidth: number;


  constructor(
    public dialogRef: MatDialogRef<ColumnWidthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageWidth: number; textWidth: number },
    private dialog: MatDialog
  ) 
  {
    this.imageWidth = data.imageWidth;
    this.textWidth = data.textWidth;
  }

    openAlert(message:any):void {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '300px',
        data: { message }
      });
  

    dialogRef.afterClosed().subscribe(result => {
  
      
    });
  }


  onSave(): void {
    if (this.imageWidth + this.textWidth > 100) {
      this.openAlert("The two values can only add up to 100%!")
     
      return;
    }
    this.dialogRef.close({ imageWidth: this.imageWidth, textWidth: this.textWidth });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
