import cryptoEncryptionUtils from "../../OMailLib/cryptoEncryptionUtils/";
import cryptoDecryptionUtils from "../../OMailLib/cryptoDecryptionUtils";
import keyGenerationUtils from "../../OMailLib/keyGenUtils/";
import { getUserSalt } from "../../vaultUtils/"

/* helper function to generate salt, key, iv */
function generateEncryptKeyIV(username) {
  let key, iv;
  const salt = await getUserSalt(username);
  const cryptoSalt = JSON.parse(
    new TextDecoder.decode(new Uint8Array(salt))
  );
  key = keyGenerationUtils.generateUserKey(cryptoSalt).toString();
  iv = keyGenerationUtils.generateIV();
  return { key, iv };
}

/* encrypt subject */
export async function encryptSubject(subject, username) {
  let { key, iv } = generateEncryptKeyIV(username);
  let encryptedSubject = cryptoEncryptionUtils.aesEncryption(key, iv, subject); 
  return encryptedSubject;
}

/* encrypt body */
export async function encryptBody(body, username) {
  let { key, iv } = generateEncryptKeyIV(username);
  let encryptedBody = cryptoEncryptionUtils.aesEncryption(key, iv, body);
  return encryptedBody;
}

/* encrypt attachments */
export async function encryptAttachments(attachmentEntity, username) {
  let encryptedAttachment = null;
  let { key, iv } = generateEncryptKeyIV(username);
  // read as data url && encrypt
  let reader = new FileReader();
  reader.onload = async (attachment) => {
    // get msgKey, msgIV
    encryptedAttachment = cryptoEncryptionUtils.aesEncryption(
      key, iv, attachment.target.result.split(",")[1]
    );
  }
  reader.readAsDataURL(attachmentEntity);
  return encryptedAttachment;
}

/* encrypt attachment fileName */
export async function encryptFileName(fileName, username) {
  let { key, iv } = generateEncryptKeyIV(username);
  let encryptedFileName = cryptoEncryptionUtils.aesEncryption(key, iv, fileName);
  return encryptedFileName;
}

/* parse msgIV from attachment data */
export async function generateDecryptKeyIV(attachmentData, username) {
  // get user public key, get user private key, get message key, user iterator
  const keyStruct = JSON.parse(
    atob(attachmentData.replace("-","+").replace("_","/"))
  );
  let iv = JSON.stringify(keyStruct.iv);
  const privateKey = await getUserPrivateKey(username);
  let key = await getMessageKey(privateKey, keyStruct.k, username);
  return { key, iv };
}


/* decrypt subject */
export async function decryptSubject(encryptedSubject, username, keyAttachmentData) {
  let { key, iv } = generateDecryptKeyIV(keyAttachmentData, username);
  let decryptedSubject = cryptoDecryptionUtils.aesMessageDecryption(
    key, JSON.parse(iv), encryptedSubject
  );
  return decryptedSubject;
}


/* decrypt body */
export async function decryptBody(encryptedBody, username, keyAttachmentData) {
  let { key, iv } = generateDecryptKeyIV(keyAttachmentData, username);
  let decryptedBody = cryptoDecryptionUtils.aesMessageDecryption(
    key, JSON.parse(iv), encryptedBody.replace(/-/g, "+").replace(/_/g, "/").trim()
  );
  return decryptedBody;
}

/* decrypt attachment fileName */
export async function decryptFileName(fileName, username, keyAttachmentData) {
  let { key, iv } = generateDecryptKeyIV(keyAttachmentData, username);
  let decryptedFileName = cryptoDecryptionUtils.aesMessageDecryption(key, iv, fileName);
  return decryptedFileName;
}

/* decrypt attachments */
export async function decryptAttachments(attachmentData, username, keyAttachmentData) {
  let { key, iv } = generateDecryptKeyIV(keyAttachmentData, username);
  const decryptedAttachmentData = cryptoDecryptionUtils.aesMessageDecryption(
    key, iv, attachmentData.replace(/-/g, "+").replace(/_/g, "/")
  );
  const dataURL = `data:application/octet-stream;base64,${decryptedAttachmentData}`;
  return dataURL;
}

// TODO: separate lib for userUtils & encryptionUtils
