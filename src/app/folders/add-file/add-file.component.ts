import { Component, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoldersServiceService } from '../folders-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';




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



  constructor(private dialog: MatDialog) {}

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


  ngOnInit(): void {


    //     $('#summernote').summernote({
    //   height: 500, // Set the editor height
    //   tabsize: 2,
    //   codeviewFilter: false, // Disable codeview sanitization
    //   codeviewIframe: true,
    //   callbacks: {
    //     onImageUpload: function(files: any) {
    //       let reader = new FileReader();
    //       reader.onload = function(e) {
    //         let img = $('<img>')
    //           .attr('src', e.target?.result)
    //           .attr('loading', 'lazy')
    //           .css('width', '100%'); // Ensure the image is full width

    //         $('#summernote').summernote('insertNode', img[0]);
    //       };
    //       reader.readAsDataURL(files[0]);
    //     }
    //   },
    //   toolbar: [
    //     ['style', ['style']],
    //     ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']], // Added 'strikethrough'
    //     ['fontname', ['fontname']],
    //     ['fontsize', ['fontsize']],
    //     ['color', ['color']],
    //     ['para', ['ul', 'ol', 'paragraph', 'height']], // Added 'height' for line-height control
    //     ['insert', ['link', 'picture', 'video']],
    //     ['table', ['table']],
    //     ['view', ['fullscreen', 'codeview', 'help']],
    //     ['misc', ['hr']],
    //     ['custom', ['insertBootstrapLayout']],
    //   // Added 'hr' for inserting a horizontal line (line break)
    //   ],
    //   buttons: {
    //     insertBootstrapLayout: function() {
    //       var button = $.summernote.ui.button({
    //         contents: '<i class="note-icon-pencil"></i> Insert 2-column layout',
    //         tooltip: 'Insert Bootstrap Layout',
    //         click: function() {
    //           // Bootstrap layout with image in col-4 and list in col-8
    //           var col4 = '<div class="col-4"><img src="https://placehold.co/600x400/EEE/31343C" alt="Placeholder Image" class="img-fluid"></div>';
    //           var col8 = '<div class="col-8"><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>';
    //           var row = '<div class="row">' + col4 + col8 + '</div>'; // Wrap in a row

    //           // Add an empty paragraph after the layout to move the cursor outside
    //           var exitParagraph = '<p><br></p>';

    //           // Insert the layout and move the cursor to a new line
    //           $('#summernote').summernote('pasteHTML', row + exitParagraph);

    //           // Move cursor to the new paragraph
    //           setTimeout(function() {
    //             $('#summernote').summernote('focus'); // Ensure the editor is focused
    //           }, 10);
    //         }
    //       });
    //       return button.render();
    //     }
    //   }
    // });








//        this.activateRoute.paramMap.subscribe({
//       next: async (paramMap)=>{
//        this.folderId =  paramMap.get("folderId");
       
//        if(paramMap.get("fileId")){
//         this.fileId = paramMap.get("fileId")
//         this.isUpdating = true;

//         const file = await this.folderService.getFile(this.folderId,this.fileId);
//         this.fileTitle = file?.fileTitle;
//         this.contents = file?.contents;
// //load contents - check if it has any problems

// $('#summernote').summernote('code', this.contents)

//        }

       

//        this.folder  = await this.folderService.getAllFiles(this.folderId);
//        this.folderName = this.folder?.folderName;
//        console.log(this.folderName)
     

//       }
//     })


  }

ngAfterViewInit(): void {

  $(document).ready(() => {

    $('#summernote').summernote({
      height: 500, // Set the editor height
      tabsize: 2,
      codeviewFilter: false, // Disable codeview sanitization
      codeviewIframe: true,
      callbacks: {
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
        }
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
        ['custom', ['insertBootstrapLayout']],
      // Added 'hr' for inserting a horizontal line (line break)
      ],
      buttons: {
        insertBootstrapLayout: function() {
          var button = $.summernote.ui.button({
            contents: '<i class="note-icon-pencil"></i> Insert 2-column layout',
            tooltip: 'Insert Bootstrap Layout',
            click: function() {
              // Bootstrap layout with image in col-4 and list in col-8
              var col4 = '<div class="col-4"><img src="https://placehold.co/600x400/EEE/31343C" alt="Placeholder Image" class="img-fluid"></div>';
              var col8 = '<div class="col-8"><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>';
              var row = '<div class="row">' + col4 + col8 + '</div>'; // Wrap in a row

              // Add an empty paragraph after the layout to move the cursor outside
              var exitParagraph = '<p><br></p>';

              // Insert the layout and move the cursor to a new line
              $('#summernote').summernote('pasteHTML', row + exitParagraph);

              // Move cursor to the new paragraph
              setTimeout(function() {
                $('#summernote').summernote('focus'); // Ensure the editor is focused
              }, 10);
            }
          });
          return button.render();
        }
      }
    });

    
    $('#summernote').css('width', '100%'); 



    
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

