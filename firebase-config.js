// Your web app's Firebase configuration
const firebaseConfig = {
  // You'll need to replace these with your Firebase project credentials
  apiKey: "AIzaSyD37wbCR06jeODwl36bUO5jRUB6z3sevYU",
  authDomain: "collegehub-5fc0b.firebaseapp.com",
  projectId: "collegehub-5fc0b",
  storageBucket: "collegehub-5fc0b.firebasestorage.app",
  messagingSenderId: "414624999010",
  appId: "1:414624999010:web:b4dbd496be68a426b1133b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Add authentication state observer
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'No user');
    if (user) {
        handleSuccessfulAuth(user);
    }
});

// Initialize Firebase Firestore and get a reference to the service
const db = firebase.firestore(); 