API DESIGN
----------
Functionalities:
----------------
- Omail Signup
- Gmail OAuth 
- Omail Signin
- GMail Functionalities
  - Compose & Sending Messages
  - Saving Messages to Drafts
  - Fetching all Inbox Messages
  - Fetching all Drafts Messages
  - Fetching all Sent Items
  - Fetching all Trash Items
- Encryption & Decryption
  - AES Encryption of Subject, Body & Attachments
  - RSA Encryption using user's public key on AES key & adding it to attachment
  - Convert to base64 & revert from base64
  - RSA Decryption using user's public key on attachment and derive AES key
  - AES Decryption of Subject, Body & Attachments

Classes & Methods:
-----------------
/* Wrapper around fetch */
class RequestBuilder {
  + url: string
  + method: string
  + headers: [] string
  + body: JSON string
  + fetchAPI(): RESPONSE
}

/* OMail Auth & Google OAuth */
class OMailAuthController { [DONE]
  + emailID: string
  + password: string
  + confirmPassword: string
  + OTP: integer

  - sendOtpToOMail()
  - verifyUserOtp()
  - signupHandler()
  - signinHandler()
}

class GoogleOAuth extends OMailAuthController { [DONE]
  + accessToken: string
  + refreshToken: string
  + serverAuthCode: string
  + userEmail: string
  + userName: string
  + scope: [] string
  + webClientId: string
  + offlineAccess: boolean

  - configureGoogleOauth()
  - checkUserLoginStatus()
  - getCurrentGoogleUserInfo()
  - getGoogleTokens()
  - googleOAuthSignIn()
  - googleOAuthSignOut()
}

/* Encryption & Decryption */
class OMailEncryptUtils { [done]
  + digest: string
  + salt: string

  - generateSalt()
  - generateSHA256Digest()
}

class AESEncryptDecrypt { [done]
  + userKey
  + IV
  + plainText

  - encrypt()
  - decrypt()
}

class RSAEncryptDecrypt { [done]
  + userPublicKey
  + userPrivateKey
  + plainText

  - encrypt()
  - decrypt()
}

class Base64Utils { [done]
  + byteArray
  + textString
  + charArray

  - encode(byteArray)
  - decode(textString)
  - encodeArray(charArray)
  - decodeArray(textString)
}

class OMailKeyIVGenerator { [done]
  + IV
  + userKey
  + masterKey
  + privateKey
  + publicKey
  + encryptedPrivateKey
  + encryptedPublicKey
  + fheKey
  + encFheKey

  - generateIV() - 
  - generateUserKey(salt) -
  - generateMasterKey(userEmail, password, salt)
  - generateFHEKey() ** [left]
  - generateRSAKeyPair()
  - encryptKeyAES() ** [left]
}

/* OMail Message Handlers */
class OMailMessageObject { [DONE]
  + to: []
  + from: {}
  + cc: []
  + bcc: []
  + subject: string
  + body: string
  + attachments: [] base64string
}

class OMailEmailEncryptorUtils { [DONE]
  - encryptSubject()
  - encryptBody()
  - encryptAttachment()
  - encryptKeyToAttachment()
}

class OMailEmailEncryptor { [DONE]
  + OMailMessageMetadata
  - encryptOMailMessage(OMailMessageMetadata)
}

class OMailEmailDecryptorUtils { [DONE]
  - decryptSubject()
  - decryptBody()
  - decryptAttachment()
  - decryptKeyFromAttachment()
}

class OMailEmailDecryptor { [DONE]
  + OMailMessageMetadata
  - decryptOMailMessage(OMailMessageMetadata)
}

class OMailKeyStoreUtility { [DONE]
  + getPublicKey() -
  + getPrivateKey() - 
  + getUserKey() -
  + getFheKey() -
  + getUserSalt() -
  + getUserPrivateKey()
}

class OMailPassphraseUtility {
  + addPassphrase()
  + clearAllPassphrase()
  + deletePassphrase()
}

class OMailSessionUtility { [DONE]
  + getSession() - 
  + getAuthToken() WHAT DOES THIS DO?
}

class OMailUserManagementUtility { [DONE]
  + checkUser()
  - authenticateUser() /vault/userManagementUtils
}


class GMailAPIHelpers {
  - saveToDraft()
  - sendMessage()
  - addAttachment()
  - replyMessage()
  - fullSync()
  - partialSync()
  - fetchInbox()
  - fetchSentItems()
  - fetchTrash()
  - fetchDrafts()
  - fetchSavedItems()
  - fetchContacts()
}


