const deletePassphrase = (user, id) => {

  return new Promise((res, rej) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
  
    fetch(
      "https://omail.vault.ziroh.com/api/v1/omail/pp/" + user + "?msgId=" + id,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => res(true))
      .catch((error) => res(false));
  })

  
};

export default deletePassphrase;
