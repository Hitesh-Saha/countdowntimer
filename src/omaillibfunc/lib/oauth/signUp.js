import { generateFHEKey } from '../../../OMailLib/keyGenUtils/generateFheKey/index';
import { AESDecrypt, AESEncrypt } from '../crypto/AES';
import {RSAEncrypt} from "../crypto/RSA"
import { generateDigest, generateIV, generateMasterKey, generateRSA, generateRSAKeyPair, generateSalt, generateSecret, generateUserKey, getSessionToken, registerUser, storeDigest, storeKeys } from '../helpers/OAuthUtils';
var KeyGenerate_1 = require("../../../Indexinglibrary/lib/KeyGen/KeyGenerate");
const forge = require('node-forge');
const accessToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";
import { getNewSalt } from '../helpers/OAuthUtils';
import MasterKey from "../../../MasterKeyFactory"
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase,removePassphrase] = MasterKey();


export async function signUpHandler(email, password, registered=false) {
  try {
  const salt = await getNewSalt(email);
  // const { salt, saltArray } = generateSalt();
  // const { digest, digestArray } = generateDigest(email, password);
  let digest = forge.md.sha256.create();
    digest.update(email + password); // array of integers
    let digestData = digest.digest();
    digestData = forge.util.encode64(digestData.data);
    console.log(digestData);
    const storedDigest = await storeDigest(email, digestData);
    if (storedDigest === null) throw new Error ("Failed to store digest.");
    const secret = forge.util.encode64(forge.random.getBytesSync(2048));
    console.log('Secret generated');
    let userKey = forge.pkcs5.pbkdf2(secret, salt, 1000, 32);
    let userKeyb64 = forge.util.encode64(userKey);
    console.log('User Key generated');
    let iv = forge.random.getBytesSync(128 / 8);
    let ivb64 = forge.util.encode64(iv);
    console.log('iv generated');
    console.log('WAITING ?');
    let masterKey = forge.pkcs5.pbkdf2(email + password, salt, 1000, 32);
    masterKey = forge.util.encode64(masterKey);
    await setMasterKey(email,masterKey);
    console.log(masterKey)
    console.log('Saved master key to async storage');
    masterKey = forge.util.decode64(masterKey);
    let {privateKey, publicKey} = await generateRSA();
    console.log('RSA key pair generated');
    // encrypt private key and user key with AES
    const encryptedPrivateKey = await AESEncrypt(userKey, iv, privateKey);
    console.log('encryptedPrivateKey', encryptedPrivateKey);
    const encryptedUserKey = await AESEncrypt(masterKey, iv, userKeyb64);
    console.log('encryptedUserKey', encryptedUserKey);

    // generate fhe key and store in server
    const fheKey = generateFHEKey();
    console.log(fheKey)
    const encryptedFHEKey = await AESEncrypt(userKey, iv, fheKey);
    console.log('FHE_KEY', encryptedFHEKey);
    const decryptedFHEKey = await AESDecrypt(userKey, iv, encryptedFHEKey);
    console.log('FHE_KEY', decryptedFHEKey);
    // await setUserKey(encryptedUserKey);
    console.log('Keys are encrypted');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('UserId', email);
    let body = {
      keyRecord: {
        Uniqueid: '',
        UserId: email,
        ResourceKey: '',
        SymKeyIV: ivb64,
        KeyDescription: '',
        GeneratedOn: Math.floor(new Date() / 1000),
        KeyStatus: 'valid',
        ExpiryDate: 0,
        ResourceId: '',
      },
      owner: {
        userId: email,
        orgId: 'org1'
      }
    };
    storeKeys(email, encryptedUserKey, 'userKey', headers, body);
    storeKeys(email, encryptedPrivateKey, 'privateKey', headers, body);
    storeKeys(email, publicKey, 'publicKey', headers, body);
    storeKeys(email, encryptedFHEKey, 'fheKey', headers, body);
    console.log("STORED KEYS SUCCESSFULLY");

  } catch (err) {
    console.log("Error in sign up handler");
    console.log(err);
  }
}
  // const secret = generateSecret();
  // const { userKey, userKeyBase64 } = generateUserKey(secret, salt);
  // const { iv, ivBase64 } = generateIV();
  // const { masterKey, masterKeyBase64 } = generateMasterKey(email, password, salt);
  // NOTE: store master key base 64 in a client cache
  // const { privateKey, publicKey } = await generateRSAKeyPair();

  // const encryptedPrivateKey = await AESEncrypt(userKey, iv, privateKey);
  // const encryptedUserKey = await AESEncrypt(masterKey, iv, userKeyBase64);

  // const registeredUser = await registerUser(email, saltArray, digestArray);
  // if (registered) email = "registered_" + email;
  // const sessionToken = await getSessionToken(email);
  // let headers = new Headers();
  // headers.append("Content-Type", 'application/json');
	// headers.append("Authorization", `Bearer ${accessToken}`); // NOTE: where did this come from ?
	// headers.append("SessionId", sessionToken);
	// headers.append("UserId", email);
  // const fhekey = new KeyGenerate_1.KeyGenerator().generateKeys();
  // fhekey.key = Array.from(fhekey.key);
  // const encFHEKey =await AESEncrypt(
  //   userKey,
  //   iv,
  //   JSON.stringify(fhekey)
  // );
  // let body = { 
  //   Uniqueid: "",
  //   UserId: email,
  //   ResourceKey: "",
  //   SymKeyIV: ivBase64,
  //   KeyDescription: "",
  //   GeneratedOn: Math.floor(new Date()/1000),
  //   KeyStatus: "valid",
  //   ExpiryDate: 0,
  //   ResourceId: ""
  // };
  // console.log(encFHEKey)
  // storeKeys(email, encryptedUserKey, "userKey", headers, body);
  // storeKeys(email, encryptedPrivateKey, "privateKey", headers, body);
  // storeKeys(email, publicKey, "publicKey", headers, body);
  // storeKeys(email, encFHEKey, "fheKey", headers, body);


