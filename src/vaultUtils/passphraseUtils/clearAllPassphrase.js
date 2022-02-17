const clearAllPassphrase = (user) => {
  var requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };
  fetch( "https://omail.vault.ziroh.com/api/v1/omail/pp/"+user, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export default clearAllPassphrase;
