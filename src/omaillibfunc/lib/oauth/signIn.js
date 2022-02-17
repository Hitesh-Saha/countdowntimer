import { getUserSalt } from '../crypto/keystore';
import { getNonce } from '../helpers/OAuthUtils';
import { verifyDigest } from '../helpers/OAuthUtils';
import { authenticateOMailUser, generateDigest } from '../helpers/OAuthUtils';
const forge = require('node-forge');

export async function signInHandler(email, password) {
//   console.log('salt');
//   let salt = await getUserSalt(email);
//   let { digest, digestArray } = generateDigest(email, password);
//   const authentication = await authenticateOMailUser(email, salt, digestArray);
//   return authentication
// }
try {
  let salt = await getUserSalt(email);
  console.log('SALT GENERATED', salt);
  // generate digest
  let digest = forge.md.sha256.create();
  digest.update(email + password); // array of integers
  let digestData = digest.digest();
  digestData = forge.util.encode64(digestData.data);
  let nonce = await getNonce(email);
  digestData = digestData + "<<sep>>" + nonce;
  let finalDigest = forge.md.sha256.create();
  finalDigest.update(digestData);
  finalDigest = finalDigest.digest().data;
  finalDigest = forge.util.encode64(finalDigest);
  const verificationDigest = await verifyDigest(email, finalDigest);
  if (verificationDigest !== true) throw new Error("Invalid password.");
  else {
    console.log('SIGN IN Complete');
    // let userInfo = await getCurrentGoogleUserInfo();
    // console.log('SERVER AUTH CODE: ', userInfo.serverAuthCode);
    // let token = await store(userInfo.serverAuthCode);
    // console.log(token);
    // const refreshToken = await fetchRefreshToken(email);
    // const googleAccessToken = await fetchAccessToken(refreshToken, accessToken);
    return true;
  }
} catch (err) {
  console.log(err);
  return null;
}
}