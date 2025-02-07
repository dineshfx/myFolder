
//Key would be ==== myFolders : []
// now this myFolders key hold all our data

import { AppData } from "./DataModal"


export const sampleData:AppData[] = [    

    {
    id:"ddd",
    folderId: "343546531",   
    folderName:"Netflix",
    order:1,
    files:[
        {
            fileId:"sd001ds",
            fileTitle:"Wednesday netflix series released in 2022",
            contents: "<p>Jenna ortega played as Wednesday Adams in this blockbuster series</p>",
            DateCreated:"01-31-2025",

        },

        {
            fileId:"sd002dt",
            fileTitle:"Stranger Things",
            contents: "<p>Milie bobby brown played as Eleven in this series</p>",
            DateCreated:"01-31-2025",

        }
    ],
    DateCreated:"01-31-2025"
    
}
,

{
    id:"dd",
    folderId: "343546532",   
    folderName:"Prime Video",
    order:2,
    files:[
        {
            fileId:"sd001da",
            fileTitle:"From Tv Series",
            contents: "<p>Html Contents</p>",
            DateCreated:"01-31-2025",

        }
    ],
    DateCreated:"02-01-2025"
    
}

]


/* 

***********************URLs***********************
http://localhost:3200/  ==> homepage which list all folders available ==> here we have a button where we can add a folder name
http://localhost:3200/:folderId ==> we can now list all files present inside of it ==> Here we can add a file .. Form with title and content
http://localhost:3200/:folderId/:fileId ==>this page has edit and delete button we can edit and see contents there once we edited it
http://localhost:3200/export --json expotrt
http://localhost:3200/import --json import
http://localhost:3200/purge  -- purge everything from app
----------------------------------------------------

********************Technology Used***********************

Angular , indexed db, wysiwyg editor











*/