Office.onReady().then(function () {
  Office.context.ui.messageParent(JSON.stringify({type:"ready"}), { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
   Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onContactFromParent);
});

function onContactFromParent(msg){
let decrypted_data=JSON.parse(msg.message);
if(decrypted_data.fromname==undefined){
  decrypted_data.fromname="";
}
if(decrypted_data.fromemail==undefined){
  decrypted_data.fromemail="";
}
// if(decrypted_data.fromname[0]==undefined){
  
// }
  document.getElementById('intitals').innerHTML=decrypted_data.fromname[0];
  document.getElementById('from-name').innerHTML=decrypted_data.fromname;
// let fromName = document.getElementById("from-name")
// let FromNames = document.createElement("div")
// FromNames.textContent = decrypted_data.fromname
// fromName.append(FromNames)
document.getElementById('from-email').innerHTML=`<div>${decrypted_data.fromemail}</div>`;

//--------------DATE--TIME--------------------------
document.getElementById('date-time-value').textContent=decrypted_data.dateTime;

// //--------TO,CC,BCC----------------
let To=[],Cc=[]
if(decrypted_data.to==undefined){decrypted_data.to=[]}
if(decrypted_data.cc==undefined){decrypted_data.cc=[]}

 To=()=>{
  let div=[];
  for(let i=0;i<decrypted_data.to.length;i++){
    div.push(decrypted_data.to[i])
  }
  return div;
}

if(decrypted_data.cc.length==0){
  document.getElementById('cc-address').style.display="none"
}else{
Cc=()=>{
  let div=[];
  for(let i=0;i<decrypted_data.cc.length;i++){
    div.push(decrypted_data.cc[i])
  }
  return div;
}
document.getElementById('cc-value').innerHTML=Cc().join(", ");;

}

 document.getElementById('to-value').innerHTML=To().join(", ");
//  document.getElementById('bcc-value').innerHTML=Bcc().join(", ");;

//  //--------------SUBJECT,BODY-----------------

//document.querySelector("div.ms-Dialog-title").textContent="Subject"

 document.getElementById('mail-display-area').innerHTML=decrypted_data.body;
 document.querySelector('.title-subject').innerHTML=decrypted_data.subject;
//---------------ATTACHMENT------------------------------
let Attachment_Div=document.querySelector("#reciver_window > div.attachment-tab")
let attachmentIcon="";
let attachmentName="";
let AttExtension="";

let a=document.createElement('div')
for(let i=0;i<decrypted_data.attachment.length;i++){

attachmentName=decrypted_data.attachment[i].filename;
AttExtension=attachmentName.substring(attachmentName.lastIndexOf('.') + 1)
console.log(AttExtension)
attachmentIcon=attachmentIconType(AttExtension)
 a.innerHTML+=`<a><div class="attachment" style="display:flex">
  <div class="attachment-icon"><img style="width:30px;height:30px" src=`+attachmentIcon+`></div>
  <div class="attachment-details">
      <div class="attachment-name">`+attachmentName+`</div>
      <div class="attachment-size">`+decrypted_data.attachment[i].size+`KB`+`</div>
  </div>
  <div class="attachment-arrow"><img src="./assets/Arrow.svg"></div>
</div></a>` 
}
a.style.display="flex"
Attachment_Div.append(a)

console.log("Fix onclick on attachment Icon")
let attachclick=document.querySelector("#reciver_window > div.attachment-tab > div")
attachclick.onclick=(event)=>{
 // console.log(event.target.parentElement)
  let file_name=event.target.querySelector(".attachment-details>.attachment-name").textContent
  let index; 
  decrypted_data.attachment.forEach((element,i) => {
    if(element.filename===file_name){
      index=i
    }
  });
  let content=(decrypted_data.attachment[index].content)
  let type=decrypted_data.attachment[index].mimeType
  let element = document.createElement('a');
  event.target.parentElement.append(element)
  let a=event.target.parentElement
  a.setAttribute('href',`data:`+`text/plain;base64,`+content)  //`data:`+type+`;base64`+content
  a.setAttribute('download', file_name);

}


//-----------------REPLY REPLY_ALL FORWARD FUNCTIONALITY---------------------------------

let replyBtn=document.getElementById('reply-button')
let replyAllBtn=document.getElementById('reply-all-button')
let forwardBtn=document.getElementById('forward-button')

let replyBtnsvg=document.getElementById('reply_svg')
let replyAllBtnsvg=document.getElementById('reply_all_svg')
let forwardBtnsvg=document.getElementById('forward_svg')

let window_html=document.querySelector("#reciver_window").innerHTML;
//console.log(window_html)
replyBtn.onclick=()=>{reply_popup("reply",window_html)}//reply_popup("reply-button")
replyAllBtn.onclick=()=>{reply_popup("reply-all",window_html)}
forwardBtn.onclick=()=>{reply_popup("forward",window_html)}

replyBtnsvg.onclick=()=>{reply_popup("reply",window_html)}//reply_popup("reply-button")
replyAllBtnsvg.onclick=()=>{reply_popup("reply-all",window_html)}
forwardBtnsvg.onclick=()=>{reply_popup("forward",window_html)}

}

function reply_popup(type,msg){

//console.log(msg)

let send_msg={
  type:"reply-buttons",
  subtype:type,
  msg:(msg)
}
Office.context.ui.messageParent((JSON.stringify(send_msg)), { targetOrigin: "https://localhost:3000/dist/taskpane.js" });

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