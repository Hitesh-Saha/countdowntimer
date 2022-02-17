const { OMAIL_SEND_OTP, OMAIL_VERIFY_OTP, OMAIL_SESSIONS, OMAIL_KEYSTORE, OMAIL_USER_MANAGEMENT } = require("../helpers/urls");
const OMailEncryptUtils = require("../crypto/OMailEncryptUtils");
const OMailKeyIVGenerator = require("../crypto/OMailKeyIVGenerator");
const OMailKeyStoreUtility = require("../crypto/OMailKeyStoreUtility");
const { default: OMailCrypto } = require("../../../OMailLib/keyGenUtils/cryptoInit");
var forge=require('node-forge')
class OMailAuthController {
  constructor(emailID, password, confirmPassword, OTP, accessToken) {
    this.emailID = emailID;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.OTP = OTP;
    this.accessToken = accessToken;
  }
async sendOtpToMail() {
    try {
      let url = `${OMAIL_SEND_OTP}/${this.emailID}`;
      let response = await fetch(url, {
        method: "POST",
        redirect: "follow"
      });
      if (!response) throw new Error("Failed to send OTP");
      let responseJson = response.json();
      console.log(responseJson);
      return true;
    } catch (err) {
      console.error("[SEND_OTP]:", err);
      return false;
    }
  }

  async verifyUserOtp() {
    try {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      let body = JSON.stringify({ email: this.emailID, otp: this.OTP });
      let url = `${OMAIL_VERIFY_OTP}`;
      let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow"
      });
      if (!response) throw new Error("Failed to verify OTP");
      let responseJson = await response.json();
      console.log(responseJson);
      return true;
    } catch (err) {
      console.error("[VERIFY_OTP]:", err);
      return false;
    }
  }
  async storeKeys(key, keyType, headers, body) {
    try {
      body.Uniqueid = `${keyType}_${this.emailID}`;
      body.ResourceKey = key;
      body.KeyDescription = keyType;
      body.ResourceId = keyType;
      let url = `${OMAIL_KEYSTORE}/resource`;
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
        redirect: "follow"
      });
      if (!response) throw new Error("Error in storing keys to keystore");
      const responseText = await response.text();
      console.log(responseText);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async signUpHandler(registered=false) {
    // salt & digest generated and stored
    const EncryptionUtility = new OMailEncryptUtils(this.emailID, this.password);
    const salt = EncryptionUtility.generateSalt();
    const digest = EncryptionUtility.generateSHA256Digest();
    // keys generated using salt
    const KeyIVGenerator = new OMailKeyIVGenerator(this.emailID, this.password, salt);
    let iv = KeyIVGenerator.generateIV();
    let userKey = KeyIVGenerator.generateUserKey();
    let masterKey = KeyIVGenerator.generateMasterKey();
    let {publicKey, privateKey} = await KeyIVGenerator.generateRSAKeyPair();
    // keys are encrypted
    let encryptedPrivateKey = new KeyIVGenerator.encryptKeys(userKey, iv, privateKey);
    let encryptedUserKey = new KeyIVGenerator.encryptKeys(masterKey, iv, userKey);
    // TODO: what about fhe key ?
    // Store user details
    if (registered) this.emailID = "registered_" + this.emailID;
    // get the session
    let url = `${OMAIL_SESSIONS}/${this.emailID}`;
    let response = await fetch(OMAIL);
    let responseText = await response.json();
    const sessionToken = JSON.parse(responseText).Token;
    let headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", `Bearer ${this.accessToken}`); // NOTE: where did this come from ?
    headers.append("SessionId", sessionToken);
    headers.append("UserId", this.emailID);
    let body = {
      Uniqueid: "",
      UserId: this.emailID,
      ResourceKey: "",
      SymKeyIV: iv,
      KeyDescription: "",
      GeneratedOn: Math.floor(new Date()/1000),
      KeyStatus: "valid",
      ExpiryDate: 0,
      ResourceId: "",
    };
    // Make post requests to store keys
    this.storeKeys(encryptedUserKey, "userKey", headers, body);
    this.storeKeys(encryptedPrivateKey, "privateKey", headers, body);
    this.storeKeys(publicKey, "publicKey", headers, body);
  }

  async signInHandler() {
    try {
      const EncryptionUtility = new OMailEncryptUtils(this.emailID, this.password);
      const KeyStoreUtility = new OMailKeyStoreUtility(this.emailID, this.accessToken);
      const salt = await KeyStoreUtility.getUserSalt();
      // const digest = Array.from(
      //   new TextEncoder().encode(
      //     JSON.stringify(OMailCrypto.SHA256(this.password + this.emailID.trim()))
      //   )
      // );
      let digest = forge.md.sha256.create();
      digest.update(this.emailID + this.password);
      let digestData = digest.digest();
      let digestArray = new Uint8Array(digestData.length());
      for (let i = 0; i <= digestData.length(); i++)
        digestArray[i] = digestData.at(i);
      digestArray = Array.from(digestArray);
     let salt1 = forge.random.getBytesSync(128 / 8);
      let saltBuffer = forge.util.createBuffer(salt1);
      let saltArray = new Uint8Array(saltBuffer.length());
      for (let i = 0; i < saltBuffer.length(); i++)
        saltArray[i] = saltBuffer.at(i);
      saltArray = Array.from(saltArray);

      var myHeaders = new Headers();
         myHeaders.append("Authorization", "Bearer ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3");
          myHeaders.append("Content-Type", "application/json");
         var raw = JSON.stringify({
             "Digest":digestArray,
             "ID": this.emailID.trim(),
             "Salt": saltArray
});
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
const response = await fetch("https://keys.vault.ziroh.com/UserManagement/Users/User/authenticate", requestOptions)
  if (!response) throw new Error("Error in authenticating user");
      const responseJson = await response.json();
        return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
module.exports = OMailAuthController;

/* 
USAGE:
let email, password, confirmPassword, OTP;
let OMailAuthObj = new OMailAuthController(email, password, confirmPassword, OTP);
OMailAuthObj.sendOtpToMail();
OMailAuthObj.verifyUserOtp();
OMailAuthObj.signUpHandler();
OMailAuthObj.signInHandler();
*/
