import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { getFirestore, collection, doc, setDoc} from "firebase/firestore";
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
}


loginButtonEl.addEventListener("click", (e) => showModal(e));
signupButtonEl.addEventListener("click", (e) => showModal(e));
logoutButtonEl.addEventListener("click", logout)
closeLoginModalButtonEls.forEach(btn => btn.addEventListener("click", closeLoginModal));

googleButtonEls.forEach(btn => btn.addEventListener("click", (e) => loginWithGoogle(e)));

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      showMenu();
      // const uid = user.uid;

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
                Notify.success('Successfully signed in');
                // Signed in
                const user = userCredential.user;
                // userData.id = user.uid;
                // userData.email = user.email;
                // userData.createdAt = user.metadata.creationTime;
                // userData.name = "User";

                closeLoginModal();
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
                setUserDataToStorage(user);

                closeLoginModal();
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
                setUserDataToStorage(user);
            }

            closeLoginModal();
            // IdP data available using getAdditionalUserInfo(result)
            // ...
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

    if (!email.includes("@")){
        Notify.failure('Email is not valid');
        return;
    }

    return true;
}

function logout() {
    //todo change logic!!!
    const main = document.querySelector("main");
    signOut(auth)
        .then(res => {
            const url = window.location.href;

            if (!url.includes("index.html")) {
                const urlArray = url.split("/");
                let newUrl = "";

                urlArray.forEach((item, index) => {
                    if (index === urlArray.length - 1) {
                        item = "index.html"
                    }

                    newUrl += `${item}/`;
                })

                window.location.replace(newUrl.substring(0, newUrl.length - 1));
            }

            main.querySelector(".container").innerHTML = "Please sign in or sign up"
            Notify.success('Successfully signed out');
        })
        .catch(err => {
            console.error(err);
            Notify.failure('Sorry, something went wrong');
        })
}

async function setUserDataToStorage(user) {
    try {
        const usersRef = collection(db, "users");

        await setDoc(doc(usersRef, user.uid), {
            user: {
                id: user.uid,
                email: user.email,
                name: user.displayName || "User",
                createdAt: user.metadata.creationTime
            },
            players: [
                {
                    id: user.uid,
                    name: user.displayName || "You"
                }
            ],
            plays: []
        })
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}