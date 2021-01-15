function validate_nop(){
    var x=document.forms["form1"]["nop"].value;
    
    if(x == "")
    {
        alert("Product Name must be filled out ");
        document.forms["form1"]["nop"].focus();
        return false;
    }
    document.form1.img.focus();
    return true;
}


function funblur(){
    document.form1.nop.focus();
}
function fun(){ 
    document.getElementById("form1").reset();
    } 

    document.querySelector('.custom-file-input').addEventListener('change',function(e){
        var fileName = document.getElementById("img").files[0].name;
        var nextSibling = e.target.nextElementSibling
        nextSibling.innerText = fileName
      })