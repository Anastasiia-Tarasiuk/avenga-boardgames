import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getDocs, query, where} from "firebase/firestore";
import {getRefs} from "./constants";

const playedGamesListEl = document.querySelector(".played-games");

onAuthStateChanged(auth, async user => {
    if (user) {
        const q = query(getRefs(user.uid).games);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            playedGamesListEl.innerHTML = "";
            querySnapshot.forEach((doc) => {
                renderPlayedGames(doc.data(), user.uid)
            });
        }
    }
});

async function renderPlayedGames(game, userId) {
    const number = await getGameSessions(game, userId);
    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");
    gameListItem.innerHTML =`<div><p>${game.name}</p><img class="thumbnail" src=${game.url}></div><a class="add-plays-link" href="../../partials/add_plays.html?id=${game.id}"><div class="add-plays-container"><span class="number-of-plays ">${number} </span>plays</div><span class="tooltip-text">Add your score<span></a>`
    playedGamesListEl.insertAdjacentElement("beforeend", gameListItem);
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