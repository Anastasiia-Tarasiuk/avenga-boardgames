import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getDocs, query, where} from "firebase/firestore";
import debounce from "lodash.debounce";
import {filterList, getPlayerQueryById, getRefs} from "./constants";

const playedGamesListEl = document.querySelector(".played-games");
const addGameButtonEl = document.querySelector(".add-game");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");

const gameData = [];

filterEl.addEventListener("keydown",  debounce(e => filterList(e, gameData, playedGamesListEl, renderPlayedGames), 500));

onAuthStateChanged(auth, async user => {
    if (user) {
        addGameButtonEl.classList.remove("hidden");
        const q = query(getRefs(user.uid).games);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            playedGamesListEl.innerHTML = "";
            filterLabelEl.classList.remove("hidden");

            querySnapshot.forEach(doc => {
                gameData.push(doc.data());
                renderPlayedGames(doc.data(), user.uid)
            });
        }
    }
});

async function renderPlayedGames(game, userId) {

    const scoreList = await createWinnersList(await getWinners(game.id, userId), userId);


    const number = await getGameSessions(game, userId);
    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");
    gameListItem.innerHTML =`<div class="truncate-container"><p class="truncate-name">${game.name}</p><img class="thumbnail" src=${game.url}></div><div class="winners-container"><p>Best score:</p>${scoreList}</div><div class="plays-container"><a class="add-plays-link" href="../partials/add_plays.html?id=${game.id}"><div class="add-plays-container"><span class="number-of-plays ">${number} </span>plays</div><span class="tooltip-text">Add your score<span></a></div>`
    playedGamesListEl.insertAdjacentElement("afterbegin", gameListItem);
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