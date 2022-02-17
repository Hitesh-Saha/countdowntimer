import { AESEncrypt, AESEncryptAttachment } from '../crypto/AES';
import { RSAEncrypt } from '../crypto/RSA';
import {  parsePublicKeys } from '../helpers/OmailMsgUtils';

const forge = require('node-forge');

async function encryptMessage(userKey, iv, subject, body, attachments) {
  /// encryption of subject, body, attachments
  try {
    const encryptedSubject = await AESEncrypt(userKey, iv, subject);
    const encryptedBody = await AESEncrypt(userKey, iv, body);
    let id = -1;
    let encryptedAttachments = [];
    if(attachments.length>0)
    {
      attachments.forEach(async ({id, mimeType, filename, content}) => {
      let encryptedContent = await AESEncrypt(userKey, iv, content);
      let encryptedFilename = await AESEncrypt(userKey, iv, filename);
      id = id + 1;
      let encryptedFileObj = { id, mimeType, filename: encryptedFilename, content: encryptedContent};
      encryptedAttachments.push(encryptedFileObj);
    })}
    return { encryptedSubject, encryptedBody, encryptedAttachments, id };
  } catch (err) {
    console.log("Error in encrypting plain message");
    return false;
  }
}

async function encryptMsgKey(keyObj, messageKey) {
  console.log(keyObj)
  try { 
    messageKey = forge.util.encode64(messageKey);
    for (let email in keyObj) {
      let publicKey = keyObj[email];
      const encryptedMsgKey = await RSAEncrypt(publicKey, messageKey);
      keyObj[email] = encryptedMsgKey;
    }
    return keyObj;
  } catch (err) {
    console.log("Error in encrypting message key");
    return false;
  }
}

async function createDraft(mime, accessToken) {
  try {
    const body = JSON.stringify({
      message: { raw: mime }
    });
    //const url = "https://gmail.clients6.google.com/gmail/v1/users/me/drafts?alt=json";
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/drafts?alt=json`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: body
    });
    const responseJSON = await response.json();
    if (response.ok) return responseJSON.id;
  } catch (err) {
    console.log("Error in creating draft");
    return false;
  }
}

async function sendDraft(msgId, accessToken) {
  try {
    let url = "https://gmail.googleapis.com/gmail/v1/users/me/drafts/send?alt=json"
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
      body: JSON.stringify({ id: msgId })
    });
    let responseJSON = await response.json();
    return responseJSON.id;
  } catch (err) {
    console.log("Error in sending draft");
    return false;
  }
}

export async function OMailToOMailFlow(from, to, bcc, cc, toPublicKeys, ccPublicKeys, bccPublicKeys, salt, 
  secret, userKey, iv, subject, body, attachments, keyObj, sendMsg) {
 
  let { encryptedSubject, encryptedBody, encryptedAttachments, id } = await encryptMessage(userKey, iv, subject, body, attachments);
  keyObj = await encryptMsgKey(keyObj, userKey);
  console.log(keyObj);
  iv = forge.util.encode64(iv);
  let keyAttachmentObj = await btoa(JSON.stringify({ iv: iv, k: keyObj }));
  id = id + 1;
  encryptedAttachments.push({
    id: id, mimeType: "application/octet-stream",
    filename: "key.om", content: keyAttachmentObj
  });
  let messageObject; let emailID=[];
   to.pop(from)
  for (let i=0; i<to.length; i++) {
    emailID.push(to[i]);
     messageObject = {
      to: emailID,
      from: from,
      cc: cc,
      bcc: bcc,
      subject: encryptedSubject,
      body: encryptedBody,
      attachments: encryptedAttachments
    }
  
    // let mimeMessage = await createMimeMessage(messageObject);
    // const accessToken = await AsyncStorage.getItem("GoogleOAuthAccessToken");
    // const draftMsgId = await createDraft(mimeMessage, accessToken);
    // if (sendMsg) var msgId = await sendDraft(draftMsgId, accessToken);
    // let indexing = await indexMessageData(
    //   msgId, { subject: subject, body: body }, 
    //   messageObject.from
    // );
    // console.log("Indexing success", indexing);
  }
  return messageObject;
}