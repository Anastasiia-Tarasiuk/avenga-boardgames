import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getDocs, query, where} from "firebase/firestore";
import debounce from "lodash.debounce";
import {toggleFavourites, filterList, getPlayerQueryById, getRefs, isGameInFavourites} from "./constants";
import {Spinner} from 'spin.js';
import {opts} from "./constants";

const playedGamesListEl = document.querySelector(".played-games");
const addGameButtonEl = document.querySelector(".add-game");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");
const target = document.querySelector('.container');

const gameData = [];

filterEl.addEventListener("keydown",  debounce(e => filterList(e, gameData, playedGamesListEl, renderPlayedGames), 500));

const spinner = new Spinner(opts).spin(target);
const tempContainer = document.createElement("div");

onAuthStateChanged(auth, async user => {
    if (user) {
        addGameButtonEl.classList.remove("hidden");
        const q = query(getRefs(user.uid).games);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const length = querySnapshot.docs.length;
            filterLabelEl.classList.remove("hidden");

            querySnapshot.forEach(doc=> {
                gameData.push(doc.data());
                renderPlayedGames(doc.data(), user.uid, length);
            });
        }
    }
});

async function renderPlayedGames(game, userId, length) {
    const scoreList = await createWinnersList(await getWinners(game.id, userId), userId);
    const number = await getGameSessions(game, userId);
    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");
    gameListItem.innerHTML =`<div class="truncate-container"><lable class="favourite-lable"><input class="favourite-input" type="checkbox"/><svg class="favourite-svg" viewBox="0 0 122.88 107.41"><path d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"/></svg></lable><p class="truncate-name">${game.name}<span class="tooltip-text">${game.name}<span></p><img class="thumbnail" src=${game.url}></div><div class="winners-container"><p>Best score:</p>${scoreList}</div><div class="plays-container"><a class="add-plays-link" href="../partials/add_plays.html?id=${game.id}"><div class="add-plays-container"><span class="number-of-plays ">${number} </span>plays</div><span class="tooltip-text">Add your score<span></a></div>`
    const favoriteEl = gameListItem.querySelector(".favourite-input");

    if (await isGameInFavourites(game.id, userId)) {
        favoriteEl.checked = true;
    }

    favoriteEl.addEventListener("change", e => toggleFavourites(e, game, userId));

    tempContainer.insertAdjacentElement("beforeend", gameListItem);

    if (length === tempContainer.childNodes.length) {
        tempContainer.childNodes.forEach(item => playedGamesListEl.appendChild(item));
        target.removeChild(spinner.el);
    }
}

async function getGameSessions(game, userId) {
    const sessions = [];
    const q = query(getRefs(userId).plays, where("gameId", "==", game.id))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        if (!sessions.includes(doc.data().sessionId)) {
            sessions.push(doc.data().sessionId);
        }
    });

    return sessions.length;
}

async function getWinners(gameId, userId) {
    const bestScore = [];

    const q = query(getRefs(userId).plays, where("gameId", "==", gameId))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const playStats = doc.data();
        bestScore.push({
            score: Number(playStats.score),
            player: playStats.playerId
        })
    });

    bestScore.sort(compare);
    return bestScore;
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
            querySnapshot.forEach((doc) => {
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