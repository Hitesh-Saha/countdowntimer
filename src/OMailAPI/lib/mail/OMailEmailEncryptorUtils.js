//const { OMailMessageObject } = require("./OMailMessageObject");
const OMailKeyIVGenerator = require("../crypto/OMailKeyIVGenerator");
const OMailEncryptUtils = require("../crypto/OMailEncryptUtils");
const OMailKeyStoreUtility = require("../crypto/OMailKeyStoreUtility");
const AESEncryptDecrypt = require("../crypto/AESEncryptDecrypt")
const RSAEncryptDecrypt = require("../crypto/RSAEncryptDecrypt");

class OMailEmailEncryptorUtils {
  constructor() {
    const keyIVGenerator = new OMailKeyIVGenerator();
    this.iv = keyIVGenerator.generateIV();
    this.salt = new OMailEncryptUtils().generateSalt();
    this.key = keyIVGenerator.generateUserKey(this.salt);
  }

  getIV() {
    return this.iv;
  }
  
  encryptSubject(subject) {
    try {
      const AESEncryptor = new AESEncryptDecrypt(this.key, this.iv, subject);
      const encryptedSubject = AESEncryptor.encrypt();
      return encryptedSubject;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  encryptBody(body) {
    try {
      const AESEncryptor = new AESEncryptDecrypt(this.key, this.iv, body);
      const encryptedBody = AESEncryptor.encrypt();
      return encryptedBody;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  
  /* NOTE: single attachment is to be passed here */
  encryptAttachment({filename, content}) {
    let reader = new FileReader();
    let encryptedFileName, encryptedContents;
    reader.onload = async (file) => {
      const AESEncryptor = new AESEncryptDecrypt(this.key, this.iv, file.target.result.split(",")[1]);
      encryptedContents = AESEncryptor.encrypt();
    }
    reader.readAsDataURL(content);
    const AESFileNameEncryptor = new AESEncryptDecrypt(this.key, this.iv, filename);
    encryptedFileName = AESFileNameEncryptor.encrypt();
    return {
      encryptedFileName, 
      encryptedContents
    }
  }

  encryptKeyToAttachments(emailID, accessToken) {
    // check to, cc, bcc for Omail users
    // fetch their public keys which is to be added to key.om

    const keyStore = new OMailKeyStoreUtility(emailID, accessToken);
    const publicKey = keyStore.getPublicKey();
    const RSAEncryptor = new RSAEncryptDecrypt(publicKey, "", this.key);
    const encryptedKey = RSAEncryptor.encrypt();
    return encryptedKey;
  }
}

module.exports = OMailEmailEncryptorUtils;
