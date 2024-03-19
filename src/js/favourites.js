import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getDocs, query, where} from "firebase/firestore";
import debounce from "lodash.debounce";
import {
    toggleFavourites,
    filterList,
    getRefs,
    isGameInFavourites,
    pageRender,
    opts,
    closeModal,
    showImage
} from "./constants";
import {Spinner} from 'spin.js';

const favouriteGamesListEl = document.querySelector(".favourite-games");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");
const target = document.querySelector('.container');
const showMoreModalOverlay = document.querySelector(".show-more-modal-overlay");
const closeShowMoreModalButtonEl = document.querySelector(".close-show-more-modal");

const gameData = [];

filterEl.addEventListener("keydown",  debounce(e => filterList(e, gameData, favouriteGamesListEl, renderFavouriteGames), 500));
closeShowMoreModalButtonEl.addEventListener("click", e => closeModal(showMoreModalOverlay));

const spinner = new Spinner(opts).spin(target);

onAuthStateChanged(auth, user => {
    if (user) {
        const q = query(getRefs(user.uid).favourites);
        pageRender(user.uid, q, favouriteGamesListEl, gameData, renderFavouriteGames, target, spinner);

    } else if (localStorage.getItem("logout")) {
        target.removeChild(spinner.el);
    }
});

async function renderFavouriteGames(game, userId, show) {
    const gameListItem = document.createElement("li");
    gameListItem.classList.add("favourite-list-item");
    gameListItem.innerHTML = `<div class="truncate-container"><lable class="favourite-lable"><input class="favourite-input" type="checkbox"/><svg class="favourite-svg" viewBox="0 0 122.88 107.41"><path d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"/></svg></lable><p class="truncate-name">${game.name}<span class="tooltip-text">${game.name}<span></p><img class="thumbnail" src=${game.url}></div><div class="description-content"><p>${game.description}</p><div>`
    const imageEl = gameListItem.querySelector(".thumbnail");
    imageEl.addEventListener("click", e => showImage(game.url, showMoreModalOverlay));
    const favoriteEl = gameListItem.querySelector(".favourite-input");

    if (await isGameInFavourites(game.id, userId)) {
        favoriteEl.checked = true;
    }

    favoriteEl.addEventListener("change", e => toggleFavourites(e, game, userId));
    favouriteGamesListEl.insertAdjacentElement("beforeend", gameListItem);

    if (show) {
        filterLabelEl.classList.remove("hidden");
        favouriteGamesListEl.classList.remove("hidden");
        target.removeChild(spinner.el);
    }
}