function validate_name(){
    var x=document.forms["form2"]["name"].value;
    
    if(isNaN(x)==false ||x == "")
    {
        alert("Name must be filled out and must be alphabets");
        document.forms["form2"]["name"].focus();
        return false;
    }
    document.form2.phone.focus();
    return true;
}
function validate_phone()
{
    var phnum=document.getElementById("phone").value;
    if(isNaN(phnum)||phnum.length!=10)
    {
        alert("enter valid ph-number");
        document.forms["form2"]["phone"].focus();
        return false;
    }
    document.form2.username.focus();
    return true;
}




function validate_prn(){
    var prn = document.form2.prn.value;
    if(prn==""||isNaN(prn)||prn.length!=10){
        alert("Should be a 10 digit number");
        document.form2.prn.focus();
        return false;
    }
   
    return true;
}

function validate_wa(){
    var wa = document.form2.walink.value;
    if(wa==""){
        alert("Enter a valid whatsapp chat link");
        document.form2.walink.focus();
        return false;
    }
    document.form2.prn.focus();
    return true;
}