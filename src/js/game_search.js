import addGameImage from "../images/plus.png";
import defaultImage from "../images/no_image.jpg";
import convert from "xml-js";
import {addDoc, deleteDoc, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {getPlayerRef, getRefs, isGameInFavourites, toggleFavourites} from "./constants";
import {db} from "./login";

const gameListEl = document.querySelector(".game-list");
const searchFormEl = document.querySelector(".search-form");
const submitButtonEl = document.querySelector(".submit-button");

submitButtonEl.addEventListener("click", e => submitForm(e));

const gameData = {};
const userId = localStorage.getItem("userId");

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
        otherNames: data.boardgames.boardgame.name,
        favourite: false
    })
}

async function renderGames(obj) {
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
    gameListItem.innerHTML =`<div class="thumb"><lable class="favourite-lable"><input class="favourite-input" type="checkbox"/><svg class="favourite-svg" viewBox="0 0 122.88 107.41"><path d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"/></svg></lable><p class="game-name">${obj.name}</p><img class="thumbnail" src=${obj.url}><p>Original name: ${originalName}</p></div><button class="add-game-button" type="button"><img src=${addGameImage}></button>`
    gameListItem.querySelector(".thumb").insertAdjacentElement("beforeend", categoriesEl);
    const addGameButtonEl = gameListItem.querySelector(".add-game-button");
    addGameButtonEl.addEventListener("click", e => addGameToGames(e, obj));
    const favoriteEl = gameListItem.querySelector(".favourite-input");

    if (await isGameInFavourites(obj.id, userId)) {
        favoriteEl.checked = true;
    }

    favoriteEl.addEventListener("change", e => toggleFavourites(e, obj, userId));
    gameListEl.insertAdjacentElement("beforeend", gameListItem);
}

function handleWrongSearchRequest(searchValue) {
    gameListEl.innerHTML = `<p>There is no game called <span>"${searchValue}"</span></p>`
}

async function addGameToGames(_, game) {
    const userId = localStorage.getItem("userId");

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


// async function addToFavourites(e, {id, name, url}) {
//     const input = e.currentTarget;
//
//     if (input.checked) {
//         try {
//             if (await isGameInFavourites(id)) {
//                 Notify.failure('The game is already in favourites');
//             } else {
//                 await addDoc(getRefs(userId).favourites, {id, name, url});
//                 Notify.success('The game is added to favourites');
//             }
//         } catch (e) {
//             console.error("Error adding document: ", e);
//         }
//     } else {
//         try {
//             let docId = null;
//             const q = query(getRefs(userId).favourites, where("id", "==", id));
//             const querySnapshot = await getDocs(q);
//
//             querySnapshot.forEach(doc => {
//                 docId = doc.id;
//             });
//
//             await deleteDoc(doc(getRefs(userId).favourites, docId));
//             Notify.success('The game is removed from favourites');
//         } catch (e) {
//             console.error("Error deleting document: ", e);
//         }
//     }
// }

// async function isGameInFavourites(id) {
//     const q = query(getRefs(userId).favourites, where("id", "==", id));
//     const querySnapshot = await getDocs(q);
//
//     if (querySnapshot.empty) {
//         return false;
//     } else {
//         return true;
//     }
// }
