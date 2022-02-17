const OMailKeyStoreUtility = require("../crypto/OMailKeyStoreUtility")
const AESEncryptDecrypt = require("../crypto/AESEncryptDecrypt")

class OMailEmailDecryptorUtils {
  constructor() {
    this.key = "";
    this.iv = "";
  }

  decryptSubject(encryptedSubject) {
    const AESDecryptor = new AESEncryptDecrypt(this.key, this.iv, encryptedSubject); 
    const decryptedSubject = AESDecryptor.decrypt();
    return decryptedSubject;
  }

  decryptBody(encryptedBody) {
    encryptedBody = encryptedBody.replace(/-/g, "+").replace(/_/g, "/").trim()
    const AESDecryptor = new AESEncryptDecrypt(this.key, this.iv, encryptedBody); 
    const decryptedBody = AESDecryptor.decrypt();
    return decryptedBody;
  }

  decryptAttachment({name, data}) {
    let AESDecryptor = new AESEncryptDecrypt(this.key, this.iv, name);
    const decryptedFileName = AESDecryptor.decrypt();
    data = data.replace(/-/g, "+").replace(/_/g, "/");
    AESDecryptor = new AESEncryptDecrypt(this.key, this.iv, data);
    const decryptedData = AESDecryptor.decrypt();
    const decryptedDataURL = `data:application/octet-stream;base64,${decryptedData}`;
    return {
      decryptedFileName: decryptedFileName,
      decryptedData: decryptedDataURL
    };
  }

  async decryptKeyFromAttachment(attachmentText, emailID, accessToken) {
    const attachmentData = JSON.parse(attachmentText).data;
    const keyStruct = JSON.parse(atob(attachmentData.replace("-", "+").replace("_", "/")));
    const iv = JSON.stringify(keyStruct.iv);
    const keyStore = new OMailKeyStoreUtility(emailID, accessToken);
    // decrypt user key with public key
    // decrypt private key with user Key
    const privateKey = await keyStore.getUserPrivateKey();
    const key = await keyStore.getMessageKey(privateKey, keyStore);
    this.iv = iv;
    this.key = key;
    return key;
  }
}

module.exports = OMailEmailDecryptorUtils;
