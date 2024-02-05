import {getCurrentUserData} from "./game_list";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {updateDoc} from "firebase/firestore";
import {getCurrentUserDocRef} from "./game_search";
import debounce from 'lodash.debounce';

const gameToScoreEl = document.querySelector(".game-to-score");
const addPlayerModalOverlay = document.querySelector(".add-player-modal-overlay");
const searchParams = new URLSearchParams(window.location.search);
const playerSelectEl = document.querySelector("#player-select");
const closePlayerModalButtonEl = document.querySelector(".close-player-modal");
const playsEl = document.querySelector(".plays");
const dateEl = document.querySelector(".date");

if (playerSelectEl) {
    playerSelectEl.addEventListener('change', e => addNewPlayer(e));
    closePlayerModalButtonEl.addEventListener("click", closePlayerModal);
    const submitFormButtonEl = document.querySelector("button[type='submit']");
    submitFormButtonEl.addEventListener("click", (e) => submitPlayerForm(e));
}

let id = null;
let docData = null;
const sessionId = Date.now();

if (searchParams) {
    id = searchParams.get('id');

    if (id) {
        renderGameToScore();
    }
}

async function renderGameToScore() {
    onAuthStateChanged(auth, async user => {
        if (user) {
            docData = await getCurrentUserData(user);
            gameTemplate(docData.games);
            renderPlayers();
        }
    });
}

function gameTemplate(games) {
    for (const game of games) {
        if (game.id === id) {
            gameToScoreEl.innerHTML =`<div><p>${game.name}</p><img class="thumbnail" src=${game.url}></div>`
            return;
        }
    }
}

function renderPlayers() {
    [...playerSelectEl.children].forEach(child => {
        if (child.value !== "") {
            if (child.value !== "new-player") {
                child.remove();
            }
        }
    })

    docData.players.forEach(player => {
        const option = document.createElement("option");
        option.innerHTML = player.name;
        option.setAttribute("value", player.name);
        option.dataset.id = player.id;
        playerSelectEl.firstElementChild.after(option);
    })
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
                    playsLabel.querySelector("input").addEventListener("keydown", debounce(e => setScore(e), 1000));
                }
            } else {
                playsEl.insertAdjacentElement("beforeend", playsLabel);
                playsLabel.querySelector("input").addEventListener("keydown", debounce(e => setScore(e), 1000));
            }
        }
    }
}

function submitPlayerForm(e) {
    e.preventDefault();
    const submitButton = e.currentTarget;
    const form = submitButton.parentElement;
    const formData = new FormData(submitButton.parentElement, submitButton);
    let name = null;
    let validate = true;

    for (const [key, value] of formData) {
        if (key === "name") {
            name = value.trim();
        }
    }

    if (name.length > 0) {
        docData.players.forEach(player => {
            if (player.name.toLowerCase() === name.toLowerCase()) {
                Notify.failure(`Player with name ${name} already exists`);
                validate = false;
            }
        })

        if (validate) {
            const player = {
                name,
                id: Date.now(),

            }
            addPlayerToPlayers(player);
            renderPlayers();
            form.reset();
            closePlayerModal();
        }
    } else {
        Notify.failure(`Name field shouldn't be empty`);
    }
}

function closePlayerModal() {
    playerSelectEl.firstElementChild.setAttribute("selected", "");
    addPlayerModalOverlay.classList.add('hidden');
}

async function addPlayerToPlayers(player) {
    if (docData) {
        try {
            docData.players.push(player);
            await updateDoc(getCurrentUserDocRef(), docData);
            Notify.success('The player is added successfully');
        } catch (e) {
            console.error("Error adding player: ", e);
        }
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

    if (docData) {
        try {
            if (docData.plays.length > 0) {
                let isNewPlay = true;

                for (const savedPlay of docData.plays) {
                    if (savedPlay.sessionId === sessionId) {
                        if (savedPlay.playerId === option.id) {
                            savedPlay.score = option.value;
                            isNewPlay = false;
                            break;
                        }
                    }
                }

                if (isNewPlay) {
                    docData.plays.push(play);
                }
            } else {
                docData.plays.push(play);
            }

            await updateDoc(getCurrentUserDocRef(), docData);
            Notify.success('The score is added successfully');
        } catch (e) {
            console.error("Error adding score: ", e);
        }
    }
}