import { keyStoreBaseApi } from "./api";
import { authorizationToken } from "../token";
import { getSession } from "../sessions/getSession";
import { getKeyRecordByResourceId } from "../../omaillibfunc/lib/crypto/keystore";

const getUserKey = async (username) => {
  try {
  // const session = await getSession(username);

  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", "Bearer " + authorizationToken);
  // myHeaders.append("SessionId", session);
  // myHeaders.append("UserId", username);

  // var requestOptions = {
  //   method: "GET",
  //   headers: myHeaders,
  //   redirect: "follow",
  // };

  // const response = await fetch(
  //   `${keyStoreBaseApi}resource/userKey_` + username,
  //   requestOptions
  // );
  // const result = await response.json();

  // return result;
  let response = await getKeyRecordByResourceId('org1', username, 'userKey');
  return response; 
} catch (err) {
  console.log(err);
  return null;
}
}


export {getUserKey} 