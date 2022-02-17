import Factory from "../FACTORY/factory"
import Contactfactory from "../ContactFactory/contactFactory"

const [setAccessToken,getAccessToken,syncContact,getnextLink] = Contactfactory();
const [getSubject,getBody,getAttachment,getAddress,getMessage,getMasterKey,setSubject,setBody,setAttachment,setAddress,setMasterKey,removeAttachment,removeAddress] = Factory();

var subtype="";
let selectedToEmail = []
let selectedCcEmail = []
let selectedBccEmail = []
var Emailid;
// QUILL JS  

Office.onReady()
.then(function () {
  Office.context.ui.messageParent("Ready", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
  Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);

});

var toolbarOptions = {
  container: [
   
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
   
    ['clean'],
    ['link'],
    // ['emoji'], 
    // [{ 'font': [] }],
    //  [{header: [1, 2, 3, false]}],
  ],
  handlers: {

 //   'emoji': function () {}
  }
}
document.getElementById('constraint-handler').checked=true
var quill = new Quill('#quill-injection', {
  modules: {
    "toolbar": toolbarOptions,
  },
  // placeholder: 'Compose an epic...',
  theme: 'snow',
});
var isPassphrase;
document.querySelector("#constraint-handler").onclick=()=>{
let check=(document.getElementById('constraint-handler').checked)
if(check){
isPassphrase=true;
document.querySelector(".constraint__slider").style.background="#0078D4"
document.querySelector(".constraint__slider").classList.remove("slider_red")
document.querySelector(".constraint__slider").classList.add("slider_blue")
}
else{
isPassphrase=false
document.querySelector(".constraint__slider").style.background="#04AA6D"
document.querySelector(".constraint__slider").classList.remove("slider_blue")
document.querySelector(".constraint__slider").classList.add("slider_red")
}
// console.log(isPassphrase)
}
//console.log(document.getElementById('constraint-handler').checked)
let Subject=document.querySelector('.mail-subject-input')
let Body=document.querySelector('.ql-editor')
let discard_btn=document.querySelector('.mail-actions-discard-button');
let mailContainer = document.querySelector('.mail-container');
let mailToInput = document.getElementById('mail-to-input');
let mailCcInput = document.getElementById('mail-cc-input');
let mailBccInput = document.getElementById('mail-bcc-input');
let mailToInputDropdown = document.getElementById('mail-to-input-dropdown');
let mailCcInputDropdown = document.getElementById('mail-cc-input-dropdown');
let mailBccInputDropdown = document.getElementById('mail-bcc-input-dropdown');
let qlEditor = document.querySelector('.ql-editor');
let mailActionsContainer = document.querySelector('.mail-actions-container');
let quillInjection = document.getElementById('quill-injection');

let ccBtn = document.getElementById('mail-cc-btn');
let bccBtn = document.getElementById('mail-bcc-btn');
let mailCcContainer = document.getElementById('mail-cc-container');
let mailBccContainer = document.getElementById('mail-bcc-container');

let mailActionsSendButton = document.querySelector('.mail-actions-send-button');
let attach_btn=document.querySelector('.mail-actions-attachment-button');
let emoji_btn=document.querySelector('.mail-actions-emoji-button');

// for contact-suggestion dropdown in the email input field 
mailToInput.onfocus = () => {
  mailToInputDropdown.classList.remove('mail-users-input-dropdown-disabled');
  mailCcInputDropdown.classList.add('mail-users-input-dropdown-disabled');
  mailBccInputDropdown.classList.add('mail-users-input-dropdown-disabled');
}

mailCcInput.onfocus = () => {
  mailToInputDropdown.classList.add('mail-users-input-dropdown-disabled');
  mailCcInputDropdown.classList.remove('mail-users-input-dropdown-disabled');
  mailBccInputDropdown.classList.add('mail-users-input-dropdown-disabled');
}

mailBccInput.onfocus = () => {
  mailToInputDropdown.classList.add('mail-users-input-dropdown-disabled');
  mailCcInputDropdown.classList.add('mail-users-input-dropdown-disabled');
  mailBccInputDropdown.classList.remove('mail-users-input-dropdown-disabled');
}


mailContainer.onclick = (event) => {
  if (event.target.id !== 'mail-to-input' && event.target.id !== 'mail-cc-input' && event.target.id !== 'mail-bcc-input') {
    mailToInputDropdown.classList.add('mail-users-input-dropdown-disabled');
    mailCcInputDropdown.classList.add('mail-users-input-dropdown-disabled');
    mailBccInputDropdown.classList.add('mail-users-input-dropdown-disabled');
  }
}

// for activating CC and BCC fields
ccBtn.onclick = () => {
  mailCcContainer.classList.remove('mail-cc-disabled');
  ccBtn.classList.add('mail-cc-bcc-btn-disabled');
}

bccBtn.onclick = () => {
  mailBccContainer.classList.remove('mail-bcc-disabled');
  bccBtn.classList.add('mail-cc-bcc-btn-disabled');
}

attach_btn.onchange=()=>{
  //console.log('Attached')
  fileAttachment()
}
const config = { childList: true };
let observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      quillInjection.scrollBy(0, 22);
  });
});
observer.observe(qlEditor, config);
mailActionsSendButton.onclick = () => {
  send_btn();
  observer.disconnect();
}
function getToData(){
  //let ToData="suyash.srivastava14@outlook.com"
  let ToData = selectedToEmail

  return ToData;
}
//-----------------UPDATE SUBJECT-----------------------
Subject.onkeyup=()=>
{
  setSubject(Subject.value);
}
//-----------------UPDATE BODY--------------------------
Body.onkeyup=()=>
{
  setBody(quill.root.innerHTML);
}
//-----------------SEND BUTTON-----------------------
function send_btn(){
  setBody(quill.root.innerHTML);
  document.getElementById("overlay").style.display = "block";
  console.log("Inside Send button")
  let To_Data=getToData();
  let sub=getSubject()
  let body=getBody();
  let type="data"
  let mail_json={}
//console.log(subtype);
  mail_json.to="",mail_json.cc="",mail_json.bcc=""
 
  //setAddress('TO',Emailid)
  mail_json={
    "to":getAddress().to,
    "from":"",
    "cc":getAddress().cc,
    "bcc":getAddress().bcc,
    "subject":sub,
    "body":body,
    "attachments":getAttachment(),
    "type":type,
    "subtype":subtype,
    "isPassphrase":isPassphrase
  }
  Office.context.ui.messageParent(JSON.stringify(mail_json));
}
//--------------- DISCARD BUTTON------------------
discard_btn.onclick=()=>{
  //console.log("Closing Window")
  let data={
    "To":"",
    "from":{},
    "cc":[],
    "bcc":[],
    "subject":"",
    "body":"",
    "attachment":"",
    "att_name":"",
    "type":"CLOSE"
  }
  Office.context.ui.messageParent(JSON.stringify(data));
}

let inputFile=document.getElementById("actual-btn")
function fileAttachment(){
  // const events = arguments[1];
  // const readedFile = [...event.target.files]
const readedFile = [...inputFile.files]
//console.log( readedFile)
  readedFile.map(file=>{
  readFileContent(file);
  
  })
}
// inputFile.addEventListener("change",fileAttachment)
var attachmentArr=[];
var attachmentName=[];  
console.log("NOT ABLE TO READ VIDEO FILE")
function readFileContent(file){               
var fileReader = new FileReader();
fileReader.onload = function(fileLoadedEvent){
var textFromFileLoaded = /,(.+)/.exec(fileLoadedEvent.target.result)[1];
    // attachmentArr.push(textFromFileLoaded)      
    // attachmentName.push(file.name); 
    let id=Math.floor(Math.random()*1000)
    setAttachment(id,"MIME",file.name,textFromFileLoaded)
    //console.log(getAttachment())'
    generateAttachment(file,id);
  };

  fileReader.readAsDataURL(file);   //READ IN BASE64   //fileReader.readAsText(file, "UTF-8");
}

function attachmentIconType(name){
  let attachmentIcon=""
  if(name==="txt"){
    attachmentIcon="./assets/DOC.svg";
  }
  else if(name==="docx" || name==="doc" || name==="odt" || name==="rtf"){
    attachmentIcon="./assets/DOC.svg";
  }
  else if(name==="pdf"){
    attachmentIcon="./assets/PDF.svg";
  }
  else if(name==="ppt" || name==="pptx" || name==="odp"){
    attachmentIcon="./assets/PPT.svg";
  }
  else if(name==="xls" || name==="xlxs" || name==="ods"){
    attachmentIcon="./assets/XL.svg";
  } 
  else if(name==="jpg" || name==="ico" || name==="gif" || name==="png" || name==="svg" || name==="tiff"){
    attachmentIcon="./assets/IMG.svg";
  }
  else if(name==="mp4" || name==="mov" || name==="avi" || name==="webm" || name==="webp" || name==="wmv"){
    attachmentIcon="./assets/VID.svg";
  }
  else if(name==="ogg" || name==="wap" || name==="mp3" || name==="mp3" || name==="mp3"){
    attachmentIcon="./assets/Music.svg";
  }
  // else if(name==="ppt"){
  //   attachmentIcon="./assets/PPT.svg";
  // }
  // else if(name==="ppt"){
  //   attachmentIcon="./assets/PPT.svg";
  // }
  else{
    attachmentIcon="./assets/DEFAULT.svg"
  }
  return attachmentIcon;
}

//GENRATE ATTACHMENT
function generateAttachment (file,id){
let mailAttachmentItemDiv = document.createElement('div')
let wrapper = document.getElementsByClassName('mail-attachment-wrapper')[0]
wrapper.style.marginTop="2vh"

mailAttachmentItemDiv.className = 'mail-attachment-item'
mailAttachmentItemDiv.setAttribute('id',id)
let mailAttachmentItemIcon = document.createElement('div')
mailAttachmentItemIcon.className = 'mail-attachment-item-icon'
let attsvgname=(file.name).substring((file.name).lastIndexOf('.') + 1)
let AttachmentSVG=`<img style="width:30px;height:30px" src=`+attachmentIconType(""+attsvgname)+`>`
mailAttachmentItemIcon.innerHTML=(AttachmentSVG)

let mailAttachmentItemDetail = document.createElement('div')
mailAttachmentItemDetail.className = 'mail-attachment-item-detail'
mailAttachmentItemDetail.title = `${file.name}`
let mailAttachmentItemDetailName = document.createElement('div')
mailAttachmentItemDetailName.className = 'mail-attachment-item-detail-name'
let attachmentName = document.createElement('p')
attachmentName.textContent = `${file.name}`
let mailAttachmentItemDetailSize = document.createElement('div')
mailAttachmentItemDetailSize.className = 'mail-attachment-item-detail-size'
mailAttachmentItemDetailSize.innerHTML = `${file.size} KB`

mailAttachmentItemDetailName.appendChild(attachmentName)
mailAttachmentItemDetail.appendChild(mailAttachmentItemDetailName)
mailAttachmentItemDetail.appendChild(mailAttachmentItemDetailSize)
mailAttachmentItemDetail.onclick = ()=>downloadAttachment(file)


let mailAttachmentItemClose =document.createElement('div')
mailAttachmentItemClose.className = "mail-attachment-item-close"
mailAttachmentItemClose.innerHTML=`
<svg xmlns="http://www.w3.org/2000/svg" width="75%" fill="#005A9E" class="attachment-close" viewBox="0 0 16 16">
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
</svg>
`
mailAttachmentItemClose.onclick = (e)=> closeAttachment(e)

// let svgNSClose = 'http://www.w3.org/2000/svg';
// let svgElClose = document.createElementNS(svgNSClose, 'svg');
// let pathElClose = document.createElementNS(svgNSClose, 'path');
// svgElClose.setAttribute('class', 'bi bi-x');
// svgElClose.setAttribute('width', '75%');
// pathElClose.setAttribute('d', 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z');
// svgElClose.setAttribute('fill', 'grey');
// svgElClose.setAttribute('viewBox', '0 0 16 16');

// svgElClose.appendChild(pathElClose)
// mailAttachmentItemClose.appendChild(svgElClose)
// mailAttachmentItemDiv.appendChild()
mailAttachmentItemDiv.appendChild(mailAttachmentItemIcon)
mailAttachmentItemDiv.appendChild(mailAttachmentItemDetail)
mailAttachmentItemDiv.appendChild(mailAttachmentItemClose)

wrapper.appendChild(mailAttachmentItemDiv)
}

//CLOSE BUTTON ON ATTACHMENT
function closeAttachment(e){
  console.log(e)
//removeAttachment(e.target.parentElement.parentElement.ID)
try{
console.log("Some error in removal of attachmnet in factory function ")
let wrapper = document.getElementsByClassName('mail-attachment-wrapper')[0]
// console.log(wrapper)
console.log(e.target.parentElement.parentElement.parentElement)
removeAttachment(e.target.parentElement.id)
// wrapper.remove(e.target.parentElement.parentElement.parentElement)
document.querySelector(".mail-attachment-wrapper").removeChild(e.target.parentElement)
console.log(getAttachment())
}
catch(e){
console.log("Try To close attachment again")
}
}
//DOWNLOAD ATTACHMENT
function downloadAttachment(file){
  
let filename = file.name;   
}
 var Emailid;
//  alert(`Email Id ${Emailid}`)
// Contacts (To,CC,Bcc) DropDown
function onMessageFromParent(data) {
  
  //console.log(JSON.parse(data.message)); 

  if(JSON.parse(data.message).type === "Email"){
   Emailid = JSON.parse(data.message).Email
      // alert(Emailid)
   console.log(Emailid);
  let frombox= document.querySelector(".from-id")
  frombox.innerHTML=`<div>${Emailid}</div>`
 }
   var accessToken;
   if(JSON.parse(data.message).type=="accessToken"){
    accessToken = JSON.parse(data.message).accessToken
    getContactItem(accessToken)
 }
   if(JSON.parse(data.message).type=="reply-buttons"){

    subtype=JSON.parse(data.message).subtype //GLOBAL VAR FOR SUBTYPE
 
  let sub_type=JSON.parse(data.message).subtype

  let reply_html=document.createElement('div')
  reply_html.setAttribute('id',"reply-html")
  reply_html.innerHTML=(JSON.parse(data.message).msg)
  document.getElementById('get-subject').readOnly=true

  let Fromrec=reply_html.childNodes[3].childNodes[3].childNodes[1].childNodes[3].innerText
  //console.log(Fromrec);

  let Torec=reply_html.childNodes[5].childNodes[1]
  Torec=(Torec.childNodes[1].childNodes[0].textContent); //TO CONTENT IN IT
  let Ccrec=(reply_html.childNodes[5].childNodes[3].childNodes[1].innerText)

//SETTING TO AND CC SO KEY.OM CAN BE BUILT FOR IT 
let to_section="",cc_section="";
if(sub_type=="reply"){
  document.getElementById('get-subject').value="Re: "+reply_html.childNodes[1].textContent
  

  setAddress('TO',Fromrec)
  to_section+=`<div class="mail-users-selected">
  <div class="mail-users-selected-avatar">${Fromrec.trim().charAt(0)}</div>
  <div class="mail-users-selected-email">${Fromrec.trim()}</div> 
  </div>`
 
}
if(sub_type=="reply-all"){
  document.getElementById('get-subject').value="Re: "+reply_html.childNodes[1].textContent
 
  if(!Torec.includes(Fromrec))
  Torec=Torec+","+Fromrec

    if(Torec!==""){
    Torec.split(',').forEach((ele)=>{
     
      setAddress('TO',ele.trim())
      to_section+=`<div class="mail-users-selected">
      <div class="mail-users-selected-avatar">${ele.trim().charAt(0)}</div>
      <div class="mail-users-selected-email">${ele.trim()}</div> 
      </div>`
      
    })}
    console.log(Ccrec);
    if(Ccrec==" Loading....")
    Ccrec=""
    if(Ccrec!==""){
    Ccrec.split(',').forEach((ele)=>{
      setAddress('CC',ele.trim())
      cc_section+=`<div class="mail-users-selected">
      <div class="mail-users-selected-avatar">${ele.trim().charAt(0)}</div>
      <div class="mail-users-selected-email">${ele.trim()}</div> 
      </div>`
      
    })}
  }
  if(sub_type=="forward"){
    document.getElementById('get-subject').value="Fw: "+reply_html.childNodes[1].textContent
    
  }
 
    //console.log(getAddress())




  //REMOVING UNESSECERY HTML CONTENT FROM PREVIOUS WINDOW
  reply_html.removeChild(reply_html.childNodes[11])
  reply_html.childNodes[3].removeChild(reply_html.childNodes[3].childNodes[5]) 
  reply_html.removeChild(reply_html.childNodes[1])
  reply_html.childNodes[2].removeChild(reply_html.childNodes[2].childNodes[1])

 
  
  //console.log(reply_html.childNodes);
  
document.querySelector(".mail-users-input").style.display = "contents"
  document.querySelector("body > div.mail-container > div.mail-attachment.mail-attribute").after(reply_html)
  //ADDING STYLES TO Certain text
  document.querySelector("#from-name").innerHTML=`<b>From:</b>&#32;`+document.querySelector("#from-name").innerHTML
  document.querySelector("#date-time-value").innerHTML=`<b>Sent:</b>&#32;`+document.querySelector("#date-time-value").innerHTML
  document.querySelector("#date-time-value").style.color='black'
  document.querySelector("#date-time-value").style.fontSize='15px'
  document.querySelector("#to-cc-bcc").style.padding='2px'
 // document.getElementById('from-name')
 //document.querySelector("#mail-to-input").style.readOnly=true;
 if(sub_type=="reply-all" || sub_type=="reply" ){
 document.querySelector("body > div.mail-container > div.mail-to.mail-attribute > div.mail-users > div").innerHTML=to_section
 
 document.querySelector("#mail-cc-container > div.mail-users > div").innerHTML=cc_section//getAddress().toString()

 document.getElementById('mail-bcc-input').parentElement.innerHTML=""
 
 }
 //console.log(Emailid)
 document.querySelector("body > div.mail-container > div.mail-from.mail-attribute > div > div.mail-from-user > div").textContent=Emailid


  }
}
function delay(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}


var contactEmail = []
function getContactItem(accessToken) {

  mailToInput.onkeyup=(delay(function (e) {
    inputData(e)
  }, 200));

  mailCcInput.onkeyup=(delay(function (e) {
    inputData(e)
  }, 200));

  mailBccInput.onkeyup=(delay(function (e) {
    inputData(e)
  }, 200));
  
  
async function inputData(e) {
// console.log(e);
contactEmail = []
let inputdata = e.target.value 

if(inputdata !== "" ){

let getcontacts = "https://outlook.office365.com/api/v2.0/me/people?$top=5&$search="+""+inputdata+"";
//AJAX Call

await fetch(getcontacts,{
  method: 'GET',
  headers: 
  {
    "authorization": "Bearer "+accessToken,
  },
}).then(res=>res.json().then(items=>{
  for(let j=0;j<(items.value).length;j++)
  {
  contactEmail.push((items.value)[j].ScoredEmailAddresses[0].Address)
  }
}))
.catch((error) => {
  console.log(error);
})

// await $.ajax({
// url: getcontacts,
// dataType: "json",
// headers: { Authorization: "Bearer " + accessToken },
// })
// .done((items) => {
//   for(let j=0;j<(items.value).length;j++){
//        contactEmail.push((items.value)[j].ScoredEmailAddresses[0].Address)
//       }
// })
// .fail(function (error) {
//   console.log(error);
// });
let parentelement = e.target.parentElement.parentElement
 let dropDownElement = parentelement.querySelector(".mail-users-input-dropdown") 
  dropDownElement.innerHTML="";
console.log(contactEmail)
  if (!contactEmail.length) {
    mailToInputDropdown.innerHTML = `<div class="for-no-contact">
    For using this address Enter : Enter Key
    </div>
    `  
    if(e.key === "Enter"){
      mailToInputDropdown.innerHTML = " "
    let enterEmail = document.createElement("div")
    // enterEmail.classList.add = "mail-users-selected"
    // enterEmail.style.display = "flex"
    enterEmail.innerHTML= `<div class="mail-users-selected">
    <div class="mail-users-selected-avatar">
                                             ${inputdata.charAt(0)}
                                        </div>
                                        <div class="mail-users-selected-email">
                                              ${inputdata}
                                        </div> 
                                        <div id ="closebtn" class="mail-users-selected-close">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="75%" fill="#005A9E" class="bi bi-x" viewBox="0 0 16 16">
                                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                              </svg>
                                        </div>
                                        </div>
                                        `
                                  var emailId = enterEmail.querySelector(".mail-users-selected-email").innerText
                                  if (mailToInput.value){
                                    setAddress("TO",emailId.trim())
                                     
                                  }
                                  else if (mailCcInput.value){
                                    setAddress("CC",emailId.trim())
                                  }
                                  else if (mailBccInput.value){
                                    setAddress("BCC",emailId.trim())
                                      //console.log(selectedBccEmail)

                                  } 
                                        mailToInput.value = null
                                        mailCcInput.value = null
                                        mailBccInput.value = null
      let Closebtn = enterEmail.querySelector("#closebtn")
      Closebtn.onclick = () => CloseButton()
      function CloseButton() {
        console.log("Find a efficent way for closeBtn")
        let type=Closebtn.parentElement.parentElement.parentElement.parentElement.childNodes[1].innerText.toUpperCase()
        console.log(Closebtn.parentElement.parentElement.parentElement.children[1].innerText)
        let email=(Closebtn.parentElement.children[1].innerText)
        removeAddress(type,email)
        enterEmail.innerHTML = ""
              
      }
              parentelement.prepend(enterEmail)

}
  }

  contactEmail.forEach(item => {
    var dropDownItem = document.createElement("div")
    // dropDownItem.classList.add = "mail-users-input-dropdown-item"
    // dropDownItem.style.display = "flex"
    dropDownItem.innerHTML = `<div class="mail-users-input-dropdown-item">
                                  <div class="mail-users-input-dropdown-item-avatar">
                                      ${item.charAt(0)}
                                  </div>
                                  <div class="mail-users-input-dropdown-item-email">
                                       ${item}
                                  </div>
                                  </div>
                                  `;
    dropDownElement.appendChild(dropDownItem) //error
  
    //selection 
    let selectUserData = document.createElement("div")
    // selectUserData.classList.add = "mail-users-selected"
    // selectUserData.style.display = "flex"
    dropDownItem.addEventListener("click", () => {
      selectUserData.innerHTML = ` <div class="mail-users-selected">
                                        <div class="mail-users-selected-avatar">
                                             ${item.charAt(0)}
                                        </div>
                                        <div class="mail-users-selected-email">
                                              ${item}
                                        </div> 
                                        <div id ="closebtn" class="mail-users-selected-close">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="75%" fill="#005A9E" class="bi bi-x" viewBox="0 0 16 16">
                                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                              </svg>
                                        </div>
                                        </div>
                                   `
                                   var emailId = selectUserData.querySelector(".mail-users-selected-email").innerText.trim()
                                   if (mailToInput.value){
                                     if((getAddress().to.includes(emailId)==false))
                                     setAddress("TO",emailId.trim())
                                       console.log(getAddress())
                                   }
                                   else if (mailCcInput.value){
                                     if((getAddress().cc.includes(emailId)==false))
                                     setAddress("CC",emailId.trim())
                                       console.log(getAddress())
                                   }
                                   else if (mailBccInput.value){
                                     if((getAddress().bcc.includes(emailId)==false))
                                     setAddress("BCC",emailId.trim())
                                       console.log(getAddress())
 
                                   } 
    
      mailToInput.value = null
      mailCcInput.value = null
      mailBccInput.value = null 
      dropDownElement.innerHTML=""

 let Closebtn = selectUserData.querySelector("#closebtn")
      Closebtn.onclick = () => CloseButton()
      function CloseButton() {
        console.log("Find a efficent way for closeBtnO")
        let type=Closebtn.parentElement.parentElement.parentElement.parentElement.childNodes[1].innerText.toUpperCase()
        let email=(Closebtn.parentElement.children[1].innerText)
        removeAddress(type,email)
        console.log(getAddress())
        selectUserData.innerHTML = ""
              }
           parentelement.prepend(selectUserData) 
           
    })
  
    });
    
    }else{
      document.querySelector(".mail-users-input-dropdown").innerHTML="";
      console.log("empty input data (Hardcoded)");
    }
}
}