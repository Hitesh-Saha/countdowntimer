import OMailCrypto from "../cryptoInit";
const forge = require("node-forge");

const generateIV = () => {
  let iv = forge.random.getBytesSync(128 / 8);
  return iv;
};

export default generateIV;
