const crypto = require("crypto-js");

class OMailEncryptUtils {
  constructor(emailID, password) {
    this.emailID = emailID;
    this.password = password;
  }

  // NOTE: window won't work in Nodejs testing
  generateSalt() {
    //    return Array.from(window.crypto.getRandomValues(new Uint8Array(16)));
    return crypto.lib.WordArray.random(128/8);
  }

  // NOTE: Window won't work in Nodejs testing
  async generateSHA256Digest() {
    /* const digest = Array.from( */
    /*   new Uint8Array( */
    /*     await window.crypto.subtle.digest( */
    /*       "SHA-256", */
    /*       new TextEncoder().encode(this.password) */
    /*     ) */
    /*   ) */
    /* ); */
    /* return digest; */
    const digest = Array.from(
      new TextEncoder().encode(
        JSON.stringify(crypto.SHA256(this.password + this.emailID))
      )
    );
    return digest;
  }
}

module.exports = OMailEncryptUtils;
