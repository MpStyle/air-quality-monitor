import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const getAuthenticationData = () => {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
    };
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const firebaseAppAuth = firebaseApp.auth();
    const providers = {
        googleProvider: new firebase.auth.GoogleAuthProvider(),
    };

    return {
        firebaseAppAuth,
        providers
    };
};