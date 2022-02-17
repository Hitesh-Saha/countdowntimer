const crypto = require('crypto-js');

class AESEncryptDecrypt {
  constructor(key, iv, text) {
    this.key = key;
    this.iv = iv;
    this.text = text;
  }
  
  encrypt() {
    const encryptedText = crypto.AES.encrypt(this.text, this.key, {iv: this.iv});
    const base64EncodedText = crypto.enc.Base64.stringify(
      crypto.enc.Utf8.parse(encryptedText)
    );
    return base64EncodedText;
  }

  decrypt() {
    const base64DecodedText = crypto.enc.Base64.parse(this.text)
      .toString(crypto.enc.Utf8);
    const decryptedText = crypto.AES.decrypt(base64DecodedText, this.key, {iv: this.iv});
    return decryptedText.toString(crypto.enc.Utf8);
  }
}

module.exports = AESEncryptDecrypt;
