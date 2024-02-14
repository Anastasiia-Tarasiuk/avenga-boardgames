import addGameImage from "../images/plus.png";
import defaultImage from "../images/no_image.jpg";
import convert from "xml-js";
import {db} from "./login";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {getCurrentUserId} from "./constants";

const gameListEl = document.querySelector(".game-list");
const searchFormEl = document.querySelector(".search-form");
const submitButtonEl = document.querySelector(".submit-button");

// if (submitButtonEl) {
submitButtonEl.addEventListener("click", e => submitForm(e));
// }

const gameData = {};

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
    const data = await fetchAPI(url);

    if (!data.boardgames.boardgame) {
        handleWrongSearchRequest(name);
    } else {
        getGameByName(data);
        searchFormEl.reset();
    }
}

async function getGameByName(gamesObj) {
    gameListEl.innerHTML = "";
    const games = gamesObj.boardgames.boardgame;

    if (games.length) { 
        games.forEach(async item => {
            const name = item.name._text;
            const year = item.yearpublished?._text || "";
            const id = item._attributes.objectid;
            const {url, category, description, otherNames} = await getGameById(id);
            gameData[id] = { id, name, year, url, category, description, otherNames };
            renderGames(gameData[id]);
        });
    } else {
        const name = games.name._text;
        const year = games.yearpublished._text || "";
        const id = games._attributes.objectid;
        const {url, category, description, otherNames} = await getGameById(id);
        gameData[id] = { id, name, year, url, category, description, otherNames };
        renderGames(gameData[id]);
    }

}

async function getGameById(id) {
    const url = `https://boardgamegeek.com/xmlapi/boardgame/${id}`;
    const data = await fetchAPI(url);

    return ({
        url: data.boardgames.boardgame.image?._text || defaultImage,
        category: data.boardgames.boardgame.boardgamesubdomain || [],
        description: data.boardgames.boardgame.description._text,
        otherNames: data.boardgames.boardgame.name
    })
} 

function renderGames(obj) {
    const categories = obj.category;
    const otherNames = obj.otherNames;
    let originalName = null;

    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");

    const categoriesEl = document.createElement("p");
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

    if (Array.isArray(otherNames)) {
        otherNames.forEach(nameObj => {
            if (nameObj._attributes.primary) {
                originalName = nameObj._text;
                return;
            }
        })
    } else {
        originalName = otherNames._text;
    }

    obj.originalName = originalName;
    gameListItem.setAttribute("data-id", obj.id);
    gameListItem.innerHTML =`<div class="thumb"><p>${obj.name}</p><img class="thumbnail" src=${obj.url}><p>Original name: ${originalName}</p></div><button class="add-game-button" type="button"><img src=${addGameImage}></button>`
    gameListItem.querySelector(".thumb").insertAdjacentElement("beforeend", categoriesEl);
    const addGameButtonEl = gameListItem.querySelector(".add-game-button");
    addGameButtonEl.addEventListener("click", e => addGameToGames(e, obj));
    gameListEl.insertAdjacentElement("beforeend", gameListItem);
}

function handleWrongSearchRequest(searchValue) {
    gameListEl.innerHTML = `<p>There is no game called <span>"${searchValue}"</span></p>`
}

async function addGameToGames(_, game) {
    const gamesRef = collection(db, `users/${getCurrentUserId()}/games`);

    try {
        const q = query(gamesRef, where("id", "==", game.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(gamesRef, game);
            Notify.success('The game is added successfully');
        } else {
            Notify.failure('The game is already in the list');
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
