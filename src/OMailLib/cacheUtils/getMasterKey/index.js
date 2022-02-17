import CACHE_NAME from "../cacheName";

const getMasterKey = async () => {
  const cache = await caches.open(CACHE_NAME);
  const res = await cache.match("/omKey");
  return JSON.parse(await res.text());
};

export default getMasterKey;
