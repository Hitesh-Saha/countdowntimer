import passPhraseDecrypt from "../passphraseUtils/passDecrypt";
import aesMessageDecryption from "../../OMailLib/cryptoDecryptionUtils/aesMessageDecryption";
import MasterKey from "../../MasterKeyFactory/index";
const [getMasterKey, setMasterKey, removeMasterkey,setPassphrase,getPassphrase] = MasterKey();
import { getUserKey } from "../../omaillibfunc/lib/crypto/keystore";
import { authorizationToken } from "../token";
let forge=require('node-forge')

const getPassphraseDetails = async (user) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      from: user,
      text: "*",
      page: {
        offset: 1,
        limit: 25,
      },
    });
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    const response = await fetch(
      "https://omail.vault.ziroh.com/api/v1/omail/pp/find",
      requestOptions
    );
    const result = await response.json();
  
    const userKeyRes = await getUserKey(user);
    const iv = forge.util.decode64(userKeyRes.KeyRecords[0].SymKeyIV);
    const uK = userKeyRes.KeyRecords[0].ResourceKey;
    const masterKey = await getMasterKey(user);
    const userKey = 
        forge.util.decode64(aesMessageDecryption(forge.util.decode64(masterKey),(iv),uK))
  
    const passPhraseDetails = [];
  
    //console.log(result.passphrases);
  
      let eto=[];
    for (let index = 0; index < result.passphrases.length; index++) {
      const element = result.passphrases[index];
      eto=[];
      for(let i=0;i<element.to.length;i++){
        if(element.to[i]==null || element.to[i]==""){
        eto.push(" ")
        }
        else{
        eto.push(await passPhraseDecrypt(userKey, JSON.parse(element.iv), element.to[i]))
        }
      }
      const passphrase = {
        msgId: element.msgId,
        createdOnEpochUTC: element.createdOnEpochUTC,
        subject: await passPhraseDecrypt(
          userKey,
          iv,
          element.subject
        ),
        from: element.from,
        to:eto,
        cc: element.cc,
        bcc: element.bcc,
        passphrase: element.passphrase,
        iv: element.iv,
      };
     // console.log(passphrase);
      passPhraseDetails.push(passphrase);
    }
  
    return passPhraseDetails;
  };

  export default getPassphraseDetails;