import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./login";

const playedGamesListEl = document.querySelector(".played-games");

if (playedGamesListEl) {
    renderPlayedGames();
}

function renderPlayedGames() {
    onAuthStateChanged(auth, async user => {
        if (user) {
            const docData = await getCurrentUserData(user);
            gameItemTemplate(docData)

        }
    });
}

function gameItemTemplate(data) {
    if (!data) {
        return;
    }

    const gameStats = getGameSessions(data);
    const container = document.createElement("div");

    data.games.forEach(game => {
        let number = 0;
        gameStats.forEach(stat => {
            if (stat.id === game.id) {
                number = stat.sessions.length;
            }
        })

        const gameListItem = document.createElement("li");
        gameListItem.classList.add("game-list-item");
        gameListItem.innerHTML =`<div><p>${game.name}</p><img class="thumbnail" src=${game.url}></div><a class="add-plays-link" href="../../partials/add_plays.html?id=${game.id}"><div class="add-plays-container"><span class="number-of-plays ">${number} </span>plays</div><span class="tooltip-text">Add your score<span></a>`
        container.insertAdjacentElement("beforeend", gameListItem);
    })

    playedGamesListEl.innerHTML = container.innerHTML;
}

export async function getCurrentUserData(user) {
    const userId = user.uid;

    const currentUserDocRef = doc(db, "users", userId);
    const currentUserDoc = await getDoc(currentUserDocRef);
    return currentUserDoc.data();
}

function getGameSessions(data) {
    const games = [];

    for (const game of data.games) {
        if (!games.includes(game.id)) {
            games.push({id: game.id,
            sessions: []});
        }
    }

    games.forEach(game => {
        data.plays.forEach(play => {
            if (play.gameId === game.id) {
                if (!game.sessions.includes(play.sessionId)) {
                    game.sessions.push(play.sessionId);
                }
            }
        })
    })

    return games;
}