import { Component, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoldersServiceService } from '../folders-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { ColumnWidthDialogComponent } from '../../column-width-dialog/column-width-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { Layout } from './insert2column';


import { UploadVideoDialogComponent } from '../../upload-video-dialog/upload-video-dialog.component';





declare var $: any; // Declare jQuery for TypeScript


@Component({
  selector: 'app-add-file',
  imports: [FormsModule,RouterLink],
  templateUrl: './add-file.component.html',
  styleUrl: './add-file.component.css'
})
export class AddFileComponent {

  private activateRoute = inject(ActivatedRoute);
  private folderService = inject(FoldersServiceService)
  private router = inject(Router);
  folderId:string | null = "";
  fileId:string | null = "";
  isUpdating = false;
  fileTitle:string | undefined = "";
  contents:string | undefined = "";
folderName:string | undefined= "";
folder:any;
uploadedVideoUrl: string | null = null;



  constructor(private dialog: MatDialog,private overlay: Overlay) {

    
  }

  openAlert(message:any,route:any=[]): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message }
    });

if(route.length > 0){
  dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    if (result === 'ok') {
      this.router.navigate(route); // Navigate after the dialog is closed
    }
  });
}
  }

  generateId() {
    return "file-" + Math.random().toString(36).substr(2, 9);
  }

   saveCursorPosition() {
    const selection = window.getSelection();
    if (selection !== null && selection.rangeCount > 0) {
      return selection.getRangeAt(0).cloneRange();
    }
    return null;

  }
  
   restoreCursorPosition(savedRange: Range | null): void {
    if (savedRange) {
      const selection = window.getSelection();
      if (selection !== null) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
   }


ngAfterViewInit(): void {

  // this.dialog.open(UploadVideoDialogComponent, {
  //   width: '400px'
  // });


  $(document).ready(() => {

    $('#summernote').summernote({
      height: 500, // Set the editor height
      tabsize: 2,
      codeviewFilter: false, // Disable codeview sanitization
      codeviewIframe: true,
      dialogsInBody: true,
      callbacks: {

     
        onInit: function () {

          //$('#summernote').summernote('code', ''); // to make it empty initially

          const editableArea = document.querySelector('.note-editable');
          
          if (editableArea) { // Ensure the element is not null
            const observer = new MutationObserver(() => {
              document.querySelectorAll('iframe, video').forEach((el) => {

                if (el.tagName.toLowerCase() === 'iframe') {
                  // Modify iframe attributes
                  (el as HTMLIFrameElement).setAttribute('width', '350');
                  (el as HTMLIFrameElement).setAttribute('height', '540');
                  //(el as HTMLElement).style.border = '1px solid black'; // Set desired height
                } else if (el.tagName.toLowerCase() === 'video') {
                  // Modify video styles
                  (el as HTMLElement).style.width = '100%';
                  (el as HTMLElement).style.border = '3px solid black';
                }
                
                // Common styling for both iframe and video
                (el as HTMLElement).style.backgroundColor = 'black';
          
              });
            });
    
            observer.observe(editableArea, {
              childList: true,
              subtree: true
            });
          }
        },

        onImageUpload: function(files: any) {
          let reader = new FileReader();
          reader.onload = function(e) {
            let img = $('<img>')
              .attr('src', e.target?.result)
              .attr('loading', 'lazy')
              .css('width', '100%'); // Ensure the image is full width

            $('#summernote').summernote('insertNode', img[0]);
          };
          reader.readAsDataURL(files[0]);
        },
        onImageLinkInsert: function(url:any) {
          let img = $('<img>')
            .attr('src', url)
            .attr('loading', 'lazy')
            .css('width', '100%'); // Make sure it stretches to 100%
    
          $('#summernote').summernote('insertNode', img[0]);
        },
      },
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']], // Added 'strikethrough'
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph', 'height']], // Added 'height' for line-height control
        ['insert', ['link', 'picture', 'video']],
        ['table', ['table']],
        ['view', ['fullscreen', 'codeview', 'help']],
        ['misc', ['hr']],
        ['custom', ['insertLayout','clearButton','insertVideo']],
      // Added 'hr' for inserting a horizontal line (line break)
      ],
      buttons: {
        clearButton: function(context:any) {
          var ui = $.summernote.ui;
          return ui.button({
              contents: '<i class="fa fa-eraser"></i> Clear',
              tooltip: 'Clear Content',
              click: function() {
                  context.invoke('editor.empty'); // Clears the editor
                  context.invoke('editor.focus'); // Focuses back on editor

              }
          }).render();
      },
      insertVideo:()=>{
        var ui = $.summernote.ui;
        return ui.button({
          contents: '<i class="fa fa-upload"></i> Upload',
          tooltip: 'Insert Video',
          click:  () =>{
            const dialogRef = this.dialog.open(UploadVideoDialogComponent, {
              width: '400px'
            });
        
            dialogRef.afterClosed().subscribe((result:any) => {
              if (result) {
                this.uploadedVideoUrl = result;
                this.openAlert("Video uploaded sucessfully")
                const videoHtml = `<video controls><source src="${this.uploadedVideoUrl}" type="video/mp4"></video>`;
                $('#summernote').summernote('pasteHTML', videoHtml);
              }
            });
          }
        }).render();
      },
        insertLayout:Layout(this),
 

      }
    });

    
    $('#summernote').css('width', '100%'); 

    $('#summernote').on('summernote.enterFullscreen', function () {
      $('.note-editor').css('z-index', '1'); // Lower than MatDialog
    });

    
    this.activateRoute.paramMap.subscribe({
      next: async (paramMap)=>{
       this.folderId =  paramMap.get("folderId");
       
       if(paramMap.get("fileId")){
        this.fileId = paramMap.get("fileId")
        this.isUpdating = true;

        const file = await this.folderService.getFile(this.folderId,this.fileId);
        this.fileTitle = file?.fileTitle;
        this.contents = file?.contents;
//load contents - check if it has any problems

$('#summernote').summernote('code', this.contents)

       }

       

       this.folder  = await this.folderService.getAllFiles(this.folderId);
       this.folderName = this.folder?.folderName;
       console.log(this.folderName)
     

      }
    })


 
   
      setTimeout(() => {
        let popover = $('.note-popover.popover');
        popover.css({
          position: 'absolute', // Change from static to absolute
        
        });
      }, 100); // Delay to allow rendering
   
      $('.note-modal .btn-close').removeAttr('aria-hidden');


  });
  }

  async onClick(){

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB'); 

    const data  = {
      fileId:this.generateId(),
      fileTitle:this.fileTitle,
      contents:  $('#summernote').summernote('code'),
      DateCreated:formattedDate,

  };

  if(!this.fileTitle){
   
    this.openAlert("Enter title!")
    return;
  }

  if(this.isUpdating){



    await this.folderService.updateFile(this.folderId,this.fileId,this.fileTitle,$('#summernote').summernote('code'));
    this.openAlert("File updated!",['folder', this.folderId,this.fileId])
    // this.router.navigate(['folder', this.folderId])
    // this.router.navigate(['folder', this.folderId,this.fileId])

  }else{

    console.log(this.folderId)
    await this.folderService.addFile(this.folderId , data);
    this.openAlert("File added",['folder', this.folderId,data.fileId])
    // this.router.navigate(['folder', this.folderId])
    // this.router.navigate(['folder', this.folderId,data.fileId])
   
    

  }





  }

  

}

