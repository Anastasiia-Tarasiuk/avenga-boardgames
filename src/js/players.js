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

        const stats = getStats(player.id);

        const games = getPersonalGameStats(stats);

        // const bestScore =
        console.log(33, games)

        playerItem.innerHTML = `   
            <button class="accordion">${player.name}</button>
            <div class="panel">
                <!-- Tab links -->
                <div class="tab">
                  <button class="tablinks games" id="defaultOpen">Played Games</button>
                  <button class="tablinks paris">Statistics</button>
                  <button class="tablinks tokyo">Tokyo</button>
                </div>
                
                <!-- Tab content -->
                <ul id="gamesId" class="tabcontent">
<!--                  <h3>London</h3>-->
<!--                  <p>London is the capital city of England.</p>-->
                  
                  
                </ul>
                
                <div id="Paris" class="tabcontent">
                  <h3>Paris</h3>
                  <p>Paris is the capital of France.</p>
                </div>
                
                <div id="Tokyo" class="tabcontent">
                  <h3>Tokyo</h3>
                  <p>Tokyo is the capital of Japan.</p>
                </div>
            </div>`;
        playerItem.querySelector(".accordion").addEventListener("click", e => toggleAccordion(e));
        playerItem.querySelector(".games").addEventListener("click", e => openCity(e, 'gamesId', playerItem));
        playerItem.querySelector(".paris").addEventListener("click", e => openCity(e, 'Paris', playerItem));
        playerItem.querySelector(".tokyo").addEventListener("click", e => openCity(e, 'Tokyo', playerItem));

        const gameList = playerItem.querySelector("#gamesId");

        let bestScore = 0;
        let sum = 0;

        games.forEach(game => {
            for (const gameKey in game) {
                game[gameKey].forEach(session => {
                    const score = Number(session.score);
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    sum += score;
                })

                docData.games.forEach(docDataGame => {
                    if (docDataGame.id === gameKey) {
                        const gameListItem = document.createElement("li");
                        gameListItem.classList.add("game-list-item");
                        gameListItem.innerHTML =`<div><p>${docDataGame.name}</p><img class="thumbnail" src=${docDataGame.url}><p>Best score: ${bestScore}</p><p>Average score: ${sum/games.length}</p><p>Plays: ${games.length}</p></div>`
                        gameList.insertAdjacentElement("beforeend", gameListItem);
                    }
                })
            }
        })

        playersEl.insertAdjacentElement("beforeend", playerItem);
        playersEl.querySelectorAll("#defaultOpen").forEach(item => item.click());
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
    const stats = [];
    for (const play of docData.plays) {
        if (play.playerId === playerId.toString()) {
            stats.push(play);
        }
    }
    return stats;
}

function openCity(e, city, parent) {
    // Get all elements with class="tabcontent" and hide them
    const tabcontent = parent.querySelectorAll(".tabcontent");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = parent.querySelectorAll(".tablinks");

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    parent.querySelector(`#${city}`).style.display = "block";
    e.currentTarget.className += " active";
}

function getPersonalGameStats(stats) {
    const games = [];
    const ids = [];

    for (const play of stats) {
        if (!ids.includes(play.gameId)) {
            const game = {
                [play.gameId]: [play]
            }
            ids.push(play.gameId);
            games.push(game);
        } else {
            games.forEach(game => {
                if (game[play.gameId] === play.gameId) {
                    game[play.gameId].push(play);
                }
            })
        }
    }

    return games;
}