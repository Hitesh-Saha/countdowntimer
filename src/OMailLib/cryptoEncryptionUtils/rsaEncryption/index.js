var forge = require("node-forge");

const rsaEncryption = (publicKey, message) => {
  var plaintextBytes = forge.util.encodeUtf8(message);
  const encryptedText = forge.pki
    .publicKeyFromPem(publicKey)
    .encrypt(plaintextBytes);
  return forge.util.encode64(encryptedText);
};

export default rsaEncryption;
