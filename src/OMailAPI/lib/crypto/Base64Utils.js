class Base64Utils {
  encodeByteArray(byteArray) {
    let binary = "";
    let bytesUint8Array = new Uint8Array(byteArray);
    bytesUint8Array.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  
  encodeUint8Array(Uint8ByteArray) {
    let binary = "";
    Uint8ByteArray.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  
  decodeBase64String(base64String) {
    let binaryString = atob(base64String);
    let Uint8ByteArray = new Uint8Array(binaryString.length);
    binaryString.forEach((binaryChar, idx) => Uint8ByteArray[idx] = String.fromCharCode(binaryChar));
    return Uint8ByteArray.buffer;
  }

  decodeBase64ToUint8Array(base64String) {
    return Uint8Array.from(
      atob(base64String).split("").map(char => char.charCodeAt(0))
    );
  }
}

module.exports = Base64Utils;
