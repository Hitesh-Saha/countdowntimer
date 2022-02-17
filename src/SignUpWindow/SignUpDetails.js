import {signup} from "../signupService"
import MasterKey from "../MasterKeyFactory/index";
import { signUpHandler } from "../omaillibfunc/lib/oauth/signUp"
const [getMasterKey, setMasterKey, removeMasterkey] = MasterKey();
var forge=require("node-forge")
var username;
var password;
Office.onReady()
.then(function () {
  Office.context.ui.messageParent("Ready", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
document.getElementById('SignUpProceed').style.background='lightgrey'
 document.getElementById('SignUpProceed').style.pointerEvents='none';
 document.getElementById('SignUpProceed').style.cursor='not-allowed';
  
 Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
 document.getElementById('SignUpProceed').onclick=DetailVerification
 document.querySelector(".eye_svg").addEventListener('click',TogglePasswordVisiblity)
 document.querySelector(".eye_svg1").addEventListener('click',TogglePasswordVisiblitys)
});

var email;
var passCheck,ConfrimPassCheck;

function onMessageFromParent(data) {
  console.log(data.message)
   email = data.message
   document.querySelector("#signup_email_input").value=email

   document.getElementById('confirm_user_noted').addEventListener('change',ValidationChecker)
} 


function ValidationChecker(event){
        if(PasswordValidation() === true && UserPasswordMatch() === true && checkBox() === true){
    document.getElementById('SignUpProceed').style.background='#4BA950'
      document.getElementById('SignUpProceed').style.color='#FFFFFF'
      document.getElementById('SignUpProceed').style.pointerEvents='auto';
      document.getElementById('SignUpProceed').style.cursor='pointer';
   }else{
    document.getElementById('SignUpProceed').style.background='lightgrey'
      document.getElementById('SignUpProceed').style.pointerEvents='none';
      document.getElementById('SignUpProceed').style.cursor='not-allowed';
   }
  }
  function checkBox(event){
    let check_Box;
    if( document.getElementById("confirm_user_noted").checked==true){
      check_Box = true
  }else if(document.getElementById("confirm_user_noted").checked==false){
    check_Box = false
  }
  return check_Box
  }

function PasswordValidation(){
  let inputPass = document.getElementById("signup_password_input").value;
  inputPass
    if(inputPass==""){
      document.querySelector(".sign-up-field-msg").innerHTML="You can't leave this blank!"
    }
     else if(!((inputPass.match(/[a-z]/g) && inputPass.match(
           /[A-Z]/g) && inputPass.match(
          /[0-9]/g) && inputPass.match(
        /[^a-zA-Z\d]/g) && inputPass.length >= 8))){
          document.querySelector(".sign-up-field-msg").innerHTML="Minimum 8 characters, 1 number, uppercase, lowercase, & special charcater"
        passCheck=false
        }
        else
        {
     document.querySelector(".sign-up-field-msg").innerHTML=" "
     passCheck = true
}
   return passCheck
}
function UserPasswordMatch(){
  let confirmpassword=document.getElementById('signup_confirmpassword_input').value
  let inputPass = document.getElementById("signup_password_input").value;

  if(inputPass !== confirmpassword){
  document.getElementById("confrim-pass-match").innerHTML="Password does not match"
  ConfrimPassCheck=false 
  }
  else
  {
    document.getElementById("confrim-pass-match").innerHTML=" "
    ConfrimPassCheck=true
 }
 return ConfrimPassCheck

}

document.getElementById('signup_password_input').onkeyup = ValidationChecker
document.getElementById('signup_confirmpassword_input').onkeyup = ValidationChecker

function DetailVerification(){
  console.log("proceed click")
  username=document.getElementById('signup_email_input').value
  password=document.getElementById('signup_password_input').value
  let signup_user_confirmpassword=document.getElementById('signup_confirmpassword_input').value
  let signup_user_checkbox=document.getElementById('confirm_user_noted').checked
  SignUp_Process(username,password)
  if(signup_user_checkbox && passCheck && ConfrimPassCheck){
    VerifyOTP()
    }
    else{

    }  
  }
function VerifyOTP(){
  document.body.innerHTML=`<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- <h1 class="model-title">OMail</h1> -->
      <title class="model-title">SignSuccess</title>
      <link rel="stylesheet" href="SignUpSuccess.css">
      <link rel="stylesheet" href="SignUpOTP.css">
  <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
   <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
    </head>
     <body>
       <div class="SignUpPage">
         <div class="SignUpHead">
           <div class="header-omail">
             OMail
           </div>
           <div class="header-create">
            Create your account
           </div>
         </div>
         <div class="SignUpSteps">
            <div class="Details-01">
              <img src="assets/01.svg" alt="">
              <span> Enter Details</span>
             </div>
             <div class="lines">
               <img src="assets/Line 6.svg"> 
             </div>
             <div class="Details-02">
              <img src="assets/02.svg" alt="">
              <span> OTP Verification </span>
            </div>
            <div class="lines2">
              <img src="assets/Line 6.svg"> 
            </div>
            <div class="Details-03g">
              <img src="assets/03G.svg" alt="">
              <span> Successfull</span>
            </div>
         </div>
       <div class="succ-content">
          <img src="assets/dear.svg">
       </div>
       <div role="button" id="outlook" class="ms-Button-label">
       <p>Go To Outlook</p>
       </div>
       <div class="logos">
          <img src="assets/Powered By.svg">
       </div>
       </div>
    <script src="./SignUpOTP.js"></script>
  </body>
  </html>`
  document.getElementById('outlook').onclick=CloseSuccessWindow
}
function CloseSuccessWindow(){
  Office.context.ui.messageParent("CLOSE", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
}

function TogglePasswordVisiblity(){
  console.log("Toggle")
    let x = document.querySelector("#signup_password_input");
    let y = document.querySelector(".eye_svg");
    if (x.type === "password") {
      x.type = "text";
      y.src="assets/Eyes-C.svg"

    } else {
      x.type = "password";
      y.src="assets/Eye.svg"
    }
  }
  function TogglePasswordVisiblitys(){
    console.log("Toggle")
      let x = document.querySelector("#signup_confirmpassword_input");
      let y = document.querySelector(".eye_svg1");
      if (x.type === "password") {
        x.type = "text";
        y.src="assets/Eyes-C.svg"

      } else {
        x.type = "password";
        y.src="assets/Eye.svg"

      }
    }
async function SignUp_Process(username,pwd){
  await signUpHandler(username,pwd)
  console.log(username,pwd)
}