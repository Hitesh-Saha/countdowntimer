const forge = require('node-forge');
const accessToken= "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";

export function generateSalt() {
  const salt = forge.random.getBytesSync(128/8);
  const saltBuffer = forge.util.createBuffer(salt);
  let saltArray = new Uint8Array(saltBuffer.length());
  for (let i=0; i<saltBuffer.length(); i++) saltArray[i] = saltBuffer.at(i);
  saltArray = Array.from(saltArray);
  return {
    salt: salt,
    saltArray: saltArray
  };
}

export function generateDigest(email, password) {
  const digest = forge.md.sha256.create();
  digest.update(email + password);
  let digestData = digest.digest();
  let digestArray = new Uint8Array(digestData.length());
  for (let i=0; i<=digestData.length(); i++) digestArray[i] = digestData.at(i);
  digestArray = Array.from(digestArray);
  return {
    digest: digest,
    digestArray: digestArray
  };
}

export function generateSecret() {
  return forge.util.encode64(forge.random.getBytesSync(2048));
}

export function generateUserKey(secret, salt) {
  let userKey = forge.pkcs5.pbkdf2(secret, salt, 1000, 32);
  let userKeyBase64 = forge.util.encode64(userKey);
  return {
    userKey: userKey,
    userKeyBase64: userKeyBase64
  };
}

export function generateIV() {
  let iv = forge.random.getBytesSync(128/8);
  let ivBase64 = forge.util.encode64(iv);
  return {
    iv: iv,
    ivBase64: ivBase64
  }
}

export function generateMasterKey(email, password, salt) {
  let masterKey = forge.pkcs5.pbkdf2(email + password, salt, 1000, 32);
  let masterKeyBase64 = forge.util.encode64(masterKey);
  return {
    masterKey: masterKey,
    masterKeyBase64: masterKeyBase64
  };
}

export async function generateRSA() {
  return new Promise((res, rej) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2}, (err, keypair) => {
      let privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
      let publicKey= forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey)
      res({ privateKey: privateKey, publicKey: publicKey })
    })
  })
}

export async function registerUser(email, saltArray, digestArray) {
  console.log("registerUser")
  let requestBody = { ID: email, Salt: saltArray, Digest: digestArray };
  let response = await fetch(
    "https://keys2.vault.ziroh.com/api/v1/UserManagement/Users/User",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type" : "application/json" },
      redirect: "follow"
    }
  )
  console.log(await response.json());
  if (response) return true;
  else return false;
}

export async function getSessionToken(email) {
  let url = `https://keys.vault.ziroh.com/ss/sessions/token/${email}`;
  let response = await fetch(url);
  let responseText = await response.json();
  const sessionToken = responseText.Token;
  return sessionToken;
}

export async function storeKeys(email, key, keyType, headers, body) {
  try {
    // body.Uniqueid = `${keyType}_${email}`
    // body.ResourceKey = key;
    // body.KeyDescription = keyType;
    // body.ResourceId = keyType;
    // let url = `https://keys.vault.ziroh.com/kss/keystore/resource`;
    body.keyRecord.Uniqueid = `${keyType}_${email}`;
    body.keyRecord.ResourceKey = key;
    body.keyRecord.KeyDescription = keyType;
    body.keyRecord.ResourceId = keyType;
    // ** REQUIRED UPDATE
    console.log(JSON.stringify(body, null, 4));
    let url = `https://user.vault.ziroh.com/api/v1/org/admin/keystore/record`;
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      redirect: "follow"
    });
    // const responseText = await response.text();
    const responseText = await response.json();
    console.log(responseText);
    return responseText;
  } catch (err) {
    // console.log(err);
    console.log('Error in storing keys', err);
    return false;
  }
}
export async function getNewSalt(email) {
  try {
    let url = `https://user.vault.ziroh.com/api/v1/org/user/newsalt/org1/${email}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  } catch (err) {
    console.log("Error in getting new salt", err);
  }
}

export async function getNonce(email) {
  try {
    let url = `https://user.vault.ziroh.com/api/v1/user/nonse/org1/${email}`;
    const response = await fetch(url);
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON.userNonce.nonce;
  } catch (err) {
    console.log("Failed to get nonce;", err);
  }
}
export async function store(serverAuthCode) {
  let url = 'https://user.vault.ziroh.com/api/v1/google/oauth2/token';
  let headers = new Headers();
  headers.append('Content-type', 'application/json');
  let body = JSON.stringify({
    Client: 'omailprod',
    Code: serverAuthCode,
  });
  console.log(body);
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });
  const responseJSON = await response.json();
  return responseJSON;
}

export async function storeDigest(email, digest) {
  try {
    let url = `https://user.vault.ziroh.com/api/v1/org/user/digest/store`;
    let body = JSON.stringify({
      orgId: "org1", emailId: email, digest: digest, region:"oregon"
    });
    console.log(body);
    const response = await fetch(url, {
      method: "POST",
      body: body
    });
    console.log(response);
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  } catch (err) {
    console.log("Error in storing digest", err);
    return null;
  }
}

export async function verifyDigest(email, digest) {
  try {
    let url = `https://user.vault.ziroh.com/api/v1/org/user/digest`;
    let body = JSON.stringify({
       orgId: 'org1', emailId: email, generatedDigest: digest
    });
    console.log(body);
    let response = await fetch(url, { method: "POST", body: body });
    //console.log(JSON.stringify(response));
    let responseJSON = await response.json();
    console.log(responseJSON.errorCode);
    if (responseJSON.errorCode === 0) return true;
    else throw new Error();
  } catch (err) {
    console.log("Failed to verify digest;", err);
    return false;
  }
}

export async function authenticateOMailUser(email, salt, digestArray) {
  try {
    // let url = `https://keys.vault.ziroh.com/UserManagement/Users/User/authenticate`;
    let url = `https://keys2.vault.ziroh.com/api/v1/UserManagement/Users/User/authenticate`;
  let headers = new Headers();
  // headers.append("Authorization", `Bearer ${accessToken}`);
  headers.append("Content-Type", "application/json");
  let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: email,
      salt: salt,
      digest: digestArray
    }),
    headers: headers,
    redirect: "follow"
  });
  // return response.ok;
  let responseJSON = await response.json();
  console.log(`auntheticate ${responseJSON}`)
  return responseJSON
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function fetchRefreshToken(emailID) {
  try {
    let url =
      'https://user.vault.ziroh.com/api/v1/org/oauth/refreshtoken/' + emailID;
    let response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    if (!response) throw new Error('Error in fetching refresh token');
    let responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON.token;
  } catch (err) {
    console.log(err);
    return null;
  }
}
export async function fetchAccessToken(refreshToken, accessToken) {
  try {
    let url = 'https://user.vault.ziroh.com/api/v1/google/oauth2/token/refresh';
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Content-Type', 'application/json');
    let response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        Client: 'omailprod',
        RefreshToken: refreshToken,
      }),
      redirect: 'follow',
    });
    let responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON.Token;
  } catch (err) {
    console.log(err);
    return null;
  }
}