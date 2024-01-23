const fs = require('fs');
const path = require('path');
const directory = ['public/shopItems/tshirts',
                  'public/shopItems/oversizedts',
                'public/shopItems/hoodies'];
let clothes = []
function loadclothes(dirnum){  
filenames = fs.readdirSync(directory[dirnum]); 
filenames.forEach(element => {
  if (element.isDirectory || 
    element.slice(element.length-3,element.length) == "jpg" ||
    element.slice(element.length-3,element.length) == "png" ||
    element.slice(element.length-4,element.length) == "jpeg"){
  }else{filenames.splice(filenames.indexOf(element),1);}
});
  //changing ' ' to %20

  for (i=0;i<filenames.length;i++){
  filenames[i] = filenames[i].replace(/ /g,"%20")
  }

return filenames}
//loadclothes(0)
//console.log(filenames)
module.exports=loadclothes