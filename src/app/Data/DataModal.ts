export interface AppData
    {
          
        id:string;
            folderId: string;   
            folderName:string;
            order:number;
            files:
                {
                    fileId:string;
                    fileTitle:string;
                    contents: string;
                    DateCreated:string;
        
                }[]
            ;
            DateCreated:string
            
        
       
    }
