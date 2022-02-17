const { OMAIL_GET_SALT, OMAIL_KEYSTORE, OMAIL_USER_MANAGEMENT } = require("../helpers/urls");
const OMailSessionUtility = require("./OMailSessionUtility");
const OMailUserManagementUtility = require("./OMailUserManagementUtility");
const AESEncryptDecrypt = require("./AESEncryptDecrypt");
const RSAEncryptDecrypt = require("./RSAEncryptDecrypt");

class OMailKeyStoreUtility {
  constructor(emailID, accessToken) {
    this.emailID = emailID;
    this.accessToken = accessToken;
  }

  async storeUserSaltDigest(salt, digest) {
    try {
      let saltArray = Array.from(new TextEncoder().encode(JSON.stringify(salt)));
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      let response = await fetch(OMAIL_USER_MANAGEMENT, {
        method: "POST",
        body: JSON.stringify({
          ID: this.emailID,
          Salt: saltArray,
          Digest: digest
        }),
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in submitting User salt & digest");
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserSalt() {
  //   try {
  //     let url = `https://user.vault.ziroh.com/api/v1/org/user/salt/org1/${this.emailID}`;
  //     let response = await fetch(url, { method: 'GET' });
  //     let salt = await response.json();
  //     return salt.userData1.salt;
  //   } catch (err) {
  //     console.log("Failed to get user salt;", err);
  //   }
  // }
    try {
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      let url = `${OMAIL_GET_SALT}/${this.emailID}` ;
      let response = await fetch(url, {
        method: "GET",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in fetching User salt");
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  async getFheKey() {
    try {
      const SessionUtility = new OMailSessionUtility(this.emailID);
      const session = await SessionUtility.getSession(); 
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      headers.append("SessionId", session);
      headers.append("UserId", this.emailID);
      let url = `${OMAIL_KEYSTORE}/resource/fhekey_${this.emailID}`;
      let response = await fetch(url, {
        method: "GET",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in fetching User's FHE Key");
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserKey() {
    try {
      const SessionUtility = new OMailSessionUtility(this.emailID);
      const session = await SessionUtility.getSession(); 
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      headers.append("SessionId", session);
      headers.append("UserId", this.emailID);
      let url = `${OMAIL_KEYSTORE}/resource/userKey_${this.emailID}`;
      let response = await fetch(url, {
        method: "GET",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in fetching User's Public Key");
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getPublicKey() {
    try {
      const SessionUtility = new OMailSessionUtility(this.emailID);
      const session = await SessionUtility.getSession(); 
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      headers.append("SessionId", session);
      headers.append("UserId", this.emailID);
      let url = `${OMAIL_KEYSTORE}/resource/publicKey_${this.emailID}`;
      let response = await fetch(url, {
        method: "GET",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in fetching User's Public Key");
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getPrivateKey() {
    try {
      const SessionUtility = new OMailSessionUtility(this.emailID);
      const session = await SessionUtility.getSession(); 
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      headers.append("SessionId", session);
      headers.append("UserId", this.emailID);
      let url = `${OMAIL_KEYSTORE}/resource/privateKey_${this.emailID}`;
      let response = await fetch(url, {
        method: "GET",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in fetching User's Public Key");
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // this requires to be fetched from a cache, how ??
  async getMasterKey(email) {
    const cacheStorage   = await caches.open(this.emailID+"")
                         const cachedResponse = await cacheStorage.match( '/omailKey' );
                         let response = ""
                         try{
                              response = await cachedResponse.text()
                            }
                         catch { return  null}
                         return response
    // try {
    //   const cache = await caches.open("omail_cache");
    //   const response = await cache.match("/omKey");
    //   const responseText = await response.text();
    //   return JSON.parse(responseText);
    // } catch (err) {
    //   console.error(err);
    //   return null;
    // }
  }

  async getUserPrivateKey() {
    try {
      const OMailUserManager = new OMailUserManagementUtility(this.emailID, this.accessToken);
      const checkUserRegistered = await OMailUserManager.checkUserRegistered();
      if (checkUserRegistered) {
        let userKey = await this.getUserKey().KeyRecords[0].ResourceKey;
        const privateKey = await this.getPrivateKey().KeyRecords[0].ResourceKey;
        let iv = await this.getUserKey().KeyRecords[0].SymKeyIV;
        iv = JSON.parse(iv);
        const masterKey = await this.getMasterKey(this.emailID);
        let AESDecryptor = new AESEncryptDecrypt(masterKey, iv, userKey); 
        userKey = AESDecryptor.decrypt();
        userKey = JSON.parse(userKey);
        AESDecryptor = new AESEncryptDecrypt(userKey, iv, privateKey);
        return AESDecryptor.decrypt();
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getMessageKey(privateKey, keyStruct) {
    try {
      const key = keyStruct[this.emailID];
      const RSADecryptor = new RSAEncryptDecrypt(privateKey, key);
      const decryptedKey = RSADecryptor.decrypt();
      return JSON.parse(decryptedKey);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = OMailKeyStoreUtility;
