import firebase from "firebase";

const config = {
    apiKey: "AIzaSyBlEuUknBSiQLrO7PD-ZuseqBejN-LTyBw",
    authDomain: "psycho-app-uandes.firebaseapp.com",
    databaseURL: "https://psycho-app-uandes.firebaseio.com",
    projectId: "psycho-app-uandes",
    storageBucket: "psycho-app-uandes.appspot.com",
    messagingSenderId: "208994760804"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
