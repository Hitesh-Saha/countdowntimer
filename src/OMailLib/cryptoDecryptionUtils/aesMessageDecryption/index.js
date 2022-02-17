import OMailCrypto from "../../keyGenUtils/cryptoInit";

import generateSalt from "../../keyGenUtils/generateSalt";
const forge = require("node-forge");

const aesMessageDecryption = (key, iv, txt) => {
  let txt1 = forge.util.decode64(txt);
  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(txt1));
  decipher.finish();
  let plainText = decipher.output.toString("utf8");
  return plainText;
};

export default aesMessageDecryption;
