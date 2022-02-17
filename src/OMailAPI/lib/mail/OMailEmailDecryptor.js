const OMailEmailDecryptorUtils = require("./OMailEmailDecryptorUtils");
const OMailMessageObject = require("./OMailMessageObject");

class OMailEmailDecryptor {
  constructor(emailID, accessToken) {
    this.emailID = emailID;
    this.accessToken = accessToken;
  } 

  // TODO: check for to, bcc, cc
  decryptOMailMessage(MessageObject) {
    // decrypt key from the key.om 
    // decrypt body, subject, attachments using that key
    // return the decrypted msg as an object
    const OMailDecryptor = new OMailEmailDecryptorUtils();
    const key = OMailDecryptor.decryptKeyFromAttachment(MessageObject.keyAttachment, this.emailID, this.accessToken);
    const decryptedSubject = OMailDecryptor.decryptSubject(MessageObject.subject);
    const decryptedBody = OMailDecryptor.decryptBody(MessageObject.body);
    // NOTE: check this object and modify accordingly
    const decryptedAttachments = MessageObject.attachments.map(({messageId, name, data}) => {
      let { decryptedFileName, decryptedData } = OMailDecryptor.decryptAttachment({name, data});
      return {
        messageId: messageId,
        name: decryptedFileName,
        data: decryptedData
      };
    });
    const decryptedOMailMessageObject = new OMailMessageObject(
      MessageObject.to, 
      MessageObject.from, 
      MessageObject.cc, 
      MessageObject.bcc, 
      decryptedSubject,
      decryptedBody,
      decryptedAttachments,
      key
    );
    return decryptedOMailMessageObject;
  }
}

module.exports = OMailEmailDecryptor;
