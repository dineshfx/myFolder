import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { FoldersServiceService } from '../folders-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-add-folder',
  imports: [FormsModule],
  templateUrl: './add-folder.component.html',
  styleUrl: './add-folder.component.css'
})
export class AddFolderComponent {
  folderName:string | undefined = "";
  private foldersService = inject(FoldersServiceService)
  private router = inject(Router);
  private activateroute = inject(ActivatedRoute);
  private folderId:string | null = "" ;
  private isUpdating =false;


  constructor(private dialog: MatDialog) {}


  openAlert(message:any,route:any=[]): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message }
    });

if(route){
  dialogRef.afterClosed().subscribe(result => {
    if (result === 'ok') {
      this.router.navigate(route); // Navigate after the dialog is closed
    }
  });
}
  }

   generateId() {
    return Math.random().toString(36).substr(2, 9);
  }


  ngOnInit(){

    this.activateroute.paramMap.subscribe({
      next: async (data) => {

   if(data.get("folderId")){

    this.folderId = data.get("folderId")

    const folder = await this.foldersService.getAllFiles(this.folderId)
    this.folderName = folder?.folderName;
    this.isUpdating = true;


    
   }

      }
    })

  }
  


  onSubmit(){

    if(!this.folderName){
      // alert("Please enter folder name");
      this.openAlert("Please enter folder name");
      return;
    }

    const today = new Date();
const formattedDate = today.toLocaleDateString('en-GB'); 

    const data = {
    
      
        folderId:  this.generateId(),   
        folderName:this.folderName,
        files:[],
        DateCreated:formattedDate
    };

    if(this.isUpdating){


      this.foldersService.updateFolder(this.folderId,this.folderName)
      // alert("Folder name updated");
      this.openAlert("Folder name updated",["/"]);
      

    }else{
      this.foldersService.addFolder(data);
      // alert("Folder added")
      this.openAlert("Folder added",["/"]);

    }

   
    // this.router.navigate(["/"])
   
    


  }

}
