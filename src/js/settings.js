import {deleteDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {filterList, getGameRef, getPlayerRef, getRefs, handleTabsClick, removeFromFavourites} from "./constants";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import debounce from "lodash.debounce";
import {Spinner} from 'spin.js';
import {opts} from "./constants";

const panelEl = document.querySelector(".setting-panel");
const gamesButtonEl = document.querySelector(".games-button");
const playersButtonEl = document.querySelector(".players-button");
const playersListEl = document.querySelector("#playersId");
const gamesListEl = document.querySelector("#gamesId");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");
const target = document.querySelector('.container');
const defaultTextEl = document.querySelector(".default-text");

const playersData = [];
const gamesData = [];

filterEl.addEventListener("keydown",  debounce(e => getActiveTab(e), 500));
playersButtonEl.addEventListener("click", e => handleTabsClick(e, 'playersId', panelEl));
gamesButtonEl.addEventListener("click", e => handleTabsClick(e, 'gamesId', panelEl));

playersButtonEl.click();

const spinner = new Spinner(opts).spin(target);

function getActiveTab(e) {
    const activeTab = document.querySelector(".active-tab");

    if (activeTab === gamesListEl) {
        filterList(e, gamesData, gamesListEl, renderGamesSettings);
    } else if (activeTab === playersListEl) {
        filterList(e, playersData, playersListEl, renderPlayersSettings);
    }
}

onAuthStateChanged(auth,  user => {
    if (user) {
        defaultTextEl.classList.add("hidden");
        handlePlayersSection(user.uid);
        handleGamesSection(user.uid);
    }
});

async function handlePlayersSection(userId){
    const q = query(getRefs(userId).players);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const length = querySnapshot.docs.length;
        playersListEl.innerHTML = "";
        playersListEl.classList.remove("default");

        querySnapshot.forEach(doc => {
            playersData.push(doc.data());
            renderPlayersSettings(doc.data(), length);
        })
    } else {
        target.removeChild(spinner.el);
        filterLabelEl.classList.remove("hidden");
        panelEl.classList.remove("hidden");
    }
}

async function handleGamesSection(userId) {
    const q = query(getRefs(userId).games);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        gamesListEl.innerHTML = "";
        gamesListEl.classList.remove("default");

        querySnapshot.forEach(doc => {
            gamesData.push(doc.data());
            renderGamesSettings(doc.data());
        })
    }
}

function renderPlayersSettings(player, length) {
    const playerItem = document.createElement("li");
    playerItem.dataset.id = player.id;
    const playerName = document.createElement("p");
    playerName.innerHTML = player.name;
    playerItem.appendChild(playerName);
    playerItem.appendChild(createSwitcher(player));

    playersListEl.insertAdjacentElement("beforeend", playerItem);

    const checkbox = playerItem.querySelector(".slider-checkbox");
    checkbox.addEventListener("click", e => changePlayerVisibility(e, playerItem.dataset.id));

    if (length === playersListEl.childNodes.length) {
        target.removeChild(spinner.el);
        filterLabelEl.classList.remove("hidden");
        panelEl.classList.remove("hidden");
    }
}

function renderGamesSettings(game) {
    const gamesItem = createGameTemplate(game, gamesListEl);
    const checkbox = gamesItem.querySelector(".slider-checkbox");
    checkbox.addEventListener("change", e => changeGameVisibility(e, gamesItem.dataset.id));
}

function createSwitcher(item) {
    const label = document.createElement("label");
    label.classList.add("switch");
    const checkbox = document.createElement("input");
    checkbox.classList.add("slider-checkbox");
    checkbox.setAttribute("type", "checkbox");

    if (!item.hidden) {
        checkbox.setAttribute("checked", "");
    }

    const slider = document.createElement("span");
    slider.classList.add("slider", "round");
    label.appendChild(checkbox);
    label.appendChild(slider);
    return label;
}

async function changePlayerVisibility(e, playerId) {
    e.stopPropagation();
    const checkbox = e.currentTarget;

    try {
        const playerRef = await getPlayerRef(playerId);

        playersData.forEach(player => {
            if (player.id === playerId) {
                player.hidden = !checkbox.checked;
            }
        })

        await updateDoc(playerRef, {
            hidden: !checkbox.checked
        });

        Notify.success('The player visibility was changed successfully');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function createGameTemplate(data, list) {
    const item = document.createElement("li");
    item.dataset.id = data.id;
    item.classList.add("settings-item");
    const container = document.createElement("div");
    const name = document.createElement("p");
    name.innerHTML = data.name;
    const image = document.createElement("img");
    image.src = data.url;
    image.classList.add("thumbnail");
    container.appendChild(name);
    container.appendChild(image);
    item.appendChild(container);
    item.appendChild(createSwitcher(data));

    list.insertAdjacentElement("beforeend", item);

    return item;
}

async function changeGameVisibility(e, gameId) {
    e.stopPropagation();
    const checkbox = e.currentTarget;

    try {
        const gameRef = await getGameRef(gameId);

        gamesData.forEach(game => {
            if (game.id === gameId) {
                game.hidden = !checkbox.checked;
            }
        })

        await updateDoc(gameRef, {
            hidden: !checkbox.checked
        });

        Notify.success('The game visibility was changed successfully');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}