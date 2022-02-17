export const getSession = async (username) => {
  const sessionRes = await fetch(
    "https://keys.vault.ziroh.com/ss/sessions/token/" + username
  );
  const sessionToken = JSON.parse(await sessionRes.text()).Token;
  return sessionToken;
};
