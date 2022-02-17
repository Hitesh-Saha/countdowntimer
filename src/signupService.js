import OMailUtils from "./OMailLib/index.js";

var KeyGenerate_1 = require("./Indexinglibrary/lib/KeyGen/KeyGenerate");

var authorizationToken =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";

const storeUserDetails = async (userDetails, register) => {
  let username;
  if (register) username = "registered_" + userDetails.userId;
  else username = userDetails.userId;

  const sessionRes = await fetch(
    "https://keys.vault.ziroh.com/ss/sessions/token/" + username
  );
  const sessionToken = JSON.parse(await sessionRes.text()).Token;
  console.log(userDetails);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + authorizationToken);
  myHeaders.append("SessionId", sessionToken);
  myHeaders.append("UserId", username);

  var raw = {
    Uniqueid: "",
    UserId: username,
    ResourceKey: "",
    SymKeyIV: userDetails.iv,
    KeyDescription: "",
    GeneratedOn: Math.floor(new Date() / 1000),
    KeyStatus: "valid",
    ExpiryDate: 0,
    ResourceId: "",
  };

  for (let index = 0; index < Object.keys(userDetails).length; index++) {
    const element = Object.keys(userDetails)[index];
    console.log(element);
    if (element !== "userId" && element !== "iv") {
      raw.Uniqueid = element + "_" + username;
      raw.ResourceKey = userDetails[element];
      raw.KeyDescription = element;
      raw.ResourceId = element;

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };

      await fetch(
        "https://keys.vault.ziroh.com/kss/keystore/resource",
        requestOptions
      )
        .then((res) => res.text())
        .then((txt) => console.log(txt))
        .catch((err) => {
          console.log(err);
          return Promise.resolve(false);
        });
    }
  }

  return Promise.resolve(true);
};

export const signup = async (userId, pwd, salt, register = false) => {
  try {
    const iv = OMailUtils.KeyGenUtils.generateIV();
    const userKey = OMailUtils.KeyGenUtils.generateUserKey(salt);
    const masterKey = OMailUtils.KeyGenUtils.generateMasterKey(
      userId,
      pwd,
      salt
    );
    const { privateKey, publicKey } =
      await OMailUtils.KeyGenUtils.generateRSAKeyPair();
    const userPrivateKey = privateKey;
    const userPubKey = publicKey;
    const encPrivateKey = OMailUtils.cryptoEncryptionUtils.aesEncryption(
      userKey,
      iv,
      userPrivateKey
    );
    const encUserKey = OMailUtils.cryptoEncryptionUtils.aesEncryption(
      masterKey,
      iv,
      JSON.stringify(userKey)
    );

    const fhekey = new KeyGenerate_1.KeyGenerator().generateKeys();
    fhekey.key = Array.from(fhekey.key);
    const encFHEKey = OMailUtils.cryptoEncryptionUtils.aesEncryption(
      userKey,
      iv,
      JSON.stringify(fhekey)
    );
    //Store Keys
    const res1 = await storeUserDetails(
      {
        userId,
        iv: JSON.stringify(iv),
        userKey: encUserKey,
        privateKey: encPrivateKey,
        publicKey: userPubKey,
        fhekey: encFHEKey,
      },
      register
    );
    if (res1) return masterKey;
    else return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
