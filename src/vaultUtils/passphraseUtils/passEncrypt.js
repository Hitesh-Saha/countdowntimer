import { AESEncrypt } from "../../omaillibfunc/lib/crypto/AES";
import aesEncryption from "../../OMailLib/cryptoEncryptionUtils/aesMessageEncryption";
let forge=require('node-forge')
const passPhraseEncrypt = async (key, iv, message) => {

    console.log((key))
    console.log(iv);
    
    return aesEncryption(key,iv,message)//aesEncryption(key, iv, message);
  };
  
  export default passPhraseEncrypt;