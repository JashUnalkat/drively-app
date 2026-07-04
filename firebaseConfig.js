import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCBy3BOF6uuQwkgwic9g_3fqv6FseJ_v9k',
  authDomain: 'info5139-finalproject.firebaseapp.com',
  databaseURL: 'https://info5139-finalproject-default-rtdb.firebaseio.com',
  projectId: 'info5139-finalproject',
  storageBucket: 'info5139-finalproject.firebasestorage.app',
  messagingSenderId: '787927259564',
  appId: '1:787927259564:web:3a4d149bd7f98a7cce8209',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

export { firebase, auth, db, rtdb };
export default firebase;