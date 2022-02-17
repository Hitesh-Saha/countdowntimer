import { getFheKey} from "../vaultUtils/index";
import {getUserKey} from "../omaillibfunc/lib/crypto/keystore";
import Base64Utils from "../OMailLib/keyGenUtils/Base64Utils";
import MasterKey from "../MasterKeyFactory";
const [getMasterKey, setMasterKey, removeMasterkey] = MasterKey();
var SecureStringClient_1 = require("../Indexinglibrary/lib/SecureStringClient/SecureStringClient")
//import { getMessageKey } from "../OMailLib/keyGenUtils/";
//import getMasterKey from "../OMailLib/keyGenUtils/";
import aesMessageDecryption from "../OMailLib/cryptoDecryptionUtils/aesMessageDecryption/index";
import { AESDecrypt } from "../omaillibfunc/lib/crypto/AES";
//import { getUserPrivateKey } from "./userUtils/getUserPrivateKey";
console.log("Indexing Logic")
//export const api = "https://omailprod.ziroh.com";
//export const baseIndexUrl = "https://index.vault.ziroh.com/api/v1";
const api =  "https://index.vault.ziroh.com/api/v2"//v2
const insertIndexURL = api + "/index";
const deleteIndexURL = api + "/index";
const serachIndexURL = api + "/search";
let forge=require('node-forge')

const gmailMessageQueryURL =
  "https://outlook.office.com/api/v2.0/me/messages/"//+Office.context.mailbox.convertToRestId(Office.context.mailbox.item.itemId,Office.MailboxEnums.RestVersion.v2_0)";

//const searchDecryptor = require("./decryptor").searchDecryptor;
//var KeyGenerate_1 = require("../Indexinglibrary/lib/KeyGen/KeyGenerate")


var user = "";

export const setUser = (usr) => {
  user = usr;
};


const getValidToken = async () => {
console.log("Get Valid Token Logic")
};

const fhePreprocessing = (text) => {
  console.log((text))
  const txt = text.toLowerCase();
  const stopWords = {
    i: true,
    me: true,
    my: true,
    myself: true,
    we: true,
    our: true,
    ours: true,
    ourselves: true,
    you: true,
    your: true,
    yours: true,
    yourself: true,
    yourselves: true,
    he: true,
    him: true,
    his: true,
    himself: true,
    she: true,
    her: true,
    hers: true,
    herself: true,
    it: true,
    its: true,
    itself: true,
    they: true,
    them: true,
    their: true,
    theirs: true,
    themselves: true,
    what: true,
    which: true,
    who: true,
    whom: true,
    this: true,
    that: true,
    these: true,
    those: true,
    am: true,
    is: true,
    are: true,
    was: true,
    were: true,
    be: true,
    been: true,
    being: true,
    have: true,
    has: true,
    had: true,
    having: true,
    do: true,
    does: true,
    did: true,
    doing: true,
    a: true,
    an: true,
    the: true,
    and: true,
    but: true,
    if: true,
    or: true,
    because: true,
    as: true,
    until: true,
    while: true,
    of: true,
    at: true,
    by: true,
    for: true,
    with: true,
    about: true,
    against: true,
    between: true,
    into: true,
    through: true,
    during: true,
    before: true,
    after: true,
    above: true,
    below: true,
    to: true,
    from: true,
    up: true,
    down: true,
    in: true,
    out: true,
    on: true,
    off: true,
    over: true,
    under: true,
    again: true,
    further: true,
    then: true,
    once: true,
    here: true,
    there: true,
    when: true,
    where: true,
    why: true,
    how: true,
    all: true,
    any: true,
    both: true,
    each: true,
    few: true,
    more: true,
    most: true,
    other: true,
    some: true,
    such: true,
    no: true,
    nor: true,
    not: true,
    only: true,
    own: true,
    same: true,
    so: true,
    than: true,
    too: true,
    very: true,
    s: true,
    t: true,
    can: true,
    will: true,
    just: true,
    don: true,
    should: true,
    now: true,
  };
  const cleanText = txt
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/[ \s ,]/g)
    .filter(Boolean)
    .filter((word) => !stopWords[word]);
  return stemmer(Array.from(new Set(cleanText)));
};

const stemmer = (text) => {
  const stemmer = require("porter-stemmer").stemmer;
  const stemText = text.map((word) => stemmer(word));
  return stemText;
};

//SEARCH HTML
// const gmailSearch = (e) => {
//   const subject = e;
//   let searchElement;
//   let searchButton;
//   if (document.querySelectorAll('input[aria-label="Search mail"]').length) {
//     searchElement = document.querySelectorAll(
//       'input[aria-label="Search mail"]'
//     )[0];
//     searchButton = document.querySelectorAll(
//       'button[aria-label="Search mail"]'
//     )[0];
//   } else {
//     searchElement = document.querySelectorAll(
//       'input[aria-label="Search all conversations"]'
//     )[0];
//     searchButton = document.querySelectorAll(
//       'button[aria-label="Search all conversations"]'
//     )[0];
//   }
//   searchElement.value = subject;
//   searchButton.click();
//   document.querySelector(".search__elements").classList.toggle("hide");
//   document.querySelector(".search__window").classList.toggle("minimize");
// };


//TO INDEX WHEN OPENING RECIVED MSG
// export const setRecieverIndex = async (recieverId, messageId) => {
//   if (recieverId) {
//     var fhekey = await getDetails(user);
//     console.log(
//       aesMessageDecryption(
//         userKey,
//         JSON.parse(iv),
//         fhekey.KeyRecords[0].ResourceKey
//       )
//     );
//     var client = new SecureStringClient_1.SecureStringClient(fhekey);

//     let token = await getValidToken();

//     var myHeaders = new Headers();
//     myHeaders.append("authorization", "Bearer " + token);
//     var requestOptions = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };
//     const msgDetails = await fetch(
//       gmailMessageQueryURL + messageId + "?format=full",
//       requestOptions
//     );

//     const jsonMsgDetails = await msgDetails.json();

//     const body = atob(jsonMsgDetails.payload.body.data);
//     var subject;
//     console.log(body);

//     jsonMsgDetails.payload.headers.forEach(async (header) => {
//       if (header.name === "Subject") {
//         const sub = header.value;
//         subject = sub.split(":")[1];
//       }
//     });
//     const parts = jsonMsgDetails.payload.parts;
//     for (let i = 0; i < parts.length; i++) {
//       if (parts[i].filename === "key.om") {
//         const attachmentID = parts[i].body.attachmentId;
//         const attachmentRes = await fetch(
//           "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
//             ele.fileId +
//             "/attachments/" +
//             attachmentID,
//           {
//             method: "get",
//             headers: {
//               Authorization: "Bearer " + token,
//             },
//           }
//         );
//         const attachmentData = JSON.parse(await attachmentRes.text()).data;
//         const keyStruct = JSON.parse(
//           atob(attachmentData.replace("-", "+").replace("_", "/"))
//         );
//         const iv = keyStruct.iv;
//         const privateKey = await getUserPrivateKey(user);
//         await getMessageKey(privateKey, keyStruct.k);
//         const decSub = await searchDecryptor(subject, window.messageKey, iv);
//         const decBody = await searchDecryptor(
//           body.replace(/-/g, "+").replace(/_/g, "/"),
//           window.messageKey,
//           iv
//         );

//         const obj = { subject: decSub, body: decBody };
//         let stemmedEntries = [];
//         for (const [key, value] of Object.entries(obj)) {
//           if (value !== "")
//             stemmedEntries = stemmedEntries.concat(
//               fhePreprocessing(value).filter(
//                 (item) => stemmedEntries.indexOf(item) < 0
//               )
//             );
//         }

//         const encryptedStemmer = stemmedEntries.map((entry) => {
//           return client.encrypt(entry);
//         });

//         fetch(insertIndexURL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           redirect: "follow",
//           body: JSON.stringify({
//             documentId: `${messageId}`,
//             iv: "iv",
//             uniqueWords: encryptedStemmer,
//             userId: window.document.title.split(" - ")[1],
//           }),
//         }).catch((err) => alert(err));
//       }
//     }
//   }
// };

const emailExtractor = (inpArr) => {
  const emailArr = [];
  inpArr.forEach((ele) => {
    emailArr.push(ele.email);
  });
  return emailArr.join(" ");
};

//DISPLAYS MAIL IN SEARCH WINDOW
// const elementDisplay = async (msgObj) => {
//   const subject = msgObj.subject;
//   const dateArr = new Date(msgObj.time).toDateString().split(" ");
//   const child = document.createElement("div");
//   child.innerHTML = `<div style="flex-direction: row;gap: 10px;">
//                             <div>
//                                 <span style="display: flex;font-size: 14px;font-weight: 700; margin-bottom: 0.5%;">${subject}</span>
//                                 <span style="display: flex;color: rgb(95, 99, 104);font-weight: 100;font-size: small;">${[
//                                   msgObj.to,
//                                   msgObj.cc,
//                                   msgObj.bcc,
//                                 ]
//                                   .filter((ele) => {
//                                     return ele !== "";
//                                   })
//                                   .join(" ,")}</span>
//                             </div>
//                             </div>
//                             <span style="font-family: unset;justify-content: flex-end;color: #5f6368;">${
//                               dateArr[1] + " " + dateArr[2] + ", " + dateArr[3]
//                             }</span>`;
//   child.setAttribute("gmail-subject", msgObj.encSub);
//   child.onclick = (e) => {
//     e.stopImmediatePropagation();
//     gmailSearch(msgObj.encSub);
//   };
//   child.querySelectorAll("*").forEach((ele) => {
//     ele.onclick = (e) => {
//       e.stopImmediatePropagation();
//       gmailSearch(msgObj.encSub);
//     };
//   });
//   document.querySelector(".result__elements").appendChild(child);
//   if (document.querySelector(".search__loader").classList.contains("show"))
//     document.querySelector(".search__loader").classList.toggle("show");
// };

const messageDataExtractor = (data) => {
  let messageData;
    messageData =
     {
      // to: data.to,
      // cc: data.cc,
      // bcc: data.bcc,
      subject: data.subject,
      body: data.body,
     }
    return (messageData);
};

const getDetails = async (userId,MasterK) => {
  const userKeyRes = await getUserKey(userId);
  const iv = userKeyRes.KeyRecords[0].SymKeyIV;
  const uK = userKeyRes.KeyRecords[0].ResourceKey;
  
  let masterKey=MasterK
 
  console.log(masterKey)
  console.log(iv);
  console.log(uK);
  const userKey =await AESDecrypt(forge.util.decode64(masterKey),forge.util.decode64(iv),JSON.stringify(uK));
  console.log(userKey)
  const res = await getFheKey(userId);
  let fhekey =res;//.KeyRecords[0].ResourceKey;
  console.log(fhekey)
  fhekey =await AESDecrypt(forge.util.decode64(userKey),forge.util.decode64(iv), (fhekey));
  fhekey={"key":fhekey.split(',')}
  fhekey.key = new Uint8Array(fhekey.key);
  return (fhekey);
};

// export const indexReply = async (messageId, user, reply) => {
//   const bodyDiv = document.createElement("div");
//   bodyDiv.innerHTML = reply.body;
//   const obj = {
//     to: emailExtractor(reply.recipients.to),
//     cc: emailExtractor(reply.recipients.cc),
//     bcc: emailExtractor(reply.recipients.bcc),
//     subject: window.decryptedSubject,
//     body: bodyDiv.textContent,
//   };

//   console.log(obj, "stemmer");
//   let stemmedEntries = [];
//   for (const [key, value] of Object.entries(obj)) {
//     if (value !== "")
//       stemmedEntries = stemmedEntries.concat(
//         fhePreprocessing(value).filter(
//           (item) => stemmedEntries.indexOf(item) < 0
//         )
//       );
//   }

//   var fhekey = await getDetails(user);
//   var client = new SecureStringClient_1.SecureStringClient(fhekey);

//   const encryptedStemmer = stemmedEntries.map((entry) => {
//     return client.encrypt(entry);
//   });

//   console.log(encryptedStemmer);

//   await fetch(insertIndexURL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     redirect: "follow",
//     body: JSON.stringify({
//       documentId: `${messageId}`,
//       iv: "iv",
//       uniqueWords: encryptedStemmer,
//       userId: user,
//     }),
//   }).catch((err) => alert(err));

//   return Promise.resolve(true);
// };

export const indexMessageData = async (messageId, user,data,MasterK) => {
  const obj = await messageDataExtractor(data);
  console.log(obj, "stemmer");
  let stemmedEntries = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== "")
    //console.log(value)
      stemmedEntries = stemmedEntries.concat(
        fhePreprocessing(value).filter(
          (item) => stemmedEntries.indexOf(item) < 0
        )
      );
  }

  console.log(stemmedEntries);

  var fhekey = await getDetails(user,MasterK);
  var client = new SecureStringClient_1.SecureStringClient(fhekey);
  const encryptedStemmer = stemmedEntries.map((entry) => {
    return client.encrypt(entry);
  });

  console.log(encryptedStemmer);

  //console.log("OMail Encrypted:"+messageId)
  await fetch(insertIndexURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      documentId: `${messageId}`,

      words: encryptedStemmer,
      userId: user,
      // body: JSON.stringify({
      //   documentId: ${messageId},
      //   words: encryptedStemmer,
      //   userId: user,
      // }),
    }),
  }).catch((err) => alert(err));

  return Promise.resolve(true);
};

export const searchMail = async (input, usr,MasterK) => {
  var user = usr;
  let token = await getValidToken();

  // document.querySelector(".result__elements").innerHTML = "";
  // if (!document.querySelector(".search__loader").classList.contains("show"))
  //   document.querySelector(".search__loader").classList.toggle("show");
  const fheKey = await getDetails(usr,MasterK);
  var client = new SecureStringClient_1.SecureStringClient(fheKey);
  const stemmed_input = fhePreprocessing(input);
  console.log(stemmed_input);
  const queryString = client.encrypt(stemmed_input[0]);

  //console.log(queryString)
  
  const res = await fetch(serachIndexURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      searchTerms: [`${queryString}`],
      userId: user,
    }),
  });

  const queryResult = await res.json();
  var currentFileId = "";

  if (queryResult.documents.length === 0) {
    // document.querySelector(".result__elements").innerHTML =
    //   "No Result available";
    // if (document.querySelector(".search__loader").classList.contains("show"))
    //   document.querySelector(".search__loader").classList.toggle("show");

    return "No Result";
  }
return queryResult
}