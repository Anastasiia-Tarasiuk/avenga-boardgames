import {getAuth, onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./login";

const playedGamesListEl = document.querySelector(".played-games");

if (playedGamesListEl) {
    console.log(playedGamesListEl);
    renderPlayedGames();
}

function renderPlayedGames() {
    // TODO doesn't work currentUser
    // const currentUser = getAuth().currentUser;

    onAuthStateChanged(auth, async user => {
        if (user) {
            const userId = user.uid;

            const currentUserDocRef = doc(db, "users", userId);
            const currentUserDoc = await getDoc(currentUserDocRef);
            const docData = currentUserDoc.data();
            gameItemTemplate(docData.games)

        }
    });
}

function gameItemTemplate(data) {
    playedGamesListEl.innerHTML = "";
    data.forEach(game => {
        const gameListItem = document.createElement("li");
        gameListItem.classList.add("game-list-item");
        gameListItem.innerHTML =`<div><p>${game.name}</p><img class="thumbnail" src=${game.url}></div><a href="../../partials/add_plays.html"><span class="number-of-plays ">0</span>plays</a>`
        playedGamesListEl.insertAdjacentElement("beforeend", gameListItem);
    })
}

