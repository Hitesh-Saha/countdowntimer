import generateIV from "./generateIV";
import generateMasterKey from "./generateMasterKey";
import generateRSAKeyPair from "./generateRSAKeyPair";
import generateSalt from "./generateSalt";
import generateUserKey from "./generateUserKey";

const KeyGenUtils = {
  generateUserKey,
  generateSalt,
  generateRSAKeyPair,
  generateMasterKey,
  generateIV,
};

export default KeyGenUtils;
