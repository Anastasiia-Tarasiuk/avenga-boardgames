import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const firebaseConfig = {
    apiKey: "AIzaSyDfHEoFiYmKRqd8-ktFcO7zg3QLGxAViQc",
    authDomain: "board-games-saver.firebaseapp.com",
    projectId: "board-games-saver",
    storageBucket: "board-games-saver.appspot.com",
    messagingSenderId: "169567859472",
    appId: "1:169567859472:web:e0c9f6634ae06726902b95",
    measurementId: "G-F504L5EW8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const menuContainerEl = document.querySelector(".menu-container");
const loginMenuEl = document.querySelector(".login-menu");
const menuEl = document.querySelector(".menu");
const addGameButtonEl = document.querySelector(".add-game");
const loginButtonEl = document.querySelector(".signin-button");
const signupButtonEl = document.querySelector(".signup-button");
const logoutButtonEl = document.querySelector(".logout-button");
const modalOverlayEl = document.querySelector(".login-modal-overlay");
const loginFormEl = modalOverlayEl.querySelector("[id='login-form']");
const signupFormEl = modalOverlayEl.querySelector("[id='signup-form']");
const googleButtonEls = modalOverlayEl.querySelectorAll(".google-button");
const closeModalButtonEls = modalOverlayEl.querySelectorAll(".close-modal");
const submitFormButtonsEl = modalOverlayEl.querySelectorAll("button[type='submit']");

loginButtonEl.addEventListener("click", (e) => showModal(e));
signupButtonEl.addEventListener("click", (e) => showModal(e));
logoutButtonEl.addEventListener("click", logout)
closeModalButtonEls.forEach(btn => btn.addEventListener("click", closeModal));
submitFormButtonsEl.forEach(btn => btn.addEventListener("click", (e) => submitForm(e)));
googleButtonEls.forEach(btn => btn.addEventListener("click", (e) => loginWithGoogle(e)));

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      showMenu();
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      hideMenu();
    }
});

function showModal(e) {
    const button = e.currentTarget;
    modalOverlayEl.classList.remove('hidden');

    if (button.classList.contains("signin-button")) {
        signupFormEl.style.display = "none";
        loginFormEl.style.display = "flex";
    } else {
        signupFormEl.style.display = "flex";
        loginFormEl.style.display = "none";
    }
}

function closeModal() {
    modalOverlayEl.classList.add('hidden');
}

function submitForm(e) {
    e.preventDefault();
    const submitButton = e.currentTarget;
   
    const formData = new FormData(submitButton.parentElement, submitButton);

    let email = null;
    let password = null;
    let passwordConfirmation = null;

    for (const [key, value] of formData) {
        switch (key) {
            case "email":
                email = value.trim();
                break;
            case "password":
                password = value.trim();
                break;
            case "password-confirmation":
                passwordConfirmation = value.trim();
                break;
        }
    }   

    if (submitButton.dataset.action === "login-submit-btn") {
        if (validation(email, password)) {
            // Sign in
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                Notify.success('Successfully signed in');
                // Signed in 
                const user = userCredential.user;
                closeModal();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Notify.failure('Sorry, something went wrong');
            });
        }
    }

    if (submitButton.dataset.action === "signup-submit-btn") {
        if (password !== passwordConfirmation) {
            Notify.failure('Password doesn\'t match');
            return;
        } else if (validation(email, password)) {
            // Sign up new users
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                Notify.success('Successfully signed up');
                // Signed up 
                const user = userCredential.user;
                closeModal();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Notify.failure('Sorry, something went wrong');
            });
        }
    }
}

function loginWithGoogle(e) {
    const button = e.currentTarget;
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            if (button.dataset.action === "login-google-btn") {
                Notify.success('Successfully signed in');
            } else {
                Notify.success('Successfully signed up');
            }
            
            closeModal();
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            Notify.failure('Sorry, something went wrong');
        });
}




function showMenu() {
    loginMenuEl.classList.add("hidden");
    menuEl.classList.remove("hidden");
    addGameButtonEl.classList.remove("hidden")
}

function hideMenu() {
    loginMenuEl.classList.remove("hidden");
    menuEl.classList.add("hidden");
    addGameButtonEl.classList.add("hidden");
}

function validation(email, password) {
    if (!email || !password) {
        Notify.failure('Email or password is empty');
        return;
    }

    if (password.length < 6) {
        Notify.failure('Password length should be at least 6 symbols');
        return;
    }

    if (!email.includes("@")){
        Notify.failure('Email is not valid');
        return;
    }

    return true;
}

function logout() {
    signOut(auth)
        .then(res => {
            Notify.success('Successfully signed out');
        })
        .catch(err => {
            console.error(err);
            Notify.failure('Sorry, something went wrong');
        })
}