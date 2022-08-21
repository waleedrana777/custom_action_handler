import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

var app = null;
var auth = null;

try {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    };
    if (!app) {
        app = initializeApp(firebaseConfig);
    }
    auth = getAuth(app);
}
catch (error) {
    console.log(error.message);
}

export {
    auth,
};