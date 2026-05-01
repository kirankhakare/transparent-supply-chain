// ====== ENV (FIRST PRIORITY) ======
const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

// ====== PROD ======
const PROD_URL = "https://transparent-supply-chain-server.onrender.com";

// ====== LOCAL ======
const LOCAL_URL = "http://localhost:5000"; 
// (use IP if testing on real device)

// ====== FINAL BASE URL ======
export const BASE_URL =
  ENV_URL || (__DEV__ ? LOCAL_URL : PROD_URL);

// ====== HELPER ======
export const API = (path: string) => `${BASE_URL}${path}`;