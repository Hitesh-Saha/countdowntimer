import aesMessageDecryption from "../../OMailLib/cryptoDecryptionUtils/aesMessageDecryption";

const passPhraseDecrypt = async (key, iv, message) => {

  
  
    return aesMessageDecryption(key, iv, message);
  };
  
  export default passPhraseDecrypt;