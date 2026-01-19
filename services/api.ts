const PROD_URL = 'https://transparent-supply-chain-server.onrender.com';

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || PROD_URL;

// optional helper
export const API = (path: string) => `${BASE_URL}${path}`;
