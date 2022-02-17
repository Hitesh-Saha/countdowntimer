import Contactfactory from "../ContactFactory/contactFactory"
const [setAccessToken,getAccessToken,syncContact,getnextLink] = Contactfactory();
// let contactContainers;
//document.querySelector("#sync").onclick = syncContact
 // contactContainers = document.querySelector(".main_Contact_container")
 // console.log(contactContainers)
  
//   export default contactContainers;

// Office.onReady().then(function () {
// console.log("window ready");
// Office.context.ui.messageParent("ready", { targetOrigin: "https://localhost:3000/taskpane.js" });
// Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onContactFromParent);
// });

// var accessToken;
// async function onContactFromParent(arg) {
//   accessToken = JSON.parse(arg.message)
// console.log(getAccessToken())
// }
