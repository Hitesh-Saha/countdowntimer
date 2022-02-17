import { authorizationToken } from "../token";
import userManagementBaseApi from "./api";

const checkUser = async (username) => {
  console.log("checkUser")
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + authorizationToken);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    userManagementBaseApi + username,
    requestOptions
  );
  const result = await response.json();
  console.log(result, username);
  return result;
};

export default checkUser;
