import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FoldersComponent } from './folders/folders.component';
import { FilesListComponent } from './folders/files-list/files-list.component';
import { ViewFilesComponent } from './folders/view-files/view-files.component';
import { AddFolderComponent } from './folders/add-folder/add-folder.component';
import { AddFileComponent } from './folders/add-file/add-file.component';
import { SettingsComponent } from './folders/settings/settings.component';

export const routes: Routes = [


    {
        path:"",
        component:FoldersComponent
    },
    {
        path:"folder/:folderId",
        component:FilesListComponent
    },
    {
        path:"folder/:folderId/:fileId",
        component:ViewFilesComponent
    },
    {
        path:"add-folder",
        component:AddFolderComponent
    },
    {
        path:"edit-folder/:folderId",
        component:AddFolderComponent
    }
    ,
    {
        path:"add-file/:folderId",
        component:AddFileComponent
    },
    {
        path:"edit-file/:folderId/:fileId",
        component:AddFileComponent
    },
     
    {
        path:"settings",
        component:SettingsComponent
    }





];
