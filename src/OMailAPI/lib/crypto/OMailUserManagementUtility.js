const { OMAIL_USER_MANAGEMENT } = require("../helpers/urls");

class OMailUserManagementUtility {
  constructor(emailID, accessToken) {
    this.emailID = emailID;
    this.accessToken = accessToken;
  }

  async checkUserRegistered() {
    try {
      let headers = new Headers(); 
      headers.append("Authorization", `Bearer ${this.accessToken}`);
      let url = `${OMAIL_USER_MANAGEMENT}/${this.emailID}`;
      let response = await fetch(url, {
        method: "POST",
        headers: headers,
        redirect: "follow"
      });
      if (!response) throw new Error("Error in checking user registration.");
      let responseJson = await response.json(); 
      return responseJson;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = OMailUserManagementUtility;
