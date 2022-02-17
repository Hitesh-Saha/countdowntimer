// import { RSAEncrypt } from "src/omaillibfunc/lib/crypto/RSA";
// import Base64Utils from "../../Base64Utils";
import passPhraseEncrypt from "../passphraseUtils/passEncrypt";
import aesMessageDecryption from "../../OMailLib/cryptoDecryptionUtils/aesMessageDecryption";
import MasterKey from "../../MasterKeyFactory/index";
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = MasterKey();
import { getUserKey } from "../../omaillibfunc/lib/crypto/keystore";
import { authorizationToken } from "../token";
let forge=require('node-forge')
const addPassPhrase = async (user, rec, subject, id,passphrase) => {
  const keyRes = await getUserKey(user);
  const userKey = keyRes.KeyRecords[0].ResourceKey;
  const masterKey=await getMasterKey(user)
  
  const iv =forge.util.decode64(keyRes.KeyRecords[0].SymKeyIV) //generateIV().iv;

  const userkey1=forge.util.decode64(aesMessageDecryption(forge.util.decode64(masterKey),(iv),userKey))

  const encryptedSubject = await passPhraseEncrypt(userkey1,iv, subject);

  let encryptedRec=[];
 
  for(let i=0;i<rec.length;i++){
    let encto=await passPhraseEncrypt(userkey1, iv,rec[i])
    encryptedRec.push(encto);
  }

 

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer  " + authorizationToken);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    msgId: id,
    createdOnEpochUTC: new Date().getTime(),
    subject: encryptedSubject,
    from: user,
    to: encryptedRec,
    cc: [],
    bcc: [],
    passphrase: passphrase,
    iv: JSON.stringify(iv),
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://omail.vault.ziroh.com/api/v1/omail/pp", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export default addPassPhrase;