// ====== PROD ======
const PROD_URL = "https://transparent-supply-chain-server.onrender.com";

// ====== LOCAL ======
// ⚠️ MUST be laptop IP, not localhost
//const LOCAL_URL = "http://10.36.32.192:5000";
const LOCAL_URL = "http://localhost:5000";
// ====== AUTO SWITCH ======
// __DEV__ = true when running Expo locally
export const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;

// ====== OPTIONAL HELPER ======
export const API = (path: string) => `${BASE_URL}${path}`;
