import MasterKey from "../MasterKeyFactory/index";
import OMailAuthController from "../OMailAPI/lib/oauth/OMailAuthController"
const [getMasterKey, setMasterKey, deleteMasterKey] = MasterKey();
var email;
var password;
var confirmPassword = "";
var OTP = "";
let loginButton = document.getElementById("checkUser");
document.getElementById("login_email").addEventListener("change",(e)=>{email = e.target.value})
document.getElementById("login_pass").addEventListener("change",(e)=>{password = e.target.value})

loginButton.onclick=async()=>{
  console.log("login click")
  let authToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
  const controller = new OMailAuthController(email,password,confirmPassword,OTP,authToken);
  console.log("clicked",email,password);
  const omailKey = await controller.signInHandler();
  console.log(omailKey)
if(omailKey){
    //  await setMasterKey(omailKey);
    await setMasterKey(email,masterKey)
    const key = await getMasterKey(email);
    console.log(key);
  }
}