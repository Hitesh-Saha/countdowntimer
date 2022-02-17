const forge = require("node-forge");

// 
export async function AESEncrypt(key, iv, text) {
  try {
    console.log("AES encrypt")
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(text, 'utf8'));
    cipher.finish();
    let encryptedText = cipher.output.getBytes();
    encryptedText = forge.util.encode64(encryptedText);
    return encryptedText;
  } catch (err) {
    console.log("Error in AES Encryption");
    console.log(err);
  }
}

// export async function AESDecrypt(key, iv, text) {
//   console.log("decryption fhe")
//   text = forge.util.decode64(text);
//   const decipher = forge.cipher.createDecipher("AES-CBC", key);
//   decipher.start({iv: iv});
//   decipher.update(forge.util.createBuffer(text));
//   decipher.finish();
//   let plaintext = decipher.output.toString('utf8');
//   return plaintext;
// }
export async function AESDecrypt(key, iv, text) {
  try {
    console.log("AES Decrypt")
    text = forge.util.decode64(text);
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(text));
    decipher.finish();
    let plaintext = decipher.output.toString('utf8');
    console.log(plaintext)
    return plaintext;
  } catch (err) {
    console.log("Error in AES Decryption");
    console.log(err);
  }
}

// NOTE: this method is specific to React Native 
export async function AESEncryptAttachment(key, iv, {uri, type, name, size}) {
  let encryptedName = await AESEncrypt(key, iv, name);
  //let data = await RNFetchBlob.fs.readFile(uri, 'base64');
  let encryptedData = await AESEncrypt(key, iv, uri);
  return {
    encryptedContent: encryptedData,
    encryptedFilename: encryptedName
  }
}