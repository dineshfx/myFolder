import { ColumnWidthDialogComponent } from "../../column-width-dialog/column-width-dialog.component";
import { fallbackText } from "./fallbackFormattedText";

export const Layout = function(obj: any) {
  return function() {
    var button = $.summernote.ui.button({
      contents: '<i class="note-icon-pencil"></i> Insert 2-column layout',
      tooltip: 'Insert Bootstrap Layout',
      click: () => {
        const editor = $('#summernote');
        const editableArea = $('.note-editable');
        let scrollPosition = editableArea.scrollTop();

        // Save the cursor position before opening the dialog.
        let savedRange = obj.saveCursorPosition(); // Returns a native Range or null

        const dialogRef = obj.dialog.open(ColumnWidthDialogComponent, {
          width: '300px',
          disableClose: true,
          hasBackdrop: true,
          panelClass: 'custom-dialog',
          scrollStrategy: obj.overlay.scrollStrategies.block(), // Prevents scroll issues
          autoFocus: false, // Prevents focus shift from Summernote!
          data: { imageWidth: 40, textWidth: 60 } // Default values
        });

        dialogRef.afterOpened().subscribe(() => {
          const matDialogContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
          if (matDialogContainer) {
            matDialogContainer.style.zIndex = '99998'; // Ensure it appears above Summernote
          }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          // Bring focus back to Summernote and restore the saved cursor position.
          $('#summernote').summernote('focus');
          obj.restoreCursorPosition(savedRange);

          if (!result) return; // User canceled

          const { imageWidth, textWidth } = result;

          // Build your HTML pieces.
          var formattedText = `
            <div style="display: flex; gap:10px; width:100%">
              <div style="width:${imageWidth}%; ">
                <img src="https://placehold.co/600x400/png" style="width:100%">
              </div>
              <div style="width:${textWidth}%; ">
                <div class="text-wrapper">
                  2 Column Layout image and Text
                </div>
              </div>
            </div>`;
          var exit = `<p><hr/></p>`;
       

          // Create a combined HTML string and then a jQuery collection.
          // $elements[0] will be the formatted layout,
          // and $elements[1] will be the exit paragraph.
          var $elements = $(formattedText + exit);
          var $enterElement = $(exit);

          // Get the current range from Summernote for comparison.
          let currentRange = editor.summernote('createRange');
          let currentContents =  editor.summernote('code').trim();;
         console.log(currentContents);

          // Check if the savedRange exists and if its startContainer is within the editor.
          if (
            savedRange &&
            savedRange.startContainer &&
            $.contains(editableArea[0], savedRange.startContainer)
          ) {
            try {
              // Insert the first element (formatted layout) at the saved range.

              if (currentContents === '' || currentContents === '<p><br></p>' || currentContents === '<br>') {
                console.log('Editor is empty.. if block is running...');

                savedRange.insertNode($enterElement)
                let savedRange2 = savedRange.cloneRange();
                savedRange2.collapse(false);
                savedRange2.insertNode($elements[0]);
                    let savedRange3 = savedRange.cloneRange();
                    savedRange3.collapse(false);
                    savedRange2.insertNode($elements[1]);

              }else{

                console.log('entering else block');

                savedRange.insertNode($elements[0]);

                // Clone the saved range and collapse it so that the insertion point is at its end.
                let savedRange2 = savedRange.cloneRange();
                savedRange2.collapse(false);
  
                // Insert the exit paragraph.
                savedRange2.insertNode($elements[1]);


              }
           

              // Now, move the caret to a point after the inserted exit paragraph.
              let newRange = document.createRange();
              const exitNode = $elements[1];
              try {
                newRange.setStartAfter(exitNode);
              } catch (error) {
                // Fallback: Calculate the index of exitNode among its parent's children.
                if (exitNode.parentNode) {
                  const children = exitNode.parentNode.childNodes;
                  const index = Array.prototype.indexOf.call(children, exitNode);
                  newRange.setStart(exitNode.parentNode, index + 1);
                } else {
                  // Last resort: select the contents of exitNode and collapse.
                  newRange.selectNodeContents(exitNode);
                  newRange.collapse(false);
                }
              }
              newRange.collapse(true);
              const sel = window.getSelection();
              if (sel) {
                sel.removeAllRanges();
                sel.addRange(newRange);
              }
            } catch (insertionError) {
              // If any error occurs during insertion, fall back to pasteHTML.
              console.log("entering catch block")
              editor.summernote('pasteHTML',  formattedText + exit);
            }
          } else {
            // If savedRange is not valid or not in the editor, simply paste the combined HTML.

            console.log("Saved range not exists. so else block")
           setTimeout(()=>{
            //editor.summernote('pasteHTML', formattedText + exit);
            editor.summernote('pasteHTML',"<div></div>");
           },100)

           setTimeout(()=>{
            editor.summernote('pasteHTML', formattedText + exit);
       
           },100)
          }

          // Optionally, adjust scroll position.
          setTimeout(() => {
            editableArea.scrollTop(scrollPosition + 300); // Adjust offset as needed.
          }, 100);
        });
      }
    });
    return button.render();
  }
}
