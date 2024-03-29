import addGameImage from "../images/plus.png";
import defaultImage from "../images/no_image.jpg";
import convert from "xml-js";
import {addDoc, getDocs, query, where} from "firebase/firestore";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {closeModal, getRefs, isGameInFavourites, toggleFavourites, showImage} from "./constants";
import {Spinner} from 'spin.js';
import {opts} from "./constants";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";

const gameListEl = document.querySelector(".game-list");
const searchFormEl = document.querySelector(".search-form");
const submitButtonEl = document.querySelector(".submit-button");
const target = document.querySelector('.container');
const showMoreModalOverlay = document.querySelector(".show-more-modal-overlay");
const closeShowMoreModalButtonEl = document.querySelector(".close-show-more-modal");

submitButtonEl.addEventListener("click", e => submitForm(e));
closeShowMoreModalButtonEl.addEventListener("click", e => closeModal(showMoreModalOverlay));

const gameData = {};
const userId = localStorage.getItem("userId");
let spinner = new Spinner(opts).spin(target);


onAuthStateChanged(auth, async user => {
    if (user) {
        target.removeChild(spinner.el);
        submitButtonEl.removeAttribute("disabled");
    }
})

function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(searchFormEl, submitButtonEl);

    for (const [_, value] of formData) {
        if (value) {
            gameSearch(value);
        }
        else {
            gameListEl.innerHTML = `<p>Type something...</p>`
        }
    }
}

async function fetchAPI(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network response was not OK");
        }

        const xmlString = await response.text();
        return JSON.parse(convert.xml2json(xmlString, {compact: true, spaces: 4}));
    } catch (error) {
        gameListEl.innerHTML = `<p>Oops... Something went wrong</p>`
        console.error("There has been a problem with your fetch operation:", error);
    }
}

async function gameSearch(name) {
    const url = `https://boardgamegeek.com/xmlapi/search?search=${name}`;
    const {boardgames} = await fetchAPI(url);

    if (!boardgames.boardgame) {
        handleWrongSearchRequest(name);
    } else {
        getGameByName(boardgames.boardgame);
        searchFormEl.reset();
    }
}

async function getGameByName(games) {
    spinner = new Spinner(opts).spin(target);
    submitButtonEl.setAttribute("disabled", "true");
    gameListEl.innerHTML = "";

    if (games.length) {
        games.forEach(async item => {
            const id = await handleGameData(item);
            renderGames(gameData[id], games.length);
        });
    } else {
        const id = await handleGameData(games);
        renderGames(gameData[id], 1);
    }
}

async function getGameById(id) {
    const url = `https://boardgamegeek.com/xmlapi/boardgame/${id}`;
    const {boardgames} = await fetchAPI(url);

    return ({
        url: boardgames.boardgame.image?._text || defaultImage,
        category: boardgames.boardgame.boardgamecategory || [],
        description: boardgames.boardgame.description._text || "No description",
        otherNames: boardgames.boardgame.name,
        hidden: false
    })
}

async function renderGames(obj, length) {
    const categories = obj.category;
    const otherNames = obj.otherNames;
    obj.originalName = null;

    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");

    const categoriesEl = document.createElement("p");
    categoriesEl.classList.add("category");
    categoriesEl.innerHTML = "Category: ";

    if (Array.isArray(categories)) {
        if (categories.length === 0) {
            categoriesEl.innerHTML = "No category";
        }

        categories.forEach(categoryObj => {
            const span = document.createElement("span");
            span.innerHTML = categoryObj._text;
            categoriesEl.insertAdjacentElement("beforeend", span);
        })
    } else {
        const span = document.createElement("span");
        span.innerHTML = categories._text;
        categoriesEl.insertAdjacentElement("beforeend", span);
    }

    const descriptionButton = document.createElement("button");
    descriptionButton.innerHTML = "Read description";
    descriptionButton.classList.add("description-button");


    if (Array.isArray(otherNames)) {
        otherNames.forEach(nameObj => {
            if (nameObj._attributes.primary) {
                obj.originalName = nameObj._text;
                return;
            }
        })
    } else {
        obj.originalName = otherNames._text;
    }

    gameListItem.setAttribute("data-id", obj.id);
    gameListItem.innerHTML =`<div class="thumb"><lable class="favourite-lable"><input class="favourite-input" type="checkbox"/><svg class="favourite-svg" viewBox="0 0 122.88 107.41"><path d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"/></svg></lable><p class="game-name">${obj.name}</p><img class="thumbnail" src=${obj.url}><p>Original name: ${obj.originalName}</p>${categoriesEl.outerHTML}${descriptionButton.outerHTML}</div><button class="add-game-button" type="button"><img src=${addGameImage}></button>`
    const addGameButtonEl = gameListItem.querySelector(".add-game-button");
    addGameButtonEl.addEventListener("click", e => addGameToGames(obj));
    const descriptionButtonEl = gameListItem.querySelector(".description-button");
    descriptionButtonEl.addEventListener("click", e => showDescription(obj.description));
    const imageEl = gameListItem.querySelector(".thumbnail");
    imageEl.addEventListener("click", e => showImage(obj.url, showMoreModalOverlay));
    const favoriteEl = gameListItem.querySelector(".favourite-input");

    if (await isGameInFavourites(obj.id, userId)) {
        favoriteEl.checked = true;
    }

    favoriteEl.addEventListener("change", e => toggleFavourites(e, obj, userId));
    gameListEl.insertAdjacentElement("beforeend", gameListItem);

    if (length === gameListEl.childNodes.length) {
        target.removeChild(spinner.el);
        submitButtonEl.removeAttribute("disabled");
    }
}

function handleWrongSearchRequest(searchValue) {
    gameListEl.innerHTML = `<p>There is no game called <span>"${searchValue}"</span></p>`
}

async function addGameToGames(game) {
    try {
        const q = query(getRefs(userId).games, where("id", "==", game.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(getRefs(userId).games, game);
            Notify.success('The game is added successfully');
        } else {
            Notify.failure('The game is already in the list');
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function handleGameData(game) {
    const name = game.name._text;
    const year = game.yearpublished?._text || "";
    const id = game._attributes.objectid;
    const {url, category, description, otherNames, hidden} = await getGameById(id);
    gameData[id] = { id, name, year, url, category, description, otherNames, hidden };
    return id;
}

function showDescription(text) {
    showMoreModalOverlay.classList.remove("hidden");
    document.querySelector(".show-more-container").innerHTML = text;
}