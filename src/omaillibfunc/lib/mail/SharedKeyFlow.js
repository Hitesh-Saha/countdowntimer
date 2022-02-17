import { AESEncrypt, AESEncryptAttachment } from "../crypto/AES";
import { getPublicKey } from "../crypto/keystore";
import { RSAEncrypt } from "../crypto/RSA";
import NonOMailMsg, { setListener, setTempKeys } from "../helpers/OmailMsgUtils";
const accessToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
const forge = require("node-forge");
const jszip = require('jszip');

export async function SharedKeyMethod(
  from, unsignedUsersTo, unsignedUsersCc, unsignedUsersBcc, passphrase, salt, secret,
      userKey, iv, subject, body, attachments, ispassphrasemethod) {

  /* encrypt actual subject, body & attachments */
  const encryptedSubject = await AESEncrypt(userKey, iv, subject);
  const encryptedBody = await AESEncrypt(userKey, iv, body);
  let id = -1;
  let encryptedAttachments = [];
  attachments.forEach(async ({ uri, type, name, size}) => {
    let {encryptedFilename, encryptedContent} = await AESEncrypt(userKey, iv, {uri, type, name, size});
    id = id + 1;
    let encryptedFileObj = { id: id, mimeType: type, filename: encryptedFilename, content: encryptedContent };
    encryptedAttachments.push(encryptedFileObj);
  });
  /*  Encrypt passphrase with public key */
  let publicKey = await getPublicKey(from, accessToken);
  publicKey = publicKey.KeyRecords[0].ResourceKey;
  const encryptedPassphrase = await RSAEncrypt(publicKey, passphrase);

  let messageObjectArray = [];
  /* Check if user is registered, else set listener */
  for (let i=0; i<unsignedUsersTo.length; i++) {
    const timestamp = Date.parse(new Date());
    let setTempKey = await setTempKeys(from, unsignedUsersTo[i],
      //  encryptedPassphrase
      `${encryptedPassphrase}_${timestamp}`
       );
    let setListener1 = await setListener(from, unsignedUsersTo[i]);
    let masterKey = forge.pkcs5.pbkdf2(passphrase, "", 1000, 32);
    let encryptedKey = await AESEncrypt(masterKey, iv, userKey);
    let keyAttachmentObj = JSON.stringify({
      to: unsignedUsersTo[i],
      from: from, 
      cc: unsignedUsersCc,
      bcc: unsignedUsersBcc,
      body: encryptedBody,
      subject: encryptedSubject,
      key: encryptedKey,
      iv: JSON.stringify(iv),
      date: new Date().toDateString()
    })
    id = id + 1;
    const zip = new jszip();
    zip.file("body.txt", keyAttachmentObj);
    let generatedZip = await zip.generateAsync({ type: "base64"});
    let keyAttachment = [...encryptedAttachments];
    keyAttachment.push({
      id: id,
      mimeType: "application/zip;base64",
      // filename: "encryptedMail.zip",
      filename: `encryptedMail_${timestamp}.zip`,
      content: generatedZip
    });
    let messageObject = new Object();
    messageObject.to  = [unsignedUsersTo[i]];
    messageObject.from = from;
    messageObject.cc = unsignedUsersCc;
    messageObject.bcc = unsignedUsersBcc;
    messageObject.subject = subject;
    body = await NonOMailMsg(unsignedUsersTo[i]);
    // messageObject.subject = `${timestamp}`
    //     body = SharedKeyFlowMsg();
    messageObject.body = body;
    messageObject.attachments = keyAttachment;
    messageObjectArray.push(messageObject);
  }
  return messageObjectArray;
}