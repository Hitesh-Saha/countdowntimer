var forge = require('node-forge');

var rsa = forge.pki.rsa;

const generateRSAKeyPair = () => {
    return new Promise(function (resolve, reject) {
        rsa.generateKeyPair({ bits: 2048, workers: 2 }, function (err, keypair) {
            if (err) {
            reject(err)
            } else {
                const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
                const publicKey = forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey);
                resolve({
                    privateKey,
                    publicKey
                })
            }
        });
    });
}
 
export default generateRSAKeyPair;