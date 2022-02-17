import { authorizationToken } from "../token";
import { getSession } from "../sessions/getSession";
import { keyStoreBaseApi } from "./api";
import { getKeyRecordByResourceId } from "../../omaillibfunc/lib/crypto/keystore";

const getFheKey = async (username) => {
  try {
    // let { privateKey, iv, userKey } = await getUserEncryptionKeys();
    // let masterKey = await getMasterKey(username);
    // masterKey = forge.util.decode64(masterKey);
    // iv = forge.util.decode64(iv);
    // console.log('Get master key', masterKey);
    // console.log('Get iv', iv);
    // console.log('Get user key', userKey);
    // let decryptedUserKey = await AESDecrypt(masterKey, iv, userKey);
    // decryptedUserKey = forge.util.decode64(decryptedUserKey);
    const result = await getKeyRecordByResourceId('org1', username, 'fheKey');
    if (result !== undefined) {
      const fheKey = result.KeyRecords[0].ResourceKey;
      console.log("GET FHE KEY", fheKey);
      // let decryptedFheKey = await AESDecrypt(decryptedUserKey, iv, fheKey);
      // decryptedFheKey = decryptedFheKey.split(',');
      // return decryptedFheKey;
      return fheKey
    }
    else throw new Error("Couldn't find fhe key from server");
  } catch (err) {
    console.log('Error in fetching FHE key', err);
    return null;
  }
}

export { getFheKey };
