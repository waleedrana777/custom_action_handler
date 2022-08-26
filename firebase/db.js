import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
    auth,
};