const { OMAIL_SESSIONS } = require('../helpers/urls');

class OMailSessionUtility {
  constructor(emailID) {
    this.emailID = emailID; 
  }

  async getSession() {
    try {
      let url = `${OMAIL_SESSIONS}/${this.emailID}`;
      let response = await fetch(url);
      if (!response) throw new Error("Error in getting session");
      let responseText = await response.text();
      let sessionToken = JSON.parse(responseText).Token;
      return sessionToken;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // TODO: What should this even do ?
  async getAuthToken() {
    try {
      
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};

module.exports = OMailSessionUtility;
