const OMailAuthController = require("./OMailAuthController");
const { GoogleSignin, statusCodes } = require("react-native-google-signin");

class GoogleOAuthReactNative extends OMailAuthController {
  constructor(scopes, webClientId, offlineAccess) {
    this.scopes = scopes;
    this.webClientId = webClientId;
    this.offlineAccess = offlineAccess;
  }

  configureGoogleOAuth() {
    GoogleSignin.configure({
      scopes: this.scopes,
      webClientId: this.webClientId,
      offlineAccess: this.offlineAccess
    })
  }

  async checkUserLoginStatus() {
    try {
			const isSignedIn = await GoogleSignin.isSignedIn();
			if (isSignedIn) {
				console.log("USER IS SIGNED IN");
				return true;
			} else {
				console.log("LOGIN REQUIRED");
				return false;
			}
    } catch (err) {
      console.error("Error in checking login status.")
      return false;
    }
  }

  async getCurrentGoogleUserInfo() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      return userInfo;
    } catch(err) {
      console.error("Error in fetching user info");
      return null; 
    }
  }

  async getGoogleTokens() {
    try {
      if (await this.checkUserLoginStatus()) {
        const token = await GoogleSignin.getTokens();
        return token.accessToken;
      } else {
        console.log("LOGIN REQUIRED");
      }
    } catch (err) {
      console.error("Error in fetching Google's Access Tokens");
    }
  }

  async googleOAuthSignIn() {
		try {
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});
			const basicUserInfo = await GoogleSignin.signIn();
			console.log("USER INFO:", basicUserInfo);
			return basicUserInfo;
		} catch (err) {
			console.log("ERROR", err.message);
			if (err.code === statusCodes.SIGN_IN_CANCELLED)
				console.error("USER CANCELLED SIGN IN FLOW");
			else if (err.code === statusCodes.IN_PROGRESS)
				console.error("SIGN IN FLOW IS IN PROGRESS");
			else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
				console.error("GOOGLE PLAY SERVICES NOT AVAILABLE");
			console.error("Error in Google OAuth Sign in.");
		}
  }
	
	async googleOAuthSignOut() {
		try {
			await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
		} catch (err) {
			console.error("Error in Google OAuth Sign Out.");
		}
  }
}

module.exports = GoogleOAuthReactNative;
