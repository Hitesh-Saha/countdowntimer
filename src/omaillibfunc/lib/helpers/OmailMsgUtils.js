import { checkUserRegistered, getPublicKey } from "../crypto/keystore";
const forge = require("node-forge");

const accessToken =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKcWRHa2lPaUptYzI0aUxDSmhjR2xMWlhsT1lXMWxJam9pWm1seWMzUmhjR2xyWlhraUxDSnpkV0lpT2lKbWMyNTBaWE4wSW4wLkpEVE1XVVVoZTQtNDVCMlRjbDd3ei1wdC1pWG1lVzhTQnBFdDlfaTRmTHZfZ1laVHVwb29FVlZyUnpMYndDM3hxNU1kaThfYV84aHBxLXhKbk5vQjJ3";

export async function partitionOMailUsers(to, cc, bcc) {
  let signedUsersTo = [];
  let unsignedUsersTo = [];
  let signedUsersCc = [];
  let unsignedUsersCc = [];
  let signedUsersBcc = [];
  let unsignedUsersBcc = [];
  



  for (let i=0; i<to.length; i++) {
    let emailID = to[i];
    const isSigned = await checkUserRegistered(emailID, accessToken);
    console.log(isSigned)
    if (isSigned === true) signedUsersTo.push(emailID);
    else unsignedUsersTo.push(emailID);

  }

  for (let i=0; i<cc.length; i++) {
    let emailID = cc[i];
    const isSigned = await checkUserRegistered(emailID, accessToken);
    if (isSigned === true) signedUsersCc.push(emailID);
    else unsignedUsersCc.push(emailID);
  }

  for (let i=0; i<bcc.length; i++) {
    let emailID = bcc[i];
    const isSigned = await checkUserRegistered(emailID, accessToken);
    if (isSigned === true) signedUsersBcc.push(emailID);
    else unsignedUsersBcc.push(emailID);
  }

  return {
    signedUsersTo: signedUsersTo,
    signedUsersCc: signedUsersCc,
    signedUsersBcc: signedUsersBcc,
    unsignedUsersTo: unsignedUsersTo,
    unsignedUsersCc: unsignedUsersCc,
    unsignedUsersBcc: unsignedUsersBcc
  }
}

export async function parsePublicKeys(email) {
  try {
    const publicKey = await getPublicKey(email, accessToken);
    let publicKeyObj = new Object();
    publicKeyObj[email] = publicKey;
    return publicKeyObj;
  } catch (err) {
    console.log(err);
    return {};
  }
}

export function generatePassphrase() {
  let passphrase = forge.util.encode64(forge.random.getBytesSync(2048));
  passphrase = passphrase.substr(0, 10);
  return passphrase;
}

export async function createMimeMessage(msg) {
  var nl = "\n";
  var boundary = "__omail_secure_message__";

  let toStr = "";
  let ccStr = "";
  let bccStr = "";
  let subStr = "";

  if (msg.subject !== "") {
    subStr = `OMail Encrypted:${msg.subject}`;
  } else {
    subStr = "OMail Encrypted Message";
  }
  // format msg to 
  for (var i = 0; i < msg.to.length; i++) {
    let email = msg.to[i];
    let name = "";
    if (toStr === "") toStr += `${name}<${email}>`;
    else toStr += `,${name}<${email}>`;
  }

  for (var i = 0; i < msg.cc.length; i++) {
    let email = msg.cc[i];
    let name = "";
    if (ccStr === "") ccStr += `${name}<${email}>`;
    else ccStr += `,${name}<${email}>`;
  }

  for (var i = 0; i < msg.bcc.length; i++) {
    let email = msg.bcc[i];
    let name = "";
    if (bccStr === "") bccStr += `${name}<${email}>`;
    else bccStr += `,${name}<${email}>`;
  }

  var mimeBody = [
    "MIME-Version: 1.0",
    "To: " + toStr,
    "From: " + "" + "<" + msg.from + ">",
    "CC: " + ccStr,
    "BCC: " + bccStr,
    "Subject: " + subStr, // takes care of accented characters

    "Content-Type: multipart/mixed; boundary=" + boundary + nl,
    "--" + boundary,

    "Content-Type: text/plain; charset=UTF-8",
    msg.body + nl,
  ];

  for (var i = 0; i < msg.attachments.length; i++) {
    var attachment = [
      "--" + boundary,
      "Content-Type: " +
        msg.attachments[i].mimeType +
        '; name="' +
        msg.attachments[i].filename +
        '"',
      'Content-Disposition: attachment; filename="' +
        msg.attachments[i].filename +
        '"',
      "Content-Transfer-Encoding: base64" + nl,
      msg.attachments[i].content,
    ];

    mimeBody.push(attachment.join(nl));
  }

  mimeBody.push("--" + boundary + "--");
  const mime = mimeBody.join(nl);
  let mimeURLSafe = await btoa(mime).replace(/\+/g, "-").replace(/\//g, "_");

  return Promise.resolve(mimeURLSafe);
}


export default async function NonOMailMsg (recipient) {
  let	msg = `
Hi,

I have sent you a private email using OMail.

If you have not registered for OMail, follow these steps to view it:

Visit the address - https://omailprod.ziroh.com/nom/signup
Register using your current email address and create a new password
Post sign-up, visit - https://omailprod.ziroh.com/nom/view?type=a

If you have already registered for OMail follow these steps to view it:
Visit the address - https://omailprod.ziroh.com/nom/view
Sign in using your email address, and see my private message

P.S. Don't forget to download your free OMail from the same webpage to send private emails like me.

What is OMail?

Ziroh Labs OMail is the world's first privacy-preserving email extension built using breakthrough FHE technology.
With it, individuals can compose, send, and receive fully encrypted emails right from their Gmail platform and also perform email operations, like search without decryption.

For more information, visit the ziroh dot com website. 
`;
  
  return msg;
}
export function PassphraseFlowMsg()  {
  let msg = `
Hi,
I have sent you an encrypted email. To view the email, you need to use a PASSPHRASE that will be sent to you via some other private channel (SMS, Whatsapp, etc).
Please connect with me soon and provide me with your phone number so that I can share your PASSPHRASE to you.
After you have received your PASSPHRASE, follow the following instructions to view your encrypted email:
A. Go to https://omailprod.ziroh.com/nom/signup
B. Sign up on the website, and complete the registration process. Make sure you use this email ID for signing up.
C. After completing the registration, you will have to upload the "encryptedMail.zip" file attached to this email on the website. Therefore, download the attached file, drag and drop it to the website.
D. Enter the PASSPHRASE that you have received.
E. You will be able to view your decrypted mail. 
Since you have registered to Ziroh Mail, all future secure emails will come directly to you.
Best regards.
  `;
  return msg;
}
export function SharedKeyFlowMsg() {
  let msg = `
Hi,
I have an encrypted email for you. Please follow the following steps.
A. Go to https://omailprod.ziroh.com/nom/signup
B. Sign up on the website, and complete the registration process. Make sure you use this email ID for signing up.
C. After completing the registration, please download the "encryptedMail.zip" present in the attachment.
D. You will receive another email containing the key, please wait for the same.
Best regards.
  `;
  return msg;
}
export function KeySendMsg() {
  let msg = `
In the attachment you can find the key file to view the encrypted email sent to you. Follow the below steps to view the encrypted email.
A. Go to https://omailprod.ziroh.com/nom/view?type=a
B. Load the “encryptedMail.zip” to the site.
C. After selecting the “Share Key” option, download and load the “Key.zip” file present in the attachment.
D. Authenticate using the email Id and password used while registration.
Post that you should be able to view the encrypted email.
Best regards.
  `;
  return msg;
}
export async function setTempKeys(senderId, recipientId, tempKey) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let raw = JSON.stringify({
    senderId: senderId,
    recipientId: recipientId,
    tempKey
  });
  console.log(raw);
  let requestOpts = { method: "POST", headers: headers, body: raw, redirect: "follow" };
  let response = await fetch("https://omail.vault.ziroh.com/api/v1/omail/keys", requestOpts);
  let responseText = await response.text();
  console.log("[SET TEMP KEYS]", responseText);
  return responseText;
}

export async function setListener(from, to) {
  let headers =  new Headers();
  headers.append("Content-Type", "application/json");
  let body = JSON.stringify({
    receiverId: to,
    senderId: from
  });

  let requestOpts = { method: "POST", body: body};
  console.log("request ",requestOpts);
  let response = await fetch(
    "https://omailprod.ziroh.com/setlistener", requestOpts
  );
  return "" ;
}
