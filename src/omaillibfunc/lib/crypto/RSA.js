const forge = require("node-forge");

export async function RSAEncrypt(key, text) {
  const plainTextBytes = forge.util.encodeUtf8(text);
  const encryptedText = forge.pki.publicKeyFromPem(key).encrypt(plainTextBytes);
  return forge.util.encode64(encryptedText);
}

export async function RSADecrypt(key, text) {
  const decoded = forge.util.decode64(text);
  const decryptedText = forge.pki.privateKeyFromPem(key).decrypt(decoded);
  return forge.util.decodeUtf8(decryptedText);
}
