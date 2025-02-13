export const fallbackText = (imageWidth:any,textWidth:any) =>{

return  `
<p><br></p>
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

}