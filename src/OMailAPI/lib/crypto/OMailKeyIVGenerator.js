const crypto = require("crypto-js");
const cryptoNode = require("crypto");
const str = require("@supercharge/strings");
const Base64Utils = require("./Base64Utils");
const forge = require('node-forge');
const AESEncryptDecrypt = require('./AESEncryptDecrypt');

class OMailKeyIVGenerator {
  constructor(emailID, password, salt) {
    this.iv = "";
    this.userKey = "";
    this.masterKey = "";
    this.publicKey = "";
    this.privateKey = "";
    this.fheKey = "";
    this.encryptedPublicKey = "";
    this.encryptedPrivateKey = "";
    this.encryptedFHEKey = "";
    this.emailID = emailID;
    this.password = password;
    this.salt = salt;
  } 

  generateIV() {
    this.iv = crypto.lib.WordArray.random(128/8);
    return this.iv;
  }

  generateUserKey() {
    let secret;
    if (cryptoNode.randomBytes) secret = str.random(2048);
    else secret = new Base64Utils().encodeUint8Array(
      window.crypto.getRandomValues(new Uint8Array(2048))
    );
    this.userKey = crypto.PBKDF2(secret, this.salt, {
      keySize: 256/32,
      iterations: 1000
    });
    return this.userKey;
  }

  generateMasterKey() {
    this.masterKey = crypto.PBKDF2(this.password+this.emailID, this.salt, {
      keySize: 256/32,
      iterations: 1000
    });
    return this.masterKey;
  }

  generateRSAKeyPair() {
    return new Promise((res, rej) => {
      forge.pki.rsa.generateKeyPair({bits: 2048, workers: 2},
        (err, keyPair) => {
          if (err) reject(err);
          else {
            this.privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
            this.publicKey = forge.pki.publicKeyToRSAPublicKeyPem(keyPair.publicKey);
            res({
              privateKey: this.privateKey,
              publicKey: this.publicKey
            })
          }
        })
    })
  }

  // TODO: find logic
  generateFHEKey() {

  }
  
  // encrypt Keys using RSA return RSAEncryptDecrypt().encrypt(publicKey, key)
  encryptKeys(key, iv, plainkey) {
    const AESEncryptor = new AESEncryptDecrypt(key, iv, plainkey);
    const encryptedKey = AESEncryptor.encrypt();
    return encryptedKey;
  }
}

module.exports = OMailKeyIVGenerator;
