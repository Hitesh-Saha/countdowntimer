import { authorizationToken } from "../token";
import { getSession } from "../sessions/getSession";
import { keyStoreBaseApi } from "./api";
import { getKeyRecordByResourceId } from "../../omaillibfunc/lib/crypto/keystore";


const getPrivateKey = async (username) => {
  try{
//   const session = await getSession(username);

//   var myHeaders = new Headers();
//   myHeaders.append("Authorization", "Bearer " + authorizationToken);
//   myHeaders.append("SessionId", session);
//   myHeaders.append("UserId", username);

//   var requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow",
//   };

//   const response = await fetch(
//     `${keyStoreBaseApi}resource/privateKey_` + username,
//     requestOptions
//   );

//   const result = await response.json();
//   console.log(result);

//   return result;
// };
let response = await getKeyRecordByResourceId('org1', username, 'privateKey');
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export { getPrivateKey };
