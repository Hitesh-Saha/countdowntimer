import {searchMail} from "../Indexing/IndexingLogic";

 
Office.onReady()
.then(function () {
  Office.context.ui.messageParent("Ready Search", { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
  Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
 document.querySelector("#search_area").addEventListener('keyup',Search_Text)
 
});
 var accessToken="";
var username;
var Subject=[];
var ID;
var MasterK
async function onMessageFromParent(arg){
     //console.log(JSON.parse(arg.message).type)
    if(JSON.parse(arg.message).type=="token"){
    accessToken=JSON.parse(arg.message).tok
    username=JSON.parse(arg.message).usr
    MasterK=JSON.parse(arg.message).MK
    }
    else
    {
     
      console.log(JSON.parse(arg.message))
        let msg=JSON.parse(arg.message)
        console.log(msg)
        let SearchResult=  document.createElement('div')
        SearchResult.classList.add("searches")
        SearchResult.innerHTML+=`<div class="search_result">
        <div class="result_box"></div>
        <div class="search_avatar">
          VD
        </div>
        <div id="IIDiv">
            <div class="search_name">${msg.fromname}</div>
           <div class="search_email">From : ${msg.fromemail}</div>
           <div class="search_subject"> ${msg.subject}</div>
        </div>
        <div class="search_time">${msg.dateTime}</div> 
      </div>`
       console.log(msg.id);
       console.log(msg.dateTime);
        SearchResult.addEventListener('click',()=>LoadSearchedMail(msg.id))
        document.querySelector('.search_initial_main_page').appendChild(SearchResult)
        document.getElementById('result_page').classList.remove("hidden")
        document.getElementById('initial_page').classList.add("hidden")
    }
}

async function Search_Text(e){
if(e.key === "Enter"){
 document.querySelector('.search_initial_main_page').innerHTML=""
document.querySelector(".initial-search-div").innerHTML =`<div class="loader-main">
<div class="loader"></div>
</div>
`
let data=document.querySelector("#search_area").value
let result=(await searchMail(data,username,MasterK))
console.log(result)
let x=0;
let OmailIDs=[];
if(result !== "No Result"){
result.documents.forEach(element => {
OmailIDs.push("OmailID-"+element)
});
document.querySelector(".initial-search-div").innerHTML=""
Search_From_Mails(OmailIDs)
}
else{
    LoadNoResultPage()
}
}
}
let SearchResult="";
var out_msg_id=[]
async function LoadTheMails(data){
if(data.value.length==0){
    console.log("All Search Result Done")
    LoadNoResultPage()
}
else{
for(let i=0;i<data.value.length;i++){
    out_msg_id.push(data.value[i].Id)
}
} 
}

var outlook_ids=[]
async function Search_From_Mails(ID){
  outlook_ids=[]
for(let i=0;i<ID.length;i++){
   await AJAX_CALL(ID[i])
}
// ID.forEach(async element =>{
//    await AJAX_CALL(element)
// })
console.log(outlook_ids);
getDecryptedSub(outlook_ids)

}
async function AJAX_CALL(element){
    let getMessageUrl ='https://outlook.office.com/api/v2.0/me/messages?$search='+'"body:'+element+'"';
    //  await $.ajax({
    //       type: 'GET',
    //       url:getMessageUrl,
    //       headers: {
    //           "Authorization": "Bearer " + accessToken
    //       },
    //       contentType: 'application/json',
  
    //        })
  await fetch(getMessageUrl,{
      method: 'GET',
      headers: 
      {
        "authorization": "Bearer "+accessToken,
      },

    }).then(res=>res.json())
    .then(  function (val) {
               console.log(val);
             val.value.forEach(async element => {
               await outlook_ids.push(element.Id)
             });
          }).catch(function (error) {
          console.log(error)
          });
}
async function IdsArr(val){
    await val.value.forEach(element => {
       out_ids=element.value
    });
    return out_ids
}
function LoadSearchedMail(id){
    Office.context.ui.messageParent(JSON.stringify(id), { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
}
function getDecryptedSub(data){
    Office.context.ui.messageParent("Encrypted-Subject "+JSON.stringify(data), { targetOrigin: "https://localhost:3000/dist/taskpane.js" });
    document.querySelector('.search_initial_main_page').innerHTML=""
}

function LoadNoResultPage(){
  // document.querySelector('.search_initial_main_page').style.marginLeft="170px"
   document.querySelector(".initial-search-div").innerHTML =`
 <div class="initial_text_2">
   No Search results found  
 </div>
`
}
