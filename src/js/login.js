import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {getFirestore, doc, setDoc} from "firebase/firestore";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {getRefs} from "./constants";

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
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

const loginMenuEl = document.querySelector(".login-menu");
const menuEl = document.querySelector(".menu");
const addGameButtonEl = document.querySelector(".add-game");
const loginButtonEl = document.querySelector(".signin-button");
const signupButtonEl = document.querySelector(".signup-button");
const logoutButtonEl = document.querySelector(".logout-button");
const modalOverlayEl = document.querySelector(".login-modal-overlay");
const loginFormEl = document.querySelector("[id='login-form']");
const signupFormEl = document.querySelector("[id='signup-form']");
const googleButtonEls = document.querySelectorAll(".google-button");
const closeLoginModalButtonEls = document.querySelectorAll(".close-login-modal");

if (modalOverlayEl) {
    const submitFormButtonsEl = modalOverlayEl.querySelectorAll("button[type='submit']");
    submitFormButtonsEl.forEach(btn => btn.addEventListener("click", (e) => submitLoginForm(e)));
    const seePasswordEl = modalOverlayEl.querySelectorAll(".svg-icon");
    seePasswordEl.forEach(icon => icon.addEventListener("click", e => seePassword(e)));
}


loginButtonEl.addEventListener("click", (e) => showModal(e));
signupButtonEl.addEventListener("click", (e) => showModal(e));
logoutButtonEl.addEventListener("click", logout);
closeLoginModalButtonEls.forEach(btn => btn.addEventListener("click", closeLoginModal));
googleButtonEls.forEach(btn => btn.addEventListener("click", (e) => loginWithGoogle(e)));

onAuthStateChanged(auth, (user) => {
    if (user) {
      showMenu();
    } else {
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

function closeLoginModal() {
    modalOverlayEl.classList.add('hidden');
}

function submitLoginForm(e) {
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
                Notify.success(`Successfully signed in`);
                localStorage.setItem("userId", userCredential.user.uid);
                closeLoginModal();
            })
            .catch((error) => {
                console.error(error);
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
                localStorage.setItem("userId", user.uid);
                setUserDataToStorage(user);
                closeLoginModal();
            })
            .catch((error) => {
                console.error(error);
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
                setUserDataToStorage(user);
            }

            localStorage.setItem("userId", user.uid);

            closeLoginModal();

        })
        .catch((error) => {
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

    if (addGameButtonEl) {
        addGameButtonEl.classList.remove("hidden");
    }
}

function hideMenu() {
    loginMenuEl.classList.remove("hidden");
    menuEl.classList.add("hidden");
    
    if (addGameButtonEl) {
        addGameButtonEl.classList.add("hidden");
    }
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

    if (password.length > 16) {
        Notify.failure('Password length should be less 17 symbols');
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
            localStorage.removeItem("userId");
            window.location.pathname = "../../index.html";
            Notify.success('Successfully signed out');
        })
        .catch(err => {
            console.error(err);
            Notify.failure('Sorry, something went wrong');
        })
}

async function setUserDataToStorage(user) {
    try {
        await setDoc(doc(getRefs(user.uid).user, user.uid), {
            id: user.uid,
            email: user.email,
            name: user.displayName || "User",
            theme: "light",
        })

        await setDoc(doc(getRefs(user.uid).players), {
            id: user.uid,
            name: user.displayName || "You",
            hidden: false,
        })

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function seePassword(e) {
    const icon = e.currentTarget;
    const input = icon.nextElementSibling;

    if (icon.classList.contains("visible")) {
        icon.classList.remove("visible");
        input.setAttribute("type", "password");
    } else {
        icon.classList.add("visible");
        input.setAttribute("type", "text");
    }
}