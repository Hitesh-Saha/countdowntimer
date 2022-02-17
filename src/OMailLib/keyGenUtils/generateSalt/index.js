import OMailCrypto from "../cryptoInit";
const forge = require("node-forge");

const generateSalt = () => {
  let salt = forge.random.getBytesSync(128 / 8);
  return salt;
};

export default generateSalt;
