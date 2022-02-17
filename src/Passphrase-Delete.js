import MasterKey from "./MasterKeyFactory";
import deletePassphrase from "./vaultUtils/passphraseUtils/deletePassphrase";
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = MasterKey();
Office.onReady()
.then(function () {
  Office.context.ui.messageParent("Ready", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
  console.log("sended ready")
 Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
  document.querySelector(".pass-delete").onclick = deletePassWindow
  document.querySelector(".pass-cancel").onclick = closePassWindow
});
var msgPassphrase;
 async function onMessageFromParent(arg) {
   var msgP;
  console.log(arg.message)
   msgP  = JSON.parse(arg.message)
  displayPass(msgP)
  }
  // if(msgP===undefined){
    // console.log("not received data")
  // }else{
  async function displayPass(msgP){
    console.log(msgP)
    msgPassphrase=msgP
  // msgP=JSON.parse(await getPassphrase())
  // console.log(msgP);
  // let date=new Date(parseInt(msgP.date))
  document.querySelector('.pass-view-subject-value').innerText=msgPassphrase.subject
  document.querySelector('.pass-view-recepient-result').innerText=msgPassphrase.To
  document.querySelector('.passphrase-input').innerText=msgPassphrase.Passphrase
  document.querySelector('.pass-view-time').innerText=msgPassphrase.date
}
function closePassWindow(){
  Office.context.ui.messageParent("OK", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
}
async function deletePassWindow(){
  console.log(msgPassphrase)
  console.log(msgPassphrase.usr,msgPassphrase.msgId);
const resp = await deletePassphrase(msgPassphrase.usr,msgPassphrase.msgId)
  if(resp){
    Office.context.ui.messageParent("OK", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
  }
  else{
    console.log("Some error in deleting passphrase");
  }
}
  