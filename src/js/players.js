import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {getCurrentUserData} from "./game_list";
import {PieChart} from "./pieChart";
import {COLORS as colors} from "./constants";
import {updateDoc} from "firebase/firestore";
import {getCurrentUserDocRef} from "./game_search";
import {Notify} from "notiflix/build/notiflix-notify-aio";

const playersEl = document.querySelector(".players");
const renameFormEl = document.querySelector("[id='rename-form']");
const hideFormEl = document.querySelector("[id='hide-form']");
const modalSettingsOverlayEl = document.querySelector(".players-settings-modal-overlay");
const closeLoginModalButtonEls = document.querySelectorAll(".close-player-settings-modal");

closeLoginModalButtonEls.forEach(btn => btn.addEventListener("click", closePlayerSettingModal));

let docData = null;

if (playersEl) {
    renderPlayersData();
}

if (modalSettingsOverlayEl) {
    const submitFormButtonsEl = modalSettingsOverlayEl.querySelectorAll("button[type='submit']");
    submitFormButtonsEl.forEach(btn => btn.addEventListener("click", (e) => submitPlayerSettingsForm(e)));
}

async function renderPlayersData() {
    onAuthStateChanged(auth, async user => {
        if (user) {
            docData = await getCurrentUserData(user);
            playersEl.innerHTML = ""
            playersTemplate(docData.players);
        }
    });
}

function playersTemplate(players) {
    players.forEach(player => {
        if (player.hidden === "true") {
            return;
        }

        const playerItem = document.createElement("li");
        playerItem.setAttribute("data-player-item-id", player.id)
        const stats = getStats(player.id);
        const games = getPersonalGameStats(stats);

        console.log(player.name)

        playerItem.innerHTML = `   
            <button class="accordion">${player.name}</button>
            <div class="panel">
                <!-- Tab links -->
                <div class="tab">
                    <button class="tablinks games" id="defaultOpen">Played games</button>
                    <button class="tablinks chartPie">Pie chart</button>
                    <button class="tablinks settings">Player settings</button>
                </div>
                
                <!-- Tab content -->
                <ul id="gamesId" class="tabcontent empty">
                </ul>
                
                <div id="chartId" class="tabcontent empty">
                    <canvas></canvas>
                    <div class="legend"></div>
                </div>
                
                <div id="settingsId" class="tabcontent">
                  <button class="renameButton">Rename player</button>
                  <button class="deleteButton">Hide player</button>
                </div>
            </div>`;
        playerItem.querySelector(".accordion").addEventListener("click", e => toggleAccordion(e));
        playerItem.querySelector(".games").addEventListener("click", e => toggleTabs(e, 'gamesId', playerItem));
        playerItem.querySelector(".chartPie").addEventListener("click", e => toggleTabs(e, 'chartId', playerItem));
        playerItem.querySelector(".settings").addEventListener("click", e => toggleTabs(e, 'settingsId', playerItem));

        const gameList = playerItem.querySelector("#gamesId");
        const chartList = playerItem.querySelector("#chartId");
        const settingsList = playerItem.querySelector("#settingsId");
        settingsList.addEventListener("click", e => showSettingsForm(e, player));
        const pieChartData = [];

        games.forEach(game => {
            let bestScore = 0;
            let sum = 0;
            let plays = 0;

            for (const gameKey in game) {
                game[gameKey].forEach(session => {
                    plays += 1;
                    const score = Number(session.score);
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    sum += score;
                })

                docData.games.forEach(docDataGame => {
                    if (docDataGame.id === gameKey) {
                        const averageScore = Math.round(sum/plays);
                        const pieChartGameData = {}
                        const gameListItem = document.createElement("li");
                        gameListItem.classList.add("game-list-item");
                        gameListItem.innerHTML =`<div><p>${docDataGame.name}</p><img class="thumbnail" src=${docDataGame.url}><p>Best score: ${bestScore}</p><p>Average score: ${averageScore}</p><p>Plays: ${plays}</p></div>`
                        gameList.insertAdjacentElement("beforeend", gameListItem);

                        if (gameList.classList.contains("empty")) {
                            gameList.classList.remove("empty");
                        }

                        pieChartGameData.id = docDataGame.id;
                        pieChartGameData.name = docDataGame.name;
                        pieChartGameData.bestScore = bestScore;
                        pieChartGameData.averageScore = averageScore;
                        pieChartGameData.plays = plays;

                        pieChartData.push(pieChartGameData);
                    }
                })
            }
        })

        playersEl.insertAdjacentElement("beforeend", playerItem);
        playersEl.querySelectorAll("#defaultOpen").forEach(item => item.click());

        createChart(chartList, pieChartData);
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

function toggleTabs(e, city, parent) {
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
                if (game[play.gameId]) {
                    game[play.gameId].push(play);
                }
            })
        }
    }

    return games;
}

function createChart(parent, data) {
    const pieChart = {}

    data.forEach(game => {
        pieChart[game.name] = game.plays;

    })

    if (parent.classList.contains("empty")) {
        parent.classList.remove("empty");
    }

    const canvas = parent.querySelector("canvas");
    const legend = parent.querySelector(".legend");
    const options = {
        canvas,
        pieChart,
        colors,
        legend
    }

    const gamesPieChart = new PieChart(options);
    gamesPieChart.drawSlices();
    gamesPieChart.drawLegend();
}

async function renamePlayer(playerId, submitButton) {
    const allPlayerItems = playersEl.children;
    let newName = null;

    const formData = new FormData(renameFormEl, submitButton);

    for (const [_, value] of formData) {
        if (value.trim()) {
            newName = value;
        } else  {
            Notify.failure('Value shouln\'t be empty');
        }
    }

    if (docData) {
        try {
            docData.players.forEach(player => {
                if (player.id.toString() === playerId) {
                    player.name = newName;
                }
            })

            await updateDoc(getCurrentUserDocRef(), docData);
            Notify.success('The player is removed successfully');
        } catch (e) {
            console.error("Error adding player: ", e);
        }
    }

    [...allPlayerItems].forEach(item => {
        if (item.dataset.playerItemId === playerId) {
            item.querySelector("button").innerHTML = newName;
        }
    })


    closePlayerSettingModal();
}

async function hidePlayer(playerId) {
    const allPlayerItems = playersEl.children;

    [...allPlayerItems].forEach(item => {
        if (item.dataset.playerItemId === playerId) {
            item.classList.add("hidden");
        }
    })

    if (docData) {
        try {
            docData.players.forEach(player => {
                if (player.id.toString() === playerId) {
                    player.hidden = "true";
                }
            })

            await updateDoc(getCurrentUserDocRef(), docData);
            Notify.success('The player is removed successfully');
        } catch (e) {
            console.error("Error adding player: ", e);
        }
    }

    closePlayerSettingModal();
}

function showSettingsForm(e, player) {
    const button = e.target;
    modalSettingsOverlayEl.classList.remove('hidden');

    if (button.classList.contains("renameButton")) {
        hideFormEl.style.display = "none";
        renameFormEl.style.display = "flex";

        const submitButtonEl = renameFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Rename ${player.name}`;
    } else {
        hideFormEl.style.display = "flex";

        renameFormEl.style.display = "none";
        const submitButtonEl = hideFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Hide ${player.name}`;
    }
}

function closePlayerSettingModal() {
    modalSettingsOverlayEl.classList.add('hidden');
}

function submitPlayerSettingsForm(e) {
    e.preventDefault();
    const actionButton = e.target;

    if (actionButton.dataset.action === "hide-submit-btn") {
        hidePlayer(actionButton.dataset.playerid);
    } else {
        renamePlayer(actionButton.dataset.playerid, actionButton);
    }
}