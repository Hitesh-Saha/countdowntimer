const authRequested = (user) =>
  new Promise((res) => {
    window.onmessage = (event) => {
      if (event.data.from === "module_content_script") {
        res(event.data.token);
      }
    };

    console.log("requesting_auth");
    window.postMessage({ text: "module_auth_requested", user });
  });

const getAuthToken = async (user) => {
  const token = await authRequested(user);
  return Promise.resolve(token);
};

export default getAuthToken;
