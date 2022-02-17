/*
  msgObject in this case, will be Message Object of GMAIL API
*/
/* getting the private key in server, which will be used in RSA decryption */
const forge=require('node-forge')
const accessToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
import { AESDecrypt } from '../crypto/AES';
import { getMasterKey, getPrivateKey, getUserKey } from '../crypto/keystore';
import { RSADecrypt } from '../crypto/RSA';
let UserEmail=Office

async function getUserPrivateKey(email) {
  // if items not in async storage, do api call
  let userKey, iv, privateKey;
  userKey = await getUserKey(email,accessToken)
  iv=userKey;
  userKey=userKey.KeyRecords[0].ResourceKey;
  iv=iv.KeyRecords[0].SymKeyIV;
  privateKey = await getPrivateKey(email,accessToken)
  privateKey=privateKey.KeyRecords[0].ResourceKey
  let masterKey = await getMasterKey(email);
 // console.log("MasterKey",masterKey)

  masterKey =forge.util.decode64(masterKey);
  //console.log("IV",iv)
  iv = forge.util.decode64(iv);

  // console.log("MasterKEy "+(masterKey))
  // console.log("IV "+ iv)
  // console.log("UK "+userKey)
  // console.log("PK "+privateKey)
  let decryptedUserKey = await AESDecrypt(masterKey, (iv), userKey);
  decryptedUserKey = forge.util.decode64(decryptedUserKey);
  let decryptedPrivateKey = await AESDecrypt(decryptedUserKey, iv, privateKey);
  return decryptedPrivateKey;
}


/* RSA decryption of the key in msg using private key */
async function getMessageKey(privateKey, publicKey) { 
  let decryptedPublicKey = await RSADecrypt(privateKey, publicKey);
  //console.log("Msg key", decryptedPublicKey);
  return decryptedPublicKey;
}

export async function decryptMessage(msg) {
  let msgObj = {
    id: msg.id,
    attachments: []
  }
  
    msgObj.subject = msg.subject;
    msgObj.to = msg.to;
     msgObj.from = msg.from;
     msgObj.date = msg.dateTime;
     
  
  msg.attachment.forEach(item => {
   msgObj.body = msg.body;
   if (item.filename !== "" && item.filename !== "key.om") 
   {
      let fileObj = new Object();
      fileObj.filename = msg.filename;
      fileObj.mimeType = msg.mimeType;
      fileObj.attachmentId = msg.id;
      msgObj.attachments.push(fileObj);
      // fileObj.size = item.body.size;
    }
  })
  let keyAttachment = [];
  let attachments = [];
  let attachmentData,attachmentId;
  for(let i=0;i<msg.attachment.length;i++){
   let item=msg.attachment[i]
   if (item.filename === "key.om") {
      attachmentId = item.id;
     attachmentData = item.content;
      const receiver=msg.user
      console.log(receiver);
      let keystruct = JSON.parse(atob(attachmentData.replace("-", "+").replace("_", "/")));
     let iv = JSON.stringify(keystruct.iv);
      iv = forge.util.decode64(iv);
      let privateKey = await getUserPrivateKey(receiver);
      let publicKey = await getMessageKey(privateKey, (keystruct.k[receiver])); // use this for decryption
   
      console.log("Decrytion jugad")
      // if(receiver===msg.fromemail){
      // publicKey = forge.util.decode64(publicKey);
      // }
      // publicKey = forge.util.decode64(publicKey)
      publicKey = forge.util.decode64(publicKey)
      //  console.log(publicKey)
      //  console.log(iv)

      let decryptedSubject = await AESDecrypt(publicKey, iv, msg.subject);
      //console.log("Subject",decryptedSubject);
      msgObj.subject = decryptedSubject;
      let bodydecoded=forge.util.decode64(msg.body)
      let decryptedBody = await AESDecrypt(publicKey, iv, msg.body);
      msgObj.body = decryptedBody;
       //console.log("Body",decryptedBody)
      for (let j=0; j<msg.attachment.length; j++) {
        if(msg.attachment[j].filename!=='key.om'){
        let encryptedFileName = msg.attachment[j].filename;
        let decryptedFileName = await AESDecrypt(publicKey, iv, encryptedFileName); // decrypt attachment content
        //let attachmentBody = msgObj.body
        // let attachmentData = attachmentBody.data;
        //console.log(msg)
        let encryptedContent = msg.attachment[j].content.replace(/-/g, "+").replace(/_/g, "/").trim();
        let decryptedContent = await AESDecrypt(publicKey, iv, encryptedContent);
        msgObj.attachments[j].filename = decryptedFileName;
        msgObj.attachments[j].content = decryptedContent;
        msgObj.attachments[j].size=msg.attachment[j].size
        msgObj.attachments[j].mimeType=msg.attachment[j].mimeType
        msgObj.attachments[j].id=msg.attachment[j].id
        } 
      }
      break;
    
    }
   
  } 
  //console.log(msgObj)
  // for (let i=0; i<msg.payload.parts.length; i++) {
  //   let item = msg.payload.parts[i];
  //   if (item.filename === "key.om") {
  //     let attachmentId = item.body.attachmentId;
  //     let attachmentBody = await getAttachmentData(msgObj.id, attachmentId);
  //     let attachmentData = attachmentBody.data;
  //     let keystruct = JSON.parse(atob(attachmentData.replace("-", "+").replace("_", "/")));
  //     iv = JSON.stringify(keystruct.iv);
  //     iv = forge.util.decode64(iv);
  //     let privateKey = await getUserPrivateKey(receiver);
  //     publicKey = await getMessageKey(privateKey, (keystruct.k[receiver])); // use this for decryption
  //     publicKey = forge.util.decode64(publicKey);
  //     let decryptedSubject = await AESDecrypt(publicKey, iv, msgObj.subject.split(':')[1]);
  //     msgObj.subject = decryptedSubject;
  //     let decryptedBody = await AESDecrypt(publicKey, iv, forge.util.decode64(msgObj.body));
  //     msgObj.body = decryptedBody;
  //     for (let j=0; j<msgObj.attachments.length; j++) {
  //       let encryptedFileName = msgObj.attachments[j].filename;
  //       let decryptedFileName = await AESDecrypt(publicKey, iv, encryptedFileName);

  //       // decrypt attachment content
  //       let attachmentBody = await getAttachmentData(msgObj.id, msgObj.attachments[j].attachmentId);
  //       let attachmentData = attachmentBody.data;
  //       let encryptedContent = attachmentData.replace(/-/g, "+").replace(/_/g, "/").trim();
  //       let decryptedContent = await AESDecrypt(publicKey, iv, encryptedContent);

  //       msgObj.attachments[j].filename = decryptedFileName;
  //       msgObj.attachments[j].content = decryptedContent;
  //     }
  //     break;
  //   }

  return msgObj;
}