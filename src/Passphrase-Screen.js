import MasterKey from "./MasterKeyFactory";

const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = MasterKey();
Office.onReady()
.then(function () {
  // Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
  Office.context.ui.messageParent("Ready", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
 Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
  document.querySelector(".passphrase-copy").onclick = copyPassphrase
  document.querySelector(".passphrase-copy-text").onclick = copyPassphrase
  document.getElementById("passphrase-btn-ok").onclick = closePassWindow
  // displayPass()
}); 

 function onMessageFromParent(arg) {
  var msgP;
  msgP  = JSON.parse(arg.message)
  console.log(msgP)
  displayPass(msgP)
  }

async function displayPass(msgP){
// let msgP=JSON.parse(await getPassphrase())
// console.log(msgP);
// let date=new Date(parseInt(msgP.date))
document.querySelector('.pass-view-subject-value').innerText=msgP.subject
document.querySelector('.pass-view-recepient-result').innerText=msgP.To
document.querySelector('.passphrase-input').value=msgP.Passphrase
document.querySelector('.pass-view-time').innerText=msgP.date
}
function copyPassphrase(){
  console.log("copying passphrase") 
   let copyText = document.querySelector('.passphrase-input').select();//.innerText
   document.execCommand("copy");
  //Office.context.ui.messageParent("COPY "+copyText, { targetOrigin: "https://localhost:3000/taskpane.js" });
  //navigator.clipboard.writeText(copyText.value);
}
function closePassWindow(){
  Office.context.ui.messageParent("OK", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
}



