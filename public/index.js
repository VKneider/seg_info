const form = document.getElementById("formDigitales"),
fileInput = document.querySelector(".file-input"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () =>{
  fileInput.click();
});

var data = new FormData();

const selectCifrado = document.getElementById("tipoCifrado");



fileInput.onchange = ({target})=> { 

  Object.keys(target.files).forEach(key => {
    let file = target.files[key];
    let fileName = target.files[key].name;
    let nameShown;
    if(fileName.length >= 20){
      let splitName = fileName.split('.');
      nameShown = splitName[0].substring(0, 20) + "... ." + splitName[1];
    }else{
      nameShown = fileName;
    }
    
    if (file && fileName) {
      data.append("file",file, fileName); // Añadir el objeto File, no solo el nombre del archivo
    } else {
      console.log("no lo agarra");
    }


    let fileSize = target.files[key].size;
    let uploadedHTML = `
    <li class="rowFile">
      <div class="content upload">
        <img src="images/documento.png" style="width:50px;" alt="">
        <div class="details">
          <span class="name">${nameShown}</span>
          <span class="size">${fileSize}</span>
        </div>
      </div>
    </li>
  `;
  

  uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
  });
  
 
   document.querySelectorAll("[id*='remove']").forEach(element => {
     element.addEventListener("click", function(){
       removeUploadedFile(this);
     });
   });


}


function removeUploadedFile(element){

  let id = element.id;
  let lastIndex = id.lastIndexOf("remove-");

 if (lastIndex !== -1) {
    let fileName = id.substring(lastIndex + "remove-".length);
    data.delete("file");
    element.parentElement.remove();
  }
}

let botonAceptar = document.getElementById("boton-aceptar");
botonAceptar.addEventListener("click", async function(){
 await sendFile();
});

async function sendFile(){
 
    
    const corsFetchHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  

    const options={
      method: 'POST',
      body: data,
      headers: corsFetchHeaders
    }
  
    let div = document.createElement("div");
    div.classList.add("fscreen");
    div.style.zIndex = "1000000";
  
    document.body.appendChild(div);
   
    let url;
    if(selectCifrado.value == "0"){
      url = 'https://localhost/simetrico';}
    else{
        url = 'https://localhost/asimetrico';
    }



    let request = await fetch('https://localhost/simetrico', options);
    
    let response = await request.json();
    console.log(response);
    if(response.success){
      location.reload();
      document.getElementById("formDigitales").reset();
  
    }else{
      alert ("no joya")
    }
   
      
  
  
}