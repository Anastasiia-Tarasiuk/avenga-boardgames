import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {doc, getDocs, query, setDoc, where} from "firebase/firestore";
import debounce from 'lodash.debounce';
import {getRefs, closeModal, opts} from "./constants";
import {Spinner} from 'spin.js';

const gameToScoreEl = document.querySelector(".game-to-score");
const addPlayerModalOverlay = document.querySelector(".add-player-modal-overlay");
const submitFormButtonEl = document.querySelector("button[type='submit']");
const playerSelectEl = document.querySelector("#player-select");
const closePlayerModalButtonEl = document.querySelector(".close-player-modal");
const playsEl = document.querySelector(".plays");
const dateEl = document.querySelector(".date");
const selectEl = document.querySelector(".select");
const target = document.querySelector('.container');

playerSelectEl.addEventListener('change', e => addNewPlayer(e));
closePlayerModalButtonEl.addEventListener("click", e => closeModal(addPlayerModalOverlay));
submitFormButtonEl.addEventListener("click", (e) => submitPlayerForm(e));

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const sessionId = Date.now();


const spinner = new Spinner(opts).spin(target);

onAuthStateChanged(auth, async user => {
    if (user) {
        const q = query(getRefs(user.uid).games, where("id", "==", id));
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
    const q = query(getRefs(userId).players);
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
    selectEl.classList.remove("hidden");
    target.removeChild(spinner.el);
}

function createPlayer(player) {
    if (!player.hidden) {
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
    e.preventDefault();
    const userId = localStorage.getItem("userId");
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
        const q = query(getRefs(userId).players, where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const player = {
                name,
                id: Date.now(),
                hidden: false
            }
            addPlayerToPlayers(userId, player);
            renderPlayers(userId);
            form.reset();
            closeModal(addPlayerModalOverlay)
        } else {
            Notify.failure(`Player with name ${name} already exists`);
        }
    } else {
        Notify.failure(`Name field shouldn't be empty`);
    }
}

async function addPlayerToPlayers(userId, player) {
    const dateId = Date.now().toString();
    player.documentId = dateId;

    try {
        await setDoc(doc(getRefs(userId).players, dateId), player);
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
    const userId = localStorage.getItem("userId");

    try {
        await setDoc(doc(getRefs(userId).plays), play);
        Notify.success('The score is added successfully');
    } catch(e){
        console.error("Error adding score: ", e);
    }
}