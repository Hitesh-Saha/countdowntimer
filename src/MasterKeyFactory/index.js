let masterkey;
let passphrase;
// var userEmail;
// Office.onReady((info) => {
    //  userEmail=Office.context.mailbox.userProfile.emailAddress  
// });

export default function MasterKey(){
    return [
                async function getMasterKey(userEmail){
                         const cacheStorage   = await caches.open(userEmail+"")
                         const cachedResponse = await cacheStorage.match( '/omailKey' );
                         let response = ""
                         try{
                              response = await cachedResponse.text()
                            }
                         catch { return  ""}
                         return response
                },
                async function setMasterKey(userEmail,masterKey){
                         const cache = await window.caches.open(userEmail+"");
                        //  console.log(getMasterKey(userEmail))
                         const response = new Response(JSON.stringify(masterKey), {
                             status: 200,
                             statusText: "OMail Cache",
                         });
                         cache.put("/omailKey", response) 
                         .then(async() => {
        
                            const cacheStorage   = await caches.open(userEmail+"");
                            const cachedResponse = await cacheStorage.match( '/omailKey' );
                            let response = await cachedResponse.text() 
                            return response                    
                        })
                        .catch(err=>console.log(err));
                },
               async function removeMasterkey(userEmail){
                         await caches.delete(userEmail)
                         .then(function(boolean) {console.log("cache deleted successfully",userEmail);})
                         .catch(err=>console.log(err))
                },
               async function setPassphrase(pass){
                //    console.log(pass)
                //  passphrase=JSON.stringify(pass)
                //  console.log(passphrase);
                    const cache = await window.caches.open("passphrase");
                    const response = new Response((pass), {
                        status: 200,
                        statusText: "Passphrase Cache",
                    });
                    cache.put("/Passphrase", response) 
                  },
                  async function getPassphrase(){
                    const cacheStorage   = await caches.open("passphrase")
                    const cachedResponse = await cacheStorage.match( '/Passphrase' );
                    let response = ""
                    try{
                         response = await cachedResponse.text()
                       }
                    catch { return  ""}
                    return response
                    // console.log(passphrase);
                    // return JSON.parse(passphrase)

                },
                async function removePassphrase(pass=""){
                    // passphrase="";
                     const cache = await window.caches.open("passphrase");
                     const response = new Response((pass), {
                         status: 200,
                         statusText: "Passphrase Cache",
                     });
                     cache.put("/Passphrase", response) 
                   },

    ]
}