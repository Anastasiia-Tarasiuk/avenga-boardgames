import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getCurrentUserData} from "./game_list";

const playersEl = document.querySelector(".players");

let docData = null;

if (playersEl) {
    renderPlayersData();
}

async function renderPlayersData() {
    onAuthStateChanged(auth, async user => {
        if (user) {
            docData = await getCurrentUserData(user);
            playersTemplate(docData.players);

        }
    });
}

function playersTemplate(players) {
    players.forEach(player => {
        const playerItem = document.createElement("li");

        getStats(player.id);

        playerItem.innerHTML = `   
            <button class="accordion">${player.name}</button>
            <div class="panel">
                <p>No played games</p>
            </div>`;
        playerItem.querySelector(".accordion").addEventListener("click", e => toggleAccordion(e));

        playersEl.insertAdjacentElement("beforeend", playerItem);
    })
}

function toggleAccordion(e) {
    const button = e.currentTarget;
    button.classList.toggle("active");

    const panel = button.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

function getStats(playerId) {
    const stats = {};
    for (const play of docData.plays) {
        if (play.playerId === playerId.toString()) {
            console.log(play)
        }
    }
}