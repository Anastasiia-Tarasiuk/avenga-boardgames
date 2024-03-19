import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getDocs, query, where} from "firebase/firestore";
import debounce from "lodash.debounce";
import {toggleFavourites, filterList, getPlayerQueryById, getRefs, isGameInFavourites, pageRender, showImage, opts, closeModal} from "./constants";
import {Spinner} from 'spin.js';

const playedGamesListEl = document.querySelector(".played-games");
const addGameButtonEl = document.querySelector(".add-game");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");
const target = document.querySelector('.container');
const showMoreModalOverlay = document.querySelector(".show-more-modal-overlay");
const closeShowMoreModalButtonEl = document.querySelector(".close-show-more-modal");

const gameData = [];

filterEl.addEventListener("keydown",  debounce(e => filterList(e, gameData, playedGamesListEl, renderPlayedGames), 500));
closeShowMoreModalButtonEl.addEventListener("click", e => closeModal(showMoreModalOverlay));
const spinner = new Spinner(opts).spin(target);

onAuthStateChanged(auth,  user => {
    if (user) {
        addGameButtonEl.classList.remove("hidden");
        const q = query(getRefs(user.uid).games);
        pageRender(user.uid, q, playedGamesListEl, gameData, renderPlayedGames, target, spinner);
    } else if (localStorage.getItem("logout")) {
        target.removeChild(spinner.el);
    }
});

async function renderPlayedGames(game, userId, show) {
    if (!game.hidden) {
        const playSnapshot = await getPlaysSnapshot(game.id, userId);
        const playData = getDataFromPlaySnapshot(playSnapshot);

        const scoreList = await createWinnersList(playData.bestScore, userId);
        const gameListItem = document.createElement("li");
        gameListItem.classList.add("game-list-item");
        gameListItem.innerHTML = `<div class="truncate-container"><lable class="favourite-lable"><input class="favourite-input" type="checkbox"/><svg class="favourite-svg" viewBox="0 0 122.88 107.41"><path d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"/></svg></lable><p class="truncate-name">${game.name}<span class="tooltip-text">${game.name}<span></p><img class="thumbnail" src=${game.url}></div><div class="winners-container"><p>Best score:</p>${scoreList}</div><div class="plays-container"><a class="add-plays-link" href="../partials/add_plays.html?id=${game.id}"><div class="add-plays-container"><span class="number-of-plays ">${playData.sessions.length} </span>plays</div><span class="tooltip-text">Add your score<span></a></div>`
        const imageEl = gameListItem.querySelector(".thumbnail");
        imageEl.addEventListener("click", e => showImage(game.url, showMoreModalOverlay));
        const favoriteEl = gameListItem.querySelector(".favourite-input");

        if (await isGameInFavourites(game.id, userId)) {
            favoriteEl.checked = true;
        }

        favoriteEl.addEventListener("change", e => toggleFavourites(e, game, userId));
        playedGamesListEl.insertAdjacentElement("beforeend", gameListItem);
    }

    if (show) {
        filterLabelEl.classList.remove("hidden");
        playedGamesListEl.classList.remove("hidden");
        target.removeChild(spinner.el);
    }
}

function getDataFromPlaySnapshot(querySnapshot) {
    let bestScore = [];
    const sessions = [];

    querySnapshot.forEach((doc) => {
        const playStats = doc.data();

        if (!sessions.includes(playStats.sessionId)) {
            sessions.push(playStats.sessionId);
        }

        bestScore.push({
            score: Number(playStats.score),
            player: playStats.playerId,
            date: new Date(Date.parse(playStats.date)).toLocaleDateString()
        })
    });

    bestScore = bestScore.sort(compare);

    return {bestScore, sessions}
}

function compare(a, b) {
    if ( a.score > b.score ){
        return -1;
    }

    if ( a.score < b.score ){
        return 1;
    }

    return 0;
}

async function createWinnersList(scoreArray, userId) {
    const list = document.createElement("ul");
    list.classList.add("winners");

    for (let i = 0; i < 3; i++) {
        const item = document.createElement("li");

        if (scoreArray[i]) {
            const q = getPlayerQueryById(userId, scoreArray[i].player);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                item.innerHTML = `<p class="winner-data">${doc.data().name} <span>${scoreArray[i].score}</span></p>`
            });
            list.appendChild(item);
        } else {
            item.innerHTML = `<p class="winner-data">Unoccupied</p>`
            list.appendChild(item);
        }
    }

    return list.outerHTML;
}

async function getPlaysSnapshot(gameId, userId) {
    const q = query(getRefs(userId).plays, where("gameId", "==", gameId));
    return await getDocs(q);
}