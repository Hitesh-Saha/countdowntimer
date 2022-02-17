const forge = require('node-forge');

class RSAEncryptDecrypt {
  constructor(publicKey, privateKey, text) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.text = text;
  }

  encrypt() {
    const plainTextBytes = forge.util.encodeUtf8(text);
    const encryptedText = forge.pki.publicKeyFromPem(this.publicKey)
      .encrypt(plainTextBytes);
    const base64EncodedText = forge.util.encode64(encryptedText);
    return base64EncodedText;
  }

  decrypt() {
    const base64DecodedText = forge.util.decode64(text);
    const decryptedText = forge.pki.privateKeyFromPem(this.privateKey)
      .decrypt(base64DecodedText);
    return forge.util.decodeUtf8(decryptedText);
  }
}

module.exports = RSAEncryptDecrypt;
