import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
};

const app = initializeApp(config);
const auth = getAuth(app);

export {
    auth
};