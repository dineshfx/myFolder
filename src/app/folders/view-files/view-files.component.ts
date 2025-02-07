import { Component, inject } from '@angular/core';


import { FoldersServiceService } from '../folders-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppData } from '../../Data/DataModal';
import { DomSanitizer ,SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-view-files',
  imports: [RouterLink],
  templateUrl: './view-files.component.html',
  styleUrl: './view-files.component.css'
})
export class ViewFilesComponent {

  private activatedroute = inject(ActivatedRoute);
  private router = inject(Router);
  private folderService = inject(FoldersServiceService)
  private folderId = "";
   fileId="";
   file!:{
    fileId:string;
    fileTitle:string;
    contents: string;
    DateCreated:string;
} | undefined;

public folder!:AppData | undefined;
sanitizedContent!: SafeHtml;
isLoading = false;


constructor(private sanitizer: DomSanitizer) {}
ngOnInit(){
    this.activatedroute.paramMap?.subscribe({
      next: async (paramMap:any) => {
        this.folderId = paramMap.get('folderId');
        this.fileId = paramMap.get('fileId');
        this.isLoading = true;
        

      this.folder = await this.folderService.getAllFiles(this.folderId)
        //this.file = this.folderService.getFile(this.folderId,this.fileId);
       this.file =  await this.folderService.getFile(this.folderId,this.fileId);

       this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.file?.contents ?? '');
       this.isLoading = false;

       console.log(this.file)
      }
    })
  }


onEdit(){
  this.router.navigate(["/edit-file",this.folderId,this.fileId])
}




  

}

