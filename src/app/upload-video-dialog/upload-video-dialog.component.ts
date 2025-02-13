import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-upload-video-dialog',
  templateUrl: './upload-video-dialog.component.html',
  standalone:true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressBarModule],
  styleUrls: ['./upload-video-dialog.component.css']
})
export class UploadVideoDialogComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;

  constructor(
    public dialogRef: MatDialogRef<UploadVideoDialogComponent>,
    private http: HttpClient,
    private cdr: ChangeDetectorRef

  ) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      //event.target.value = ''; // Reset input to allow selecting the same file
      this.cdr.detectChanges(); // Manually trigger change detection


    }
  }

  uploadVideo() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    
    const formData = new FormData();
    formData.append('video', this.selectedFile);

    this.http.post<{ url: string }>('http://localhost:3000/upload-video', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === 1 && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.body) {
          this.dialogRef.close(event.body.url);
        }
      },
      error: () => {
        this.isUploading = false;
       console.error("Upload failed..");
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
