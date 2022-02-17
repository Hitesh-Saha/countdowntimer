export default function Contactfactory(){
  var contactArray = [];
  var contactName = [];
  var accessToken;
  var nextlink="";
  var hasMore = true;
  var url  = "https://outlook.office365.com/api/v2.0/me/contacts";

  
  //intersection observer 
  let options = {
   root: null ,
   rootMargin: '0px',
   threshold: 1
 }     
 let observerI;
  return[

function setAccessToken(acc)
{
      accessToken = acc;
     //console.log(accessToken)
},

function getAccessToken(){      
   return accessToken; 
   
},
 async function syncContact(){
   console.log("sync Contact")
   document.querySelector('#sync').style.pointerEvents = 'none';
   var LoadingDiv;
   let contact_Container=document.querySelector("#main_Container > div > div.contact_Container")
   contact_Container.innerHTML = ""
   fetch(url,{
      method: 'GET',
      headers: 
      {
        "authorization": "Bearer "+accessToken,
      },
    }).then(res=>res.json().then(items=>{
//  await $.ajax({
//  url: url,
//  dataType: "json",
//  headers: { Authorization: "Bearer" + accessToken },
//     }).done((items) => {
            if(nextlink){
            hasMore=true;
            }
  let data = JSON.stringify(items.value);
  LoadingDiv = document.createElement("div")
  LoadingDiv.setAttribute("id","loading")
  LoadingDiv.innerText = "Loading...."
  contact_Container.appendChild(LoadingDiv)

  async function getnextLink(){
   console.log("call getNextLink")
   if( hasMore === true ){
     contactArray=[]
     contactName=[]
     fetch(url,{
      method: 'GET',
      headers: 
      {
        "authorization": "Bearer "+accessToken,
      },

     }).then(res=>res.json())
//     $.ajax({
//     url: url,
//     dataType: "json",
//     headers: { Authorization: "Bearer " + accessToken },
//  })
 .then((items) => {
    url = items['@odata.nextLink']
    if(url === undefined ){
      hasMore = false
     }
    let data = JSON.stringify(items.value);
   //  console.log(items)
    for(let j=0;j<(items.value).length;j++){
    contactArray.push((items.value)[j].EmailAddresses[0].Address)
    contactName.push((items.value)[j].DisplayName)
   //  console.log(contactName[j],contactArray[j])
   }

   if(contactArray.length === 0 ){
    LoadingDiv.innerHTML = " "
    let noContact = document.createElement('div');
    noContact.classList.add('contact_div');
    noContact.innerHTML =`<div class="no-contact">
                      No Contacts
                  </div>
    `
    contact_Container.appendChild(noContact);
   }else{
   for (let i = 0; i <contactArray.length; i++) {
     var newContact = document.createElement('div');
     newContact.classList.add('contact_div');
     newContact.innerHTML = `<div class="item-avatar">
                                <span>${contactName[i].split(" ").map((n)=>n[0]).join("").toUpperCase()}</span> 
                              </div>
                              <div class="item-name-email">
                                 <div class="contact_name">
                                       ${contactName[i]}
                                 </div>
                                <div  class="contact_email">
                                   ${contactArray[i]}   
                                </div>
                              </div>
                              <div class="invite_btn">
                                 <span>Invite</span>
                              </div>`;
                         LoadingDiv.before(newContact);
     }    
    }
     console.log(hasMore)
   })
  }
   else if(hasMore === false) {
       console.log("disconnect")
       observerI.disconnect();
       LoadingDiv.style.display = "none"
   }
}

observerI = new IntersectionObserver(getnextLink, options);
   let target = document.getElementById("loading")
   //observer target
   observerI.observe(target);
    
}))
.catch((error)=> {
   console.log(error);
 });


 },
]
}

