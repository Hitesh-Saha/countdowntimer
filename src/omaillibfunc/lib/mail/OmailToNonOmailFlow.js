import { PassphraseMethod } from './PassphraseFlow';
import { SharedKeyMethod } from './SharedKeyFlow';
const forge = require('node-forge');

export async function OMailToNonOMailFlow(from, to, cc, bcc, passphrase, salt, secret,
  userKey, iv, subject, body, attachments, isPassphraseMethod) {
    console.log("PASS SET TO TRUE");
    isPassphraseMethod=true
  if (isPassphraseMethod) return await PassphraseMethod(
    from, to, cc, bcc, passphrase, salt, secret,
      userKey, iv, subject, body, attachments, isPassphraseMethod
  );
  else return await SharedKeyMethod(
    from, to, cc, bcc, passphrase, salt, secret,
      userKey, iv, subject, body, attachments, isPassphraseMethod
  ); 
}