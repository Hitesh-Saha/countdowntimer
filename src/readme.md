Dependencies:

- @supercharge/strings
- crypto-js
- node-forge

Installation:

- Copy OMailLib in root directory
- npm i @supercharge/strings crypto-js node-forge --save

Usage:
Generators:

- generateIV(): word Array
- generateSalt(): word Array
- generateMasterKey(username<String(utf-8)>, password<String(utf-8)>, salt<Word Array>): Key Object
- generateUserKey(): String
- generateKeyPair(): Object{publicKey<String>, privateKey<String>}

Encryptor Functions:

- aesEncryption(key<String(utf-8)>/<Key Object(cryptoKey)>, iv<Word Array>, message<String>): Base64 Encoded String
- rsaEncryption(publicKey<String>, message<String>): Base64 Encoded String

Decryption Functions:

- aesMessageDecryption(key<String>/<Key Object>, iv<Word Array>, message<String>): Utf-8 Encoded String
- rsaDecryption(privateKey<String>, message<String(Base64)>): Utf-8 Encoded String
