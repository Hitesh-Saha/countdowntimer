import { authorizationToken } from "../token";
import { getSession } from "../sessions/getSession";
import { keyStoreBaseApi } from "./api";
import { getKeyRecordByResourceId } from "../../omaillibfunc/lib/crypto/keystore";


const getPublicKey = async (username) => {
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
    //   `${keyStoreBaseApi}resource/publicKey_` + username,
    //   requestOptions
//     ).catch((err) => {
//       throw err;
//     });

//     const result = await response.json();

//     return result;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
let response = await getKeyRecordByResourceId('org1', username, 'publicKey');
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export { getPublicKey };
