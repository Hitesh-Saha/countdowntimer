const Str = require("@supercharge/strings");
var crypto = require("crypto");
import Base64Utils from "../Base64Utils";
import OMailCrypto from "../cryptoInit";
const forge = require("node-forge");

const generateUserKey = (salt) => {
  let secret = forge.util.encode64(forge.random.getBytesSync(2048));
  let userKey = forge.pkcs5.pbkdf2(secret, salt, 1000, 32);
  return userKey;
};

export default generateUserKey;
