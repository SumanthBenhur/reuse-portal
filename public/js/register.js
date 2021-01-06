

function validate_name(){
    var x=document.forms["form1"]["name"].value;
    
    if(isNaN(x)==false ||x == "")
    {
        alert("Name must be filled out and must be alphabets");
        document.forms["form1"]["name"].focus();
        return false;
    }
    document.form1.phone.focus();
    return true;
}
function validate_phone()
{
    var phnum=document.getElementById("phone").value;
    if(isNaN(phnum)||phnum.length!=10)
    {
        alert("enter valid ph-number");
        document.forms["form1"]["phone"].focus();
        return false;
    }
    document.form1.username.focus();
    return true;
}

function funblur(){
    document.form1.name.focus();
}

function validate_email()
{
    var emailid = document.form1.username.value;
    var exp=/^\w+@[a-zA-z_]+\.[a-zA-z]{2,3}$/;
    if(emailid==""||exp.test(emailid)==false)
    {
          alert("enter a valid email eg:aashitapadia13@gmail.com");
          document.form1.username.focus();
          return false;
    }
    document.form1.prn.focus();
    return true;

}
function validate_pass()
{
    var pass=document.form1.password.value;
    var ipass=/^(?=.*[0-9])(?=.*[@#$&])[a-zA-Z0-9@#$&]{7,20}$/;
    if(pass==""||ipass.test(pass)==false)
    {
        alert("enter a valid password in which there should be atleast one uppaer case character ,atleast one lower case charachter ,atleast a numeric value and a special character");
        document.form1.password.focus();
        return false;
    }
    document.form1.confirmpassword.focus();
    return true;
}

function validate_cpass()
{
    var pass=document.form1.password.value;
    var cpass=document.form1.confirmpassword.value;
    if(!(pass==cpass))
    {
        alert("password and confirm password should match");
        document.form1.confirmpassword.focus();
        return false;
    }
    document.form1.submit.focus();
    return true;
}

function validate_prn(){
    var prn = document.form1.prn.value;
    if(prn==""||isNaN(prn)||prn.length!=10){
        alert("Should be a 10 digit number");
        document.form1.prn.focus();
        return false;
    }
    document.form1.walink.focus();
    return true;
}

function validate_wa(){
    var wa = document.form1.walink.value;
    if(wa==""){
        alert("Enter a valid whatsapp chat link");
        document.form1.walink.focus();
        return false;
    }
    document.form1.password.focus();
    return true;
}