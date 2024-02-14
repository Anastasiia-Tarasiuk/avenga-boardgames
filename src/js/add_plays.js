import {getAuth, onAuthStateChanged} from "firebase/auth";
import {auth, db} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import debounce from 'lodash.debounce';

const gameToScoreEl = document.querySelector(".game-to-score");
const addPlayerModalOverlay = document.querySelector(".add-player-modal-overlay");
const submitFormButtonEl = document.querySelector("button[type='submit']");
const playerSelectEl = document.querySelector("#player-select");
const closePlayerModalButtonEl = document.querySelector(".close-player-modal");
const playsEl = document.querySelector(".plays");
const dateEl = document.querySelector(".date");

playerSelectEl.addEventListener('change', e => addNewPlayer(e));
closePlayerModalButtonEl.addEventListener("click", closePlayerModal);
submitFormButtonEl.addEventListener("click", (e) => submitPlayerForm(e));

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const sessionId = Date.now();

onAuthStateChanged(auth, async user => {
    if (user) {
        const q = query(collection(db, `users/${user.uid}/games`), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            gameTemplate(doc.data());
            renderPlayers(user.uid);
        });
    }
});

function gameTemplate(game) {
    gameToScoreEl.innerHTML =`<div><p>${game.name}</p><img class="thumbnail" src=${game.url}></div>`
}

async function renderPlayers(userId) {
    const q = query(collection(db, `users/${userId}/players`));
    const querySnapshot = await getDocs(q);

    [...playerSelectEl.children].forEach(child => {
        if (child.value !== "") {
            if (child.value !== "new-player") {
                child.remove();
            }
        }
    })

    querySnapshot.forEach((doc) => {
        createPlayer(doc.data())
    });
}

function createPlayer(player) {
    if (player.hidden !== true) {
        const option = document.createElement("option");
        option.innerHTML = player.name;
        option.setAttribute("value", player.name);
        option.dataset.id = player.id;
        playerSelectEl.firstElementChild.after(option);
    }
}

function addNewPlayer(e) {
    const select = e.target;
    const value = select.value;

    if (value === "new-player") {
        addPlayerModalOverlay.classList.remove('hidden');
    } else {
        if (value !== "") {
            [...select.children].forEach(option => {
                if (option.selected) {
                    select.dataset.id = option.dataset.id;
                }
            })

            let shouldBeRendered = true;
            const playsLabel = document.createElement("label");
            playsLabel.setAttribute("player-name", value);
            playsLabel.innerHTML = `${value}<input type="number" id=${select.dataset.id} name=${value} value="0">`;

            if (playsEl.children.length > 0) {
                for (const label of [...playsEl.children]) {
                    if (label.getAttribute("player-name") === value) {
                        shouldBeRendered = false;
                        Notify.failure(`Player ${name} was already added`);
                        return;
                    }
                }

                if (shouldBeRendered) {
                    playsEl.insertAdjacentElement("beforeend", playsLabel);
                    playsLabel.querySelector("input").addEventListener("keydown", debounce(e => setScore(e), 700));
                }
            } else {
                playsEl.insertAdjacentElement("beforeend", playsLabel);
                playsLabel.querySelector("input").addEventListener("keydown", debounce(e => setScore(e), 700));
            }
        }
    }
}

async function submitPlayerForm(e) {
    const auth = getAuth();
    const user = auth.currentUser;

    e.preventDefault();
    const submitButton = e.currentTarget;
    const form = submitButton.parentElement;
    const formData = new FormData(submitButton.parentElement, submitButton);
    let name = null;

    for (const [key, value] of formData) {
        if (key === "name") {
            name = value.trim();
        }
    }

    if (name.length > 0) {
        const q = query(collection(db, `users/${user.uid}/players`), where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const player = {
                name,
                id: Date.now(),
                hidden: false
            }
            addPlayerToPlayers(user.uid, player);
            renderPlayers(user.uid);
            form.reset();
            closePlayerModal();
        } else {
            Notify.failure(`Player with name ${name} already exists`);
        }
    } else {
        Notify.failure(`Name field shouldn't be empty`);
    }
}

function closePlayerModal() {
    playerSelectEl.firstElementChild.setAttribute("selected", "");
    addPlayerModalOverlay.classList.add('hidden');
}

async function addPlayerToPlayers(userId, player) {
    const dateId = Date.now().toString();
    player.documentId = dateId;

    try {
        await setDoc(doc(collection(db, `users/${userId}/players`), dateId), player);
        Notify.success('The player is added successfully');
    } catch (e) {
        console.error("Error adding player: ", e);
    }
}

async function setScore(e) {
    const option = e.target;
    const play = {
        date: dateEl.value,
        playerId: option.id,
        score: option.value,
        gameId: id,
        sessionId: sessionId
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const playsRef = collection(db, `users/${user.uid}/plays`);

    try {
        await setDoc(doc(playsRef), play);
        Notify.success('The score is added successfully');
    } catch(e){
        console.error("Error adding score: ", e);
    }
}