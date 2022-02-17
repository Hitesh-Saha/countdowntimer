const OMailEmailEncryptorUtils = require("./OMailEmailEncryptorUtils");
const OMailMessageObject = require("./OMailMessageObject");
const OMailUserManagementUtility = require("../crypto/OMailUserManagementUtility")
const OMailKeyStoreUtility = require("../crypto/OMailKeyStoreUtility");
const Base64Utils = require("../crypto/Base64Utils");

class OMailEmailEncryptor {
  constructor(emailID, accessToken) {
    this.emailID = emailID;
    this.accessToken = accessToken;
  }

  async parsePublicKeys(email) {
    try {
      const userManager = new OMailUserManagementUtility(email, this.accessToken);
      const isSigned = await userManager.checkUserRegistered();
      if (isSigned) {
        const keyStore = new OMailKeyStoreUtility(email, this.accessToken);
        const publicKey = keyStore.getPublicKey();
        let publicKeyObj = new Object();
        publicKeyObj[email] = publicKey;
        return publicKeyObj;
      } else {
        throw new Error("Error in parsing public keys");
      }
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  async encryptOMailMessage(MessageObject) {
    let keyObj = new Object();
    // checking registered accounts {email: publicKey}
    const toPublicKeys = await MessageObject.to.map(async email => await this.parsePublicKeys(email));
    const ccPublicKeys = await MessageObject.cc.map(async email => await this.parsePublicKeys(email));
    const bccPublicKeys = await MessageObject.bcc.map(async email => await this.parsePublicKeys(email));
    // add to keyObject 
    toPublicKeys.forEach(obj => {
      if (Object.entries(obj)[0] !== undefined) {
        let [key, val] = Object.entries(obj)[0];
        if (key && val) keyObj[key] = val;
      }
    });
    ccPublicKeys.forEach(obj => {
      if (Object.entries(obj)[0] !== undefined) {
        let [key, val] = Object.entries(obj)[0];
        if (key && val) keyObj[key] = val;
      }
    });
    bccPublicKeys.forEach(obj => {
      if (Object.entries(obj)[0] !== undefined) {
        let [key, val] = Object.entries(obj)[0];
        if (key && val) keyObj[key] = val;
      }
    });
    // encryptor for subject, body, attachments
    const OMailEncryptor = new OMailEmailEncryptorUtils(); 
    const encryptedSubject = OMailEncryptor.encryptSubject(MessageObject.subject);
    const encryptedBody = OMailEncryptor.encryptBody(MessageObject.body);
    let encryptedAttachments = await MessageObject.attachments.map(
      ({id, mimeType, filename, content}) => {
        let { encryptedFileName, encryptedContents } = OMailEncryptor.encryptAttachment({filename, content});
        return {
          id: id,
          mimeType: mimeType,
          filename: encryptedFileName,
          content: encryptedContents,
        };
      });
    // add key.om to the attachments
    let encryptedKey = OMailEncryptor.encryptKeyToAttachments(this.emailID, this.accessToken);
    let senderPublicKey = new Object();
    senderPublicKey[this.emailID] = encryptedKey; // { email: publicKey }
    let iv = OMailEncryptor.getIV();
    let [key, val] = Object.entries(senderPublicKey)[0];
    keyObj[key] = val;
    // prepare the key object here
    let keyAttachmentObject = {
      iv: JSON.stringify(iv),
      k: keyObj
    };
    // stringify keyAttachmentObject & convert to base64
    keyAttachmentObject = JSON.stringify(keyAttachmentObject);
    let base64KeyAttachment = btoa(keyAttachmentObject);
    encryptedAttachments.push({
      id: encryptedAttachments.length,
      mimeType: 'application/octet-stream',
      filename: 'key.om',
      content: base64KeyAttachment
    });
    const encryptedOMailMessageObject = new OMailMessageObject(
      MessageObject.to,
      MessageObject.from,
      MessageObject.cc,
      MessageObject.bcc,
      encryptedSubject,
      encryptedBody,
      encryptedAttachments,
    );
    return encryptedOMailMessageObject;
  }
}

module.exports = OMailEmailEncryptor;
