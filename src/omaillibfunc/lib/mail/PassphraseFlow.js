import { AESEncrypt, AESEncryptAttachment } from "../crypto/AES";
import NonOMailMsg from "../helpers/OmailMsgUtils";
const forge = require("node-forge");
const jszip = require('jszip');
//import addPassPhrase from "../../../vaultUtils/passphraseUtils/addPassPhrase";

export async function PassphraseMethod(from, unsignedUsersTo, unsignedUsersCc, unsignedUsersBcc, passphrase, salt, secret,
  userKey, iv, subject, body, attachments, isPassphraseMethod) {
    
    // let msg_id=Math.floor(Math.random()*100000) 
    // console.log(from,to,subject,msg_id,passphrase)
  //addPassPhrase()
  /* encrypt actual subject, body & attachments */
  const encryptedSubject = await AESEncrypt(userKey, iv, subject);
  const encryptedBody = await AESEncrypt(userKey, iv, body);
  let id = -1;
  let encryptedAttachments = [];
  attachments.forEach(async ({ uri, type, name, size}) => {
    let {encryptedFilename, encryptedContent} = await AESEncryptAttachment(userKey, iv, {uri, type, name, size});
    id = id + 1;
    let encryptedFileObj = { id: id, mimeType: type, filename: encryptedFilename, content: encryptedContent };
    encryptedAttachments.push(encryptedFileObj);
  });

  /* create new template subject & body that is to be sent */
  subject = "OMail Encrypted";
  iv = forge.util.encode64(iv);
   iv=forge.util.decode64(iv)
  let messageObjectArray = [];
  for (let i=0; i<unsignedUsersTo.length; i++) {
    salt = "";
    let masterKey = forge.pkcs5.pbkdf2(passphrase, salt, 1000, 32); // remove salt
   
    const encryptedKey = await AESEncrypt(masterKey, iv, userKey); 
    console.log("How to send attachment during non passphrase? Name of key on server");
    let keyAttachmentObj = JSON.stringify({
      to: unsignedUsersTo[i],
      from: from,
      cc: unsignedUsersCc,
      bcc: unsignedUsersBcc,
      body: encryptedBody,
      subject: encryptedSubject,
     
      attachment:encryptedAttachments,
      key: encryptedKey,
      iv: forge.util.encode64(iv),
      date: new Date().toDateString()
    })

    id = id + 1;
    // generate zip file
    const zip = new jszip();
    zip.file("body.txt", keyAttachmentObj);
    let generatedZip =  await zip.generateAsync({type: "base64"});
    const timestamp = Date.parse(new Date());

    // add to attachments
    let keyAttachment = [...encryptedAttachments];
    keyAttachment.push({
      id: id,
      mimeType: 'application/zip;base64',
      // filename: 'encryptedMail.zip',
      filename: `encryptedMail_${timestamp}.zip`,
      content: generatedZip
    });
    // prepare object and mime message
    let messageObject = new Object();
    messageObject.to = [unsignedUsersTo[i]];
    messageObject.from = from;
    messageObject.cc = unsignedUsersCc;
    messageObject.bcc = unsignedUsersBcc;
    messageObject.subject = subject;
    body = await NonOMailMsg(unsignedUsersTo[i]);
    // messageObject.subject = `${timestamp}`
    // body = PassphraseFlowMsg();
    messageObject.body = body;
    messageObject.attachments = keyAttachment;
    messageObjectArray.push(messageObject);
  }
  return messageObjectArray;
}
