import { generateIV, generateSalt, generateSecret, generateUserKey } from '../helpers/OAuthUtils';
import { generatePassphrase, parsePublicKeys, partitionOMailUsers } from '../helpers/OmailMsgUtils';
import { OMailToOMailFlow } from './OmailToOmailFlow';
import { OMailToNonOMailFlow } from './OmailToNonOmailFlow';
import MasterKey from "../../../MasterKeyFactory";
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = MasterKey();
const forge = require('node-forge');

/*
  let msgObj = {
    from: "",
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
    attachments: []
  }

  returns an array of message object which can then be sent to various multiple recipients
*/

export async function SendMailMessage(msgObj, isPassphraseMethod) {
  console.log(msgObj)
  let keyObj = new Object(); 
  let { signedUsersTo, signedUsersCc, signedUsersBcc, unsignedUsersTo, unsignedUsersCc, unsignedUsersBcc } 
  = await partitionOMailUsers(msgObj.to, msgObj.cc, msgObj.bcc);
  let toPublicKeys = [], ccPublicKeys = [], bccPublicKeys = [];

  signedUsersTo.push(msgObj.from)
  for (let i=0; i<signedUsersTo.length; i++) {
    let emailID = signedUsersTo[i];
    let publicKey = await parsePublicKeys(emailID);
    publicKey = publicKey[emailID].KeyRecords[0].ResourceKey;
    let emailKeyObj = new Object();
    emailKeyObj[emailID] = publicKey;
    toPublicKeys.push(emailKeyObj);
  }
  for (let i=0; i<signedUsersCc.length; i++) {
    let emailID = signedUsersCc[i];
    let publicKey = await parsePublicKeys(emailID);
    publicKey = publicKey[emailID].KeyRecords[0].ResourceKey;
    let emailKeyObj = new Object();
    emailKeyObj[emailID] = publicKey;
    ccPublicKeys.push(emailKeyObj);
  }
  for (let i=0; i<signedUsersBcc.length; i++) {
    let emailID = signedUsersBcc[i];
    let publicKey = await parsePublicKeys(emailID);
    publicKey = publicKey[emailID].KeyRecords[0].ResourceKey;
    let emailKeyObj = new Object();
    emailKeyObj[emailID] = publicKey;
    bccPublicKeys.push(emailKeyObj);
  }
  for (let i=0; i<toPublicKeys.length; i++) {
    let obj = toPublicKeys[i];
    if (Object.entries(obj)[0] !== undefined) {
      let [key, val] = Object.entries(obj)[0];
      if (key && val) keyObj[key] = val;
    }
  }
  for (let i=0; i<ccPublicKeys.length; i++) {
    let obj = ccPublicKeys[i];
    if (Object.entries(obj)[0] !== undefined) {
      let [key, val] = Object.entries(obj)[0];
      if (key && val) keyObj[key] = val;
    }
  }
  for (let i=0; i<bccPublicKeys.length; i++) {
    let obj = bccPublicKeys[i];
    if (Object.entries(obj)[0] !== undefined) {
      let [key, val] = Object.entries(obj)[0];
      if (key && val) keyObj[key] = val;
    }
  }

  let passphrase = generatePassphrase();
  await setPassphrase(passphrase)
  let {salt, saltArray} = await generateSalt();
  let secret = await generateSecret();
  let {userKey, userKeyBase64} = await generateUserKey(secret, salt);
  let {iv, ivBase64} = await generateIV();
  console.log(msgObj.attachments);

  if (signedUsersTo.length > 0) {
    console.log("Omail2Omail")
    var Omail2OmailMsgObj= await OMailToOMailFlow(
      msgObj.from, signedUsersTo, signedUsersCc, signedUsersBcc,
      toPublicKeys, ccPublicKeys, bccPublicKeys, salt, secret,
      userKey, iv, msgObj.subject, msgObj.body, msgObj.attachments, keyObj
    );}
  if (unsignedUsersTo.length > 0) {
    console.log("Omail2NonOmail")
    var Omail2NonOmailMsgObj=await OMailToNonOMailFlow(
      msgObj.from, unsignedUsersTo, unsignedUsersCc, unsignedUsersBcc,
      passphrase, salt, secret, userKey, iv, msgObj.subject, msgObj.body,
      msgObj.attachments, isPassphraseMethod
    );
  }
  return {
    Omail2Omail:Omail2OmailMsgObj,Omail2NonOmail:Omail2NonOmailMsgObj
  }
}