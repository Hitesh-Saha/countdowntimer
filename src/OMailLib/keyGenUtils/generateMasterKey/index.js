import OMailCrypto from "../cryptoInit";
const forge = require("node-forge");

const generateMasterKey = (username, password, salt) => {
  let masterKey = forge.pkcs5.pbkdf2(username + password, salt, 1000, 32);
  return masterKey;
};

export default generateMasterKey;
