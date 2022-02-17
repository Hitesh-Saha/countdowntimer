import Contactfactory from "../ContactFactory/contactFactory"
import MasterKey from "../MasterKeyFactory/index";
const [setAccessToken,getAccessToken,syncContact,getnextLink] = Contactfactory();
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase,removePassphrase] = MasterKey();
import  checkUser  from "../vaultUtils/userManagementUtils/checkUser";
import {authorizationToken} from "../vaultUtils/token"
import { indexMessageData } from "../Indexing/IndexingLogic";
import {getUserSalt} from "../omaillibfunc/lib/crypto/keystore";
import * as OmailLib from "../omaillibfunc/index";
import { signInHandler } from "../omaillibfunc/lib/oauth/signIn";
import addPassPhrase from "../vaultUtils/passphraseUtils/addPassPhrase";
import getPassphraseDetails from "../vaultUtils/passphraseUtils/getPassPhrase"
import clearAllPassphrase from "../vaultUtils/passphraseUtils/clearAllPassphrase";
import { getNewSalt } from "../omaillibfunc/lib/helpers/OAuthUtils";
export var masterKey;
let forge=require('node-forge')
var isPassphrase=true;
var DecryptedMessage={};
var accessToken;
var UserEmail="";
var password;
var MasterK;

Office.onReady((info) => {
  EntryCheck()
  console.log("v2 Key")
});
async function EntryCheck(){
  // console.log("Clear PassPhrase Here");
  // console.log(await clearAllPassphrase(Office.context.mailbox.userProfile.emailAddress))

Office.context.mailbox.getCallbackTokenAsync({isRest: true},
  async function(result){
  if (result.status === "succeeded") {
     accessToken = result.value;
    await setAccessToken(accessToken)
  }
  else {
    console.log("Error in getToken")
  }
});
 
checkUser(Office.context.mailbox.userProfile.emailAddress)
  .then(async function(value){
    UserEmail=Office.context.mailbox.userProfile.emailAddress  
  if(value){
    await getMasterKey(UserEmail).then(function(val)
    {  
    if(val)
    {
    MasterK=val
    console.log("MasterKey",(MasterK))
    LoadMainPage()
    }
    else
    {
    LoadLoginPage()
    }
  })
 }
  else{
  console.log("Non-Omail User")
  //  removeMasterkey(UserEmail)
    LoadSignUpPage()
   }
  }
  )
 // console.log("Commented Decryption here")
 // read_data()
}

var dialog;
var reply_html;
async function Search_fn(){
  await Office.context.ui.displayDialogAsync('https://localhost:3000/search_window.html',{height:80, width:60, displayInIframe:true},
  function (asyncResult) { 
      dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
  });
async function processMessage(arg) {
  if(arg.message==="Ready Search"){
    //console.log("READY SEARCH")
    let accessToken;
    Office.context.mailbox.getCallbackTokenAsync({isRest: true},async function(result){
      if (result.status === "succeeded") {
         accessToken = result.value;
         let token={
           tok:accessToken,
           usr:Office.context.mailbox.userProfile.emailAddress,
           type:"token",
           MK:MasterK
         }
         console.log(token)
        await dialog.messageChild(JSON.stringify(token))
      }
      else {
        console.log("Error in getToken")
      }
    });
  }
  else if(arg.message.startsWith("Encrypted-Subject ")) {
  
  let DecSub=[];
  let EncSub=(JSON.parse(arg.message.split("Encrypted-Subject ")[1]));
 //console.log(EncSub)
//  await EncSub.forEach(async element => {
  for(let i =0;i<EncSub.length;i++){
  LoadSearchedID(EncSub[i],"DecryptSubject")
  }
  }
  else{
    dialog.close()
    setTimeout(1000,LoadSearchedID(arg.message))
  }
} 
}

export async function run() {
  Office.context.ui.displayDialogAsync('https://localhost:3000/com-window.html',{height: 80, width:80, displayInIframe: true},
      function (asyncResult) { 
          dialog = asyncResult.value;
          dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
  );
  function processMessage(arg) {
   // console.log(arg.message);
    if(arg.message==="Ready"){
      console.log("Inside Reply Com-Window Ready")

      let Emailid = {
        Email:UserEmail,
        type:"Email",
      }
      dialog.messageChild(JSON.stringify(Emailid))
      let accessT = {
        accessToken:accessToken,
        type:"accessToken",
      }
      dialog.messageChild(JSON.stringify(accessT))
    let replying_to_msg=
    {
      "reply-html":reply_html,
      "UserEmail":UserEmail
    }
    dialog.messageChild((replying_to_msg))
    }
    var msg=JSON.parse(arg.message)
     if(msg.type!=""){
       if(msg.type=="CLOSE"){
          dialog.close();
        }
       else{
         getToken(msg);
       }
     }
    else{
    console.log("messege json empty")
     }
   }
}
async function getCurrentItem(msg,accessToken) {

  console.log("Unencrypted Msg",msg);
  if(msg.isPassphrase==undefined){
    isPassphrase=true
  }
  else{
  isPassphrase=msg.isPassphrase;
  }
  //CHANGES IN NONPASSPHRASE FLOW
  const encrypted_mail1=await OmailLib.default.SendMailMessage({
    to:msg.to,
    from:Office.context.mailbox.userProfile.emailAddress,
    cc:msg.cc,
    bcc:msg.bcc,
    subject:msg.subject,
    body:msg.body,
    attachments:msg.attachments
  },msg.isPassphrase)


  const {Omail2Omail,Omail2NonOmail}=encrypted_mail1
  let Omail_encrypted_mail=Omail2Omail
  let NonOmail_encrypted_mail=Omail2NonOmail

  console.log("Encrypted Object",encrypted_mail1)
  
  let msg_id=Math.floor(Math.random()*100000) 
 // let msg_id=" OmailID-"+Math.floor(Math.random()*100000)
  if(Omail_encrypted_mail){
 
  console.log(msg_id);
  await IndexData(msg_id,msg)
  SendMessageObject(Omail_encrypted_mail,msg,msg_id)
  }
  if(NonOmail_encrypted_mail){
    let non_omail_to=[]  
    NonOmail_encrypted_mail.forEach((element) => {
      non_omail_to.push(element.to[0])
    });
    NonOmail_encrypted_mail[0].to=non_omail_to
  setTimeout(SendMessageObject(NonOmail_encrypted_mail[0],msg),4000)
  console.log(await getPassphrase())
  let pass=(await getPassphrase());
  await addPassPhrase(UserEmail,non_omail_to,msg.subject,msg_id,pass);
  console.log(msg);
  // let sentdPassphrase={
  //   "subject":msg.subject,
  //   "To":non_omail_to,
  //   "Passphrase":pass,
  //   "date":new Date().getTime(),
  //   "msgId":msg.id,
  //   "usr":UserEmail
  // }
   await setPassphrase(JSON.stringify(clickedPassphrase))
  await dialog.close() 
  setTimeout(openPassphrase,2000)
  clickedPassphrase={
    "subject":msg.subject,
    "To":non_omail_to,
    "Passphrase":pass,
    "date":new Date(1645079479439).toLocaleString('en-us',{month:'short', day:'numeric'}),
  }
  
  }
  }
  async function SendMessageObject(encrypted_mail,msg,msg_id=""){
    //ADDING TO,CC,BCC EMAILS TO REQUEST DATA
    let emailTo=[]; 
     let emailCc=[];  
     let emailBcc=[];
    for(let i=0;i<encrypted_mail.to.length;i++){
    let To={
      "EmailAddress": {
        "Address":encrypted_mail.to[i]
      }
    }
    emailTo.push(To);
    }
    for(let i=0;i<encrypted_mail.cc.length;i++){
      let Cc={
        "EmailAddress": {
          "Address":encrypted_mail.cc[i]
        }
      }
      emailCc.push(Cc);
    }
    for(let i=0;i<encrypted_mail.bcc.length;i++){
      let Bcc={
        "EmailAddress": {
          "Address": encrypted_mail.bcc[i]
        }
      }
      emailBcc.push(Bcc)
    }
  
  
  encrypted_mail.subject="OMail Encrypted:"+encrypted_mail.subject;
  

  var getMessageUrl ='https://outlook.office.com/api/v2.0/me/sendmail'
  var data={
    "Message": {
      "Subject":encrypted_mail.subject,
      "Body": {
        "ContentType": "Text",
        "Content":encrypted_mail.body+"$OmailID-"+msg_id
      },
      "ToRecipients": [...emailTo
                
              ],
               "CcRecipients": [...emailCc
        
                ],
               "BccRecipients": [...emailBcc
                ],
      "Attachments": []
    },
    "SaveToSentItems": "true"
  }
  //ADDING ATTACHMENTS TO REQUEST DATA
  let arr=[];
  for(let i=0;i<encrypted_mail.attachments.length;i++){
    //CHANGES
  if(encrypted_mail.attachments[i].content===undefined)
  continue;
    
  let attach={
    "@odata.type": "#Microsoft.OutlookServices.FileAttachment",
    "Name":encrypted_mail.attachments[i].filename,
    "ContentBytes":encrypted_mail.attachments[i].content,
  }
  arr.push(attach);
  }
  data.Message.Attachments=arr;
    

    //INSERTING ATTACHMENT ARRAY IN POST REQUEST
  //console.log(msg);
    if(msg.subtype=="reply"){
      getMessageUrl="https://outlook.office.com/api/v2.0/me/messages/"+Office.context.mailbox.convertToRestId(Office.context.mailbox.item.itemId,Office.MailboxEnums.RestVersion.v2_0)+"/reply"
     console.log("Replying");
      data={
        "Comment": encrypted_mail.body+"$OmailID-"+msg_id,
        "Message": 
        {
        "Attachments": 
        [...arr]
        },
      }
    }
    else if(msg.subtype=="reply-all"){
      getMessageUrl="https://outlook.office.com/api/v2.0/me/messages/"+Office.context.mailbox.convertToRestId(Office.context.mailbox.item.itemId,Office.MailboxEnums.RestVersion.v2_0)+"/replyall"
      data={
        "Comment":  encrypted_mail.body+"$OmailID-"+msg_id,
        "Message": 
        {
        "Attachments": 
        [...arr]
        },
      }
    }
    else if(msg.subtype=="forward"){
      getMessageUrl="https://outlook.office.com/api/v2.0/me/messages/"+Office.context.mailbox.convertToRestId(Office.context.mailbox.item.itemId,Office.MailboxEnums.RestVersion.v2_0)+"/forward"
      data={
        "Message": 
        {
        "Attachments": 
        [...arr]
        },
      "Comment": encrypted_mail.body+"$OmailID-"+msg_id, 
      "ToRecipients":[...emailTo]}
      
      console.log("ForWARd IS not deCRYpting")
       }
  //console.log("Commented AJAX CALL")
  //console.log(data) 
   console.log(data);
  await AJAX_CALL(getMessageUrl,data,accessToken)
  }

  async function PassStore(){
    let taskMain = document.getElementById("main_Container")
    // taskMain.innerHTML = ""
    taskMain.innerHTML = `<div class="loader-main">
    <div class="loader"></div>
    </div>` 
    let allPassPhrase
    try{
     allPassPhrase=(await getPassphraseDetails(UserEmail))
    }
    catch(e){
      console.log("PassPhrase not shown , Because Old PassPhrase on server cannot be decrypted");
    }
    console.log(allPassPhrase)
let headerP= `<!DOCTYPE html>
<html lang="en">
<head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
        <link rel="stylesheet" href="passphrase-store.css" />
      <title>Passphrase store</title>
</head>
<body>
<div class="pass-store">
<div class="paas-store-header">
   <div class="pass-store-back">
        <img src="./assets/Chevron_Right.svg">
   </div>
   <div class="pass-store-text">
     Passphrase          
   </div>
</div>  
<div class="pass-store-left">
 <div class="pass-store-sync">
<img src="./assets/sync 1.svg">
 </div>      
 <div class="pass-store-search">
<img src="./assets/Vector (3).svg">
 </div>   
</div> 
</div>`
taskMain.innerHTML=headerP
for(let i=0;i<allPassPhrase.length;i++)
{
  let subjectP=allPassPhrase[i].subject
  let dateP=new Date(1645079479439).toLocaleString('en-us',{month:'short', day:'numeric'})
  let toP=allPassPhrase[i].to
  let passP=allPassPhrase[i].passphrase
  let msgid=(allPassPhrase[i].msgId);
let passphraseStore =`
<div class="pass-store-content" id=${passP} msgid=${msgid}>
  <div class="subject-time">
    <div class="pass-store-subject">
        ${subjectP}
    </div>
    <div class="pass-store-time">
    ${dateP}
    </div>
    <input id="pass_select" value=${passP} type="hidden">
  </div>
  <div class="email-view-delete-copy">
    <div class="pass-store-email">
    ${toP}
    </div>
    <div class="pass-store-delete"  >
        <img src="./assets/delete 2.svg">
        <span class="tooltiptext">Delete</span>
    </div>
    <div class="pass-store-view"  >
          <img src="./assets/eye 3.svg">
          <span class="tooltiptext">View</span>
    </div>
    <div class="pass-store-copy" >
         <img src="./assets/copy 2.svg">
         <span class="tooltiptext">Copy</span>
    </div>
  </div>
</div>`
taskMain.innerHTML += passphraseStore;
}
document.querySelectorAll(".pass-store-view").forEach(element => {
  element.addEventListener('click',openPassphrase)
}); 
document.querySelectorAll(".pass-store-delete").forEach(element => {
  element.addEventListener('click',deletePassphrase)
}); 
document.querySelectorAll(".pass-store-copy").forEach(element => {
  element.addEventListener('click',copyPassphrase)
}); 
document.querySelector(".pass-store-back").onclick=BackForPassphrase
}
function copyPassphrase(e){
  //console.log(e.target.parentElement.parentElement.parentElement.id);
  //console.log("copied passphrase") 

  let copyText =document.querySelector('#pass_select')
  copyText.type = 'text';
  copyText.value=e.target.parentElement.parentElement.parentElement.id
  copyText.select();
  document.execCommand("copy");
  copyText.type = 'hidden';

}
function BackForPassphrase(){
  let taskMain = document.getElementById("main_Container")
  taskMain.innerHTML = `<div class="loader-main">
  <div class="loader"></div>
  </div>` 
  LoadMainPage()
}

async function contact() {
  let taskMain = document.getElementById("main_Container")
  // taskMain.innerHTML = ""
  taskMain.innerHTML = `<div class="loader-main">
    <div class="loader"></div>
    </div>` 
  getContactToken();
  let contactContainer =`<!DOCTYPE html>
  <html lang="en">
    <head> 
        <script src="contact_Screen.js"></script>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
      <link rel="stylesheet" href="contact_Screen.css" />
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
      <link
        rel="stylesheet"
        href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.6.1/css/fabric.min.css"/>
      <title>Contact</title>
    </head>
    <body>
      <div class="main_Contact_container">
      <div class="contact_header">
      <div class="back-btn">
      <img src="./assets/Chevron_Right.svg" alt="back">
      </div>
        <div class="contact_text">Contacts</div>
        <div id="sync" class="Sync" >
          <div class="top_vector">
            <svg width="11" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.53588 1.78599C5.09667 1.23126 6.77356 1.89531 7.59958 3.26021L7.04806 3.45623L9.03439 4.93916L9.63927 2.53526L8.93627 2.78512C7.84068 0.703893 5.35477 -0.319758 3.07539 0.490379C1.70292 0.978185 0.692081 2.03063 0.203347 3.29308L1.36282 4.15863C1.64185 3.09465 2.42365 2.1813 3.53588 1.78599Z" fill="#878D91"/>
            </svg> 
          </div> 
         <div class="bottom_vector">
            <svg width="11" height="5" viewBox="0 0 11 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1701 1.75601L9.01058 0.890457C8.73157 1.95443 7.94975 2.86781 6.83753 3.26311C5.27481 3.81854 3.58143 3.16288 2.75496 1.79556L3.32537 1.59282L1.33905 0.109888L0.734184 2.51378L1.43457 2.26485C2.53032 4.34629 5.01846 5.36891 7.29803 4.5587C8.67049 4.07092 9.68133 3.01848 10.1701 1.75601Z" fill="#878D91"/>
            </svg>
         </div>
        </div>
         <div class="Search">
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.23672 1.14412C5.71114 -0.381372 3.22813 -0.381372 1.70254 1.14412C0.177279 2.66993 0.177279 5.15245 1.70254 6.67827C3.06112 8.03643 5.17703 8.18193 6.70163 7.1214C6.73371 7.27319 6.80713 7.41803 6.92519 7.53609L9.14694 9.75768C9.47071 10.0808 9.9939 10.0808 10.316 9.75768C10.6395 9.43427 10.6395 8.91111 10.316 8.58868L8.09427 6.36642C7.97687 6.24936 7.83168 6.17561 7.67988 6.14354C8.74115 4.61871 8.59563 2.50327 7.23672 1.14412ZM6.53528 5.97687C5.3963 7.11578 3.54264 7.11578 2.40398 5.97687C1.26566 4.83796 1.26566 2.98475 2.40398 1.84585C3.54264 0.70727 5.3963 0.70727 6.53528 1.84585C7.67426 2.98475 7.67426 4.83796 6.53528 5.97687Z" fill="#878D91"/>
            </svg>
        </div>
        </div>
        <div class="contact_Container">
        </div>  
    </body>
  </html>` 
  taskMain.innerHTML = contactContainer
  document.querySelector(".back-btn").onclick = BackForContact
  document.querySelector("#sync").onclick = syncContact
  document.getElementById('#sync').style.pointerEvents = 'none';

  }
  function BackForContact(){
    let taskMain = document.getElementById("main_Container")
    taskMain.innerHTML = `<div class="loader-main">
    <div class="loader"></div>
    </div>` 
    LoadMainPage()
  }
//fetch contact token
  async function getContactToken() {
     let accessToken;
    Office.context.mailbox.getCallbackTokenAsync({isRest: true}, async function(result){
    if (result.status === "succeeded") {
       accessToken = result.value;
      // console.log(accessToken)
       await setAccessToken(accessToken)
    } 
    else {
      console.log("Error in getToken")
    }
  })
}

function send_mail(msg,Token){
   getCurrentItem(msg,Token)
}
//GETTING TOKEN
function getToken(msg){
  let accessToken;
  Office.context.mailbox.getCallbackTokenAsync({isRest: true}, function(result){
    if (result.status === "succeeded") {
      accessToken = result.value;
      send_mail(msg,accessToken)
    }
    else {
      console.log("Error in getToken")
    }
  });
}

//READING DATA FROM OFFICE MAIL IN READ MODE
async function Decrypt() {   
   
  console.log(Office.context.mailbox.item);
     Office.context.ui.displayDialogAsync('https://localhost:3000/rec-window.html',{height: 80, width:80, displayInIframe:true},
       function (asyncResult) { 
           dialog = asyncResult.value;
           dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);

            //RENABLING DECRYPT BUTTON AFTER DECRYPTED WINDOW OPENS CHANGES
          //  document.getElementById('Decrypt').style.pointerEvents = 'auto';
          LoadMainPage()
           
       }
      );
     
      async function processMessage(arg) {
      // console.log(JSON.parse(arg.message));
      
      if((JSON.parse(arg.message).type)=="ready"){
      dialog.messageChild(JSON.stringify(DecryptedMessage))
       }
      //REPLY BUTTON PRESSED ---HTML DATA RECIVED IN TASKPANE
      if((JSON.parse(arg.message).type)=="reply-buttons"){
      reply_html=arg.message//((JSON.parse(arg.message).msg))
     // console.log("REPLY BUTTON PRESSED ---HTML DATA RECIVED IN TASKPANE")
     
      //CLOSING WINDOW
      dialog.close();
      setTimeout(reply_buttons,500)
     }
    } 

    
 }

async function read_data(){
  let taskMain = document.getElementById("main_Container")
  taskMain.innerHTML = ""
  let AnimDecryptWindow =`<div class="loading" data-loading-text="Decrypting..."></div>`
  taskMain.innerHTML = AnimDecryptWindow
  let messageBody;

  //DISABLE BUTTON FROM DOUBLE CLICK CHANGES
  // document.getElementById('Decrypt').style.pointerEvents = 'none';


  console.log("Decryption..")
  var receivedMessage = Office.context.mailbox.item;
  console.log(receivedMessage)


  let id=Office.context.mailbox.convertToRestId(receivedMessage.itemId,Office.MailboxEnums.RestVersion.v2_0)
   Office.context.mailbox.getCallbackTokenAsync({isRest: true}, async function(result){
    if (result.status === "succeeded") {
      
       let accessToken = result.value;

fetch("https://outlook.office.com/api/v2.0/me/messages/"+id, {
  "headers": {
    "authorization": "Bearer "+accessToken,
    "content-type": "application/json",
  },
  "method": "GET",
}).then((res)=>{
res.json().then(
async (data)=>{
 getMessageAttachmentDetails(accessToken,data,"Open-Decrypt-Window")
 
}

)
});


      //  $.ajax({
      //   type: 'GET',
      //   url:`https://outlook.office.com/api/v2.0/me/messages/${id}`,
      //   headers: {
      //       "Authorization": "Bearer " + accessToken
      //   },
      //   contentType: 'application/json',
      //    }).done(async function (data) {
      //   let item=await getMessageAttachmentDetails(accessToken,data,"")
      //   console.log(item)
      //   await Decrypt_logic(item,data,"")
      //   await Decrypt()
        
      //    })
    } 
    else {
      console.log("Error in getToken")
    }
    // return "done"
    })
}

async function getMessageAttachmentDetails(accessToken,data,type){
  let url;
  console.log(data)
  url=Office.context.mailbox.convertToRestId(data.Id,Office.MailboxEnums.RestVersion.v2_0)

  const res=await fetch("https://outlook.office.com/api/v2.0/me/messages/"+url+"/attachments", {
  "headers": {
    
    "authorization": "Bearer "+accessToken,
    
  },
  
  "method": "GET",
  
});
const val=await res.json()
Decrypt_logic(val,data,type)


  // console.log(`https://outlook.office.com/api/v2.0/me/messages/${url}/attachments`)
  // await $.ajax({
  //  url: `https://outlook.office.com/api/v2.0/me/messages/${url}/attachments`,
  //   headers: { 'Authorization': 'Bearer ' + accessToken }
  // })
  // .done(function(item){
  // //  console.log(OtherDetails)
  // return item;
  //  //Decrypt_logic(item,data,type)
      
  // })
  // .fail(function(error){
  //   console.log(error)
  // });
}

async function Decrypt_logic(item,data,type){

  
  let subject=data.Subject.split(':')[1];
  if(subject==' OMail Encrypted'){
    subject=""
  }


  let body=data.Body.Content.split('$OmailID-')[0]
  
  console.log("When Office reads Replies , IT reads random HTML so this");
  if(body.includes("<body>"))
  body=body.split('<body>')[1]
  if(body.includes("<div>"))
  body=body.split('<div>')[1]


  let nAttC = [];
  let nAttNames = [];
  let to=[],cc=[],bcc=[], from=data.from;

data.ToRecipients.forEach(element => {
    to.push(element.EmailAddress.Address)
});
data.BccRecipients.forEach(element => {
  bcc.push(element.EmailAddress.Address)
});
data.CcRecipients.forEach(element => {
  cc.push(element.EmailAddress.Address)
});

//  message_id=(data.itemId)
  let Att_size=[];
  let Att_contentType=[]
  let dateTime=data.dateTimeCreated
  console.log(item)
  //console.log(data)
let attachments=[];

    item.value.forEach(element=>{
      let attObj={}
      attObj.id=parseInt(Math.random()*100)
      attObj.filename=element.Name
      attObj.mimeType=element.ContentType
      attObj.content=element.ContentBytes
      attObj.size=element.Size
      attachments.push(attObj)
    })

  //FOR REMOVING EXTRA KEY.OM When Forwarding
  console.log("How to remove extra KEY.OM and Attachment from forwarded msg");
   //attachments=removeExtraKeyOm(attachments)
   
    console.log(attachments)

    let dAttName=[],dAttContent=[],dSub,dBody;

    let EncryptedMessage={
      to:to,
      cc:cc,
      bcc:bcc,
      dateTime:(""+data.SentDateTime),
      fromemail:data.From.EmailAddress.Address,
      fromname:data.From.EmailAddress.Name,
      subject:subject,
      body:body,
      attachment:attachments,
      user:Office.context.mailbox.userProfile.emailAddress
    }
    //console.log(EncryptedMessage)
    if(type=="DecryptSubject"){
       EncryptedMessage={
        to:to,
        cc:cc,
        bcc:bcc,
        dateTime:(""+data.SentDateTime),
        fromemail:data.From.EmailAddress.Address,
        fromname:data.From.EmailAddress.Name,
        subject:subject,
        body:"",
        attachment:attachments,
        user:Office.context.mailbox.userProfile.emailAddress
        
      }
    }
    let D_Msg;
     D_Msg=(await OmailLib.default.decryptMessage(EncryptedMessage))

     console.log(D_Msg)
      DecryptedMessage={
        to:D_Msg.to,
        cc:cc,
        bcc:bcc,
        dateTime:EncryptedMessage.dateTime,
        fromemail:EncryptedMessage.fromemail,
        fromname:EncryptedMessage.fromname,
        subject:D_Msg.subject,
        body:D_Msg.body,
        attachment:D_Msg.attachments,
        id:data.Id
      }
      
      console.log(DecryptedMessage)

      console.log("Then end",Date.now());

      if(type=="DecryptSubject"){
        dialog.messageChild(JSON.stringify(DecryptedMessage))
      }
      else if(type=="Open-Decrypt-Window"){
        Decrypt()
      }
}

function removeExtraKeyOm(attachmentK){
let firstKeyOm;
let lastKeyOm;

let count=0;
for(let i=0;i<attachmentK.length;i++){
    if(attachmentK[i].filename=='key.om'){
    count++;
    lastKeyOm=i;
    }
  }
  //IN FORWARD IT ALSO SHOWS PREVIOUS MAILS KEY.OM
  //IF THERE IS MORE THAN 1 KEY.OM REMOVE FIRST
  if(count>1){
  for(let i=0;i<attachmentK.length;i++){
    if(attachmentK[i].filename=='key.om'){
    attachmentK.pop(lastKeyOm);
    }
  }
  // for(let i=0;i<attachmentK.length;i++){
  //   if(attachmentK[i].filename=='key.om'){
  //   attachmentK.pop(i);
  //     break;
  //   }
  // }
  }
  
return attachmentK;
}

async function AJAX_CALL(getMessageUrl,data,accessToken){
//SENDING REQUEST THROUGH AJAX CALL

    // $.ajax({
    // type: 'POST',
    // url: getMessageUrl,
    // headers: {
    //     "Authorization": "Bearer " + accessToken
    // },
    // contentType: 'application/json',
    // data: JSON.stringify(data)
    //  }).done(function (data) {
    //  console.log("Message Sent"),
    // dialog.close()
    // }).fail(function (error) {
    // console.log(error)
    // });

await fetch(getMessageUrl,{
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type':'application/json',
    "authorization": "Bearer "+accessToken,
  },
  body: JSON.stringify(data),
  }).then(response => console.log(response))
.then(data =>  
  {
    console.log("Message Sent"),
    dialog.close()
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

async function reply_buttons() {
  
  Office.context.ui.displayDialogAsync('https://localhost:3000/com-window.html',{height: 80, width:80, displayInIframe: true},
     function (asyncResult) { 
       //console.log(asyncResult);
         dialog = asyncResult.value;
     // console.log(dialog)
         dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
   //getContactToken();
     }
 );
 function processMessage(arg) {
   if(arg.message==="Ready"){
    console.log("Send access token and UserEmail from here");
    let Emailid = {
      Email:UserEmail,
      type:"Email",
    }
    dialog.messageChild(JSON.stringify(Emailid))
    let accessT = {
      accessToken:accessToken,
      type:"accessToken",
    }
    dialog.messageChild(JSON.stringify(accessT))
   //SENDING REPLY HTML TO COM-WINDOW
   let replying_to_msg=reply_html
  // console.log((replying_to_msg))
   dialog.messageChild((replying_to_msg))

   }
   else{
   var msg=JSON.parse(arg.message)
    if(msg.type!=""){ 
     
      if(msg.type==="CLOSE"){
        console.log("closing")
         dialog.close();
       }
       else{
        getToken(msg);
      }
    }
   else{
   console.log("messege json empty")
    }
  }}
}

function LoadLoginPage(){
  document.body.innerHTML=
  `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <h1 class="model-title">OMail</h1> -->
  <title class="model-title">OMail</title>
  <link rel="stylesheet" href="login.css">
  <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
  <!-- Office JavaScript API -->
  <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
</head>
<body>
<div class="container">
  <div class="model-body">
    OMail
  </div>
  <div class="img">
    <img src="./assets/Omail-page.png" alt="signup">
  </div>
  <div class="model-para">OMail guarantees your email privacy from all third parties,including</div>
  <div class="login-form">
    <div class="form-body">
      <label for="uname"><b>E-mail</b></label>
      <input type="text" placeholder="Enter E-Mail" name="uname" id="login_email" readonly="readonly" required autocomplete="off">
      <div>
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" id="login_pass" class="password" required autocomplete="off">
      <img id="login_eye" class="eye_svg" src="assets/Eye.svg">
</div>
    </div>
    <button type="submit" id="checkUser">Log In</button>
  </div>
</div>
<script src="./login.js"></script>
</body>
</html>`
document.getElementById("checkUser").onclick = loginHandler;
// document.getElementById("login_email").addEventListener("change",(e)=>{emailID = e.target.value})
document.getElementById("login_pass").addEventListener("change",(e)=>{password = e.target.value})
document.querySelector("#login_eye").addEventListener('click',ToggleEye)
document.querySelector("#login_email").value = UserEmail

}
async function loginHandler(){
  console.log("login click")
  console.log(UserEmail,password)
  let isSigned=await signInHandler(UserEmail,password)
  //console.log(isSigned)
  if(isSigned== true){
   let salt=await getNewSalt(UserEmail);//await getUserSalt(UserEmail);
  console.log(salt)
  // let saltbuffer=forge.util.createBuffer()
  // salt.forEach((item)=>saltbuffer.putInt(item,8))
  // salt=saltbuffer.data
  let masterKey=forge.pkcs5.pbkdf2(UserEmail+password,salt,1000,32)
  masterKey=forge.util.encode64(masterKey)
  // await getUserSalt(UserEmail).then(function(sal){
  //  console.log(sal)
  // salt=Uint8Array.from(sal).buffer
  // })
    console.log("Correct ID and Password")
   // masterKey= generateMasterKey(UserEmail,password,salt)
    //console.log(masterKey.masterKey)
    await setMasterKey(UserEmail,masterKey);
    MasterK=masterKey
    console.log(await getMasterKey(UserEmail))
    LoadMainPage()
  }
  else{
    document.getElementById("checkUser").insertAdjacentHTML("beforebegin",
    "<h4> The email or password you entered isn’t correct.</h4>");
  }

//   let authToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
//   const controller = new OMailAuthController(UserEmail,password,confirmPassword,OTP,authToken);
//   console.log(UserEmail,password);
//   const omailKey = await controller.signInHandler();
//   console.log(omailKey)
// if(omailKey.error_code===0){
//   // let salt = generateSalt()
//   // const KeyStoreUtility = new OMailKeyStoreUtility(this.UserEmail, this.accessToken);
//   //console.log(UserEmail)
//   let salt;
//   await getUserSalt(UserEmail).then(function(sal){
//    //console.log(sal)

//   salt=Uint8Array.from(sal).buffer
//   })

//   console.log(UserEmail,password,salt)
//    masterKey =await generateMasterKey(UserEmail.trim(),password,JSON.stringify(salt))
//    console.log(masterKey)
//  await setMasterKey(masterKey);
//   //   await setMasterKey(JSON.stringify( masterKey));
 
  
//   //console.log(key);
//   LoadMainPage()

//  }
//  else{
//    LoadLoginPage()
//  }
}
function LoadMainPage(){
document.body.innerHTML=`
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Omail</title>
      <link href="taskpane.css" rel="stylesheet" type="text/css" />
      <link href="signup.css" rel="stylesheet" type="text/css" />
  
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
  
  
      <!-- Office JavaScript API -->
      <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script> 
    </head>
        <body>
            <div id ="main_Container">
          <div class="header_text">OMail</div>
          <div class ="contact_headers">
          <header >
           <img width="196px" height="167px" src="./assets/Omail-page.png" alt="omail" title="Omail" />
          </header>
          </div>
         <div class="descreption">
             OMail guarantees your email privacy from all third parties, including
         </div>
         <main>
          <div class="btn">
          <div role="button" id="run" class="ms-Button-label">
              OMail Compose
          </div> 
          <div role="button" id="Decrypt" class="ms-Button-label tooltip">
              Decrypt Message
              <br>
            <span id="tooltip" class="tooltiptext">Select Message for Decrypting</span>
          </div>
         <div role="button" id="contact" class="ms-Button-label">
             Contact
         </div>
         <div role="button" id="search" class="ms-Button-label">
          Search
      </div>
      <div role="button" id="Passphrase" class="ms-Button-label">
      Passphrase
          </div>
      </div>
   </main>
    </div>
      <script src="taskpane.js"></script>
      <!-- <script src="contact_Screen.js"></script> -->
      <script src="contactFactory.js"></script>
     </body>
    </html>`
    document.getElementById("contact").onclick =contact;
    document.getElementById("run").onclick =run;
    var receivedMessage = Office.context.mailbox.item;
    console.log(receivedMessage)
    if(receivedMessage.conversationId === null){
     document.getElementById('Decrypt').style.background='lightgrey'
     document.getElementById('Decrypt').style.color='#4BA950';
     document.getElementById('Decrypt').style.cursor='not-allowed';
   console.log("please select the mail")
    }else{
      document.querySelector('#tooltip').classList.add("hidden");
      document.getElementById("Decrypt").onclick =read_data;
    }    
    document.getElementById("search").onclick =Search_fn;
    document.getElementById("Passphrase").onclick = PassStore;

}

function LoadSignUpPage(){
  document.body.innerHTML=`<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Omail</title>
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
        <link href="signup.css" rel="stylesheet" type="text/css" />
        <!-- Office JavaScript API -->
        <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script> 
      </head>
          <body>
            <div id ="main_Container-signup">
            <div class="header_text-signup">OMail</div>
            <div class ="contact_headers-signup">
            <header >
             <img width="196px" height="167px" src="./assets/Omail-page.png" alt="omail" title="Omail" />
            </header>
            </div>
           <div class="descreption-signup">
               OMail guarantees your email privacy from all third parties, including
           </div>
           <div id="seconds">
             <img src="./assets/Voila60sec.png">
           </div>
           <div role="button" id="signup" class="ms-Button-label">
            Create New Account
             
     </div>
         </div>
         <script src="signup.js"></script>
         <script src="taskpane.js"></script>
       </body>
      </html>`
      document.getElementById('signup').onclick=createNewAccount
}
function createNewAccount(){
  Office.context.ui.displayDialogAsync('https://localhost:3000/SignUpDetails.html',{height:78, width:60, displayInIframe:true},
  function (asyncResult) { 
      dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
  }
);
function processMessage(arg) {
  if(arg.message==="Ready"){
    console.log("READY")
    dialog.messageChild(UserEmail)
    console.log("userEmail-send")
  }
  if(arg.message==="CLOSE"){
    LoadLoginPage()
    dialog.close()
  }
} 
}
function ToggleEye(){
  //console.log("Toggle")
    var x = document.getElementById("login_pass");
    var y = document.querySelector(".eye_svg");

    if (x.type === "password") {
      x.type = "text";
      y.src="assets/Eyes-C.svg"
    } else {
      x.type = "password";
      y.src="assets/Eye.svg"

    }
  }

  async function IndexData(id,data){
  MasterK = await getMasterKey(UserEmail)
    Math.floor(Math.random()*1000)
    let usr=Office.context.mailbox.userProfile.emailAddress
    console.log(data)
    console.log(await indexMessageData(id,usr,data,MasterK))
    }
    // function LoadSearchedID(id){
    //   getMessageByID(id)
    // }

    async function LoadSearchedID(id,type){
     await Office.context.mailbox.getCallbackTokenAsync({isRest: true},
        async function(result){
        if (result.status === "succeeded") {
        let aT = result.value;  
        await fetch( `https://outlook.office.com/api/v2.0/me/messages/${id}`,{
          method: 'GET',
          headers: 
          {
            'Content-Type':'application/json',
            "authorization": "Bearer "+accessToken,
          },
        }).then(response => response.json()
        .then(async data=>{
        console.log(data)
        let to=[],cc=[];
        data.ToRecipients.forEach(element => {
            to.push(element.EmailAddress.Address)
        });
        data.CcRecipients.forEach(element => {
          cc.push(element.EmailAddress.Address)
        });
        if(type=="DecryptSubject"){
          getMessageAttachmentDetails(aT,data,"DecryptSubject")
         }
         else{
          getMessageAttachmentDetails(aT,data,"Open-Decrypt-Window")
         }
        }))
        }})
        
        
    }

    var clickedPassphrase={}
    async function openPassphrase(e){
      if(e!==undefined){
        let parentElements = e.target.parentElement.parentElement.parentElement
      console.log(e)
      clickedPassphrase={
        "subject":parentElements.querySelector(".pass-store-subject").innerText,
        "To":parentElements.querySelector(".pass-store-email").innerText,
        "Passphrase":parentElements.id,
        "date":parentElements.querySelector(".pass-store-time").innerText,
      }
      setPassphrase(JSON.stringify(clickedPassphrase))
      }
      Office.context.ui.displayDialogAsync('https://localhost:3000/Passphrase-Screen.html',{height: 45, width:45, displayInIframe: true},
      await function (asyncResult) { 
          dialog = asyncResult.value;
          dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
  );
    }
    function processMessage(arg) {
      if(arg.message=="Ready"){
          dialog.messageChild(JSON.stringify(clickedPassphrase))
          console.log("Openpass send")
        }
       if(arg.message==="OK"){ 
        dialog.close()
        removePassphrase()
      }
      if(arg.message.split(' ')[0]=='COPY'){
         let copyText = arg.message.split(' ')[1]
        navigator.clipboard.writeText(copyText);
      }
    }

    async function deletePassphrase(e){
      if(e!==undefined){
          let parentElements = e.target.parentElement.parentElement.parentElement
        // console.log(e)
        clickedPassphrase={
          "subject":parentElements.querySelector(".pass-store-subject").innerText,
          "To":parentElements.querySelector(".pass-store-email").innerText,
          "Passphrase":parentElements.id,
          "date":parentElements.querySelector(".pass-store-time").innerText,
          "msgId":parentElements.getAttribute('msgid'),
          "usr":UserEmail
        }
        setPassphrase(JSON.stringify(clickedPassphrase))
        }
      Office.context.ui.displayDialogAsync('https://localhost:3000/Passphrase-Delete.html',{height: 45, width:45, displayInIframe: true},
      await function (asyncResult) { 
          dialog = asyncResult.value;
          dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
  );
    function processMessage(arg) {
      if(arg.message==="Ready"){
        console.log("received ready")
        dialog.messageChild(JSON.stringify(clickedPassphrase))
        console.log("delete-pass-send")
      }
      if(arg.message==="OK"){ 
        dialog.close()
        PassStore()
        removePassphrase()
      }
    }
  }