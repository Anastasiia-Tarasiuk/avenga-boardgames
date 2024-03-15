import {onAuthStateChanged} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {auth, db} from "./login";

const checkbox = document.querySelector(".header-checkbox");
const themeEl = document.querySelector(".switch");
const body = document.querySelector("body");
const burgerEl = document.querySelector(".burger-button");

const theme = localStorage.getItem("theme");

if (theme) {
    if (theme === "light") {
        checkbox.setAttribute("checked", "");
        body.classList.add("light");
    } else {
        body.classList.add("dark");
        checkbox.removeAttribute("checked");
    }
}

checkbox.addEventListener("click", e => setTheme(e));
burgerEl.addEventListener("click", e => showModalMenu(e));
function setTheme(e) {
    const slider = e.currentTarget;

    if (slider.hasAttribute("checked")) {
        slider.removeAttribute("checked");
        body.classList.remove("light");
        body.classList.add("dark");
        setChangedThemeToStore("dark");
    } else {
        slider.setAttribute("checked", "");
        body.classList.add("light");
        body.classList.remove("dark");
        setChangedThemeToStore("light");
    }
}

onAuthStateChanged(auth, async user => {
    if (user) {
        themeEl.classList.remove("hidden");
    }
});

async function setChangedThemeToStore(theme) {
    const userId = localStorage.getItem("userId");
    const userRef = doc(db, `users/${userId}/user`, userId);

    try {
        await updateDoc(userRef, {
            theme: `${theme}`
        });
        localStorage.setItem("theme", `${theme}`);
    } catch (e) {
        console.error("Error changing theme: ", e);
    }
}

function showModalMenu(e) {
    const burger = e.currentTarget;

    if (body.clientWidth < 768) {
        if (burger.classList.contains("is-open")) {
            burger.classList.remove("is-open");
        } else {
            burger.classList.add("is-open");
        }
    }
}