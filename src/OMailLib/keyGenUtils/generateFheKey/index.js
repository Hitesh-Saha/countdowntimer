const forge = require('node-forge');

/* Key generation */
const generateRandomNumber = length =>
  Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );

const getBytes = value => {
  const view = new DataView(new ArrayBuffer(4));
  for (let i = 3; i >= 0; --i) {
    view.setUint8(i, value % 256);
    value = value >> 8;
  }
  return new Uint8Array(view.buffer);
};

const generateFHEKey = () => {
  const randomNumber = generateRandomNumber(10);
  const k = getBytes(randomNumber);
  return k;
};
export {generateFHEKey};