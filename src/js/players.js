import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {PieChart} from "./pieChart";
import {COLORS as colors, getPlayerRef, getRefs} from "./constants";
import {doc, updateDoc} from "firebase/firestore";
import {query, where, getDocs} from "firebase/firestore";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {db} from "./login";
import debounce from "lodash.debounce";
import {filterList} from "./constants";

const playersEl = document.querySelector(".players");
const renameFormEl = document.querySelector("[id='rename-form']");
const hideFormEl = document.querySelector("[id='hide-form']");
const modalSettingsOverlayEl = document.querySelector(".players-settings-modal-overlay");
const closeLoginModalButtonEls = document.querySelectorAll(".close-player-settings-modal");
const submitFormButtonsEl = modalSettingsOverlayEl.querySelectorAll("button[type='submit']");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");

closeLoginModalButtonEls.forEach(btn => btn.addEventListener("click", closePlayerSettingModal));
submitFormButtonsEl.forEach(btn => btn.addEventListener("click", (e ) => submitPlayerSettingsForm(e)));

const playersNames = [];
const playersData = [];

filterEl.addEventListener("keydown",  debounce(e => filterList(e, playersData, playersEl, playersTemplate), 500));

onAuthStateChanged(auth, async user => {
    if (user) {
        playersEl.innerHTML = "";
        const q = query(getRefs(user.uid).players);
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            filterLabelEl.classList.remove("hidden");
            const data = doc.data();
            playersData.push(data);
            playersNames.push({
                name: data.name.toLowerCase(),
                id: data.id.toString()
            });
            playersTemplate(data, user.uid);
        });
    }
});

async function playersTemplate(player, userId) {
    if (player.hidden) {
        return;
    }

    const pieChartData = [];
    const playerItem = document.createElement("li");
    playerItem.setAttribute("data-player-item-id", player.id);
    const stats = await getStats(player.id, userId);

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
            <ul id="gamesId" class="tabcontent empty"></ul>
            
            <div id="chartId" class="tabcontent empty">
                <canvas></canvas>
                <div class="legend"></div>
            </div>
            
            <div id="settingsId" class="tabcontent">
              <button class="renameButton">Rename player</button>
              <button class="deleteButton">Hide player</button>
            </div>
        </div>`;

    const accordionEl =  playerItem.querySelector(".accordion");

    const gameList = playerItem.querySelector("#gamesId");
    const chartList = playerItem.querySelector("#chartId");
    const settingsList = playerItem.querySelector("#settingsId");
    settingsList.addEventListener("click", e => showSettingsForm(e, player, accordionEl));

    accordionEl.addEventListener("click", e => toggleAccordion(e));
    playerItem.querySelector(".games").addEventListener("click", e => toggleTabs(e, 'gamesId', playerItem));
    playerItem.querySelector(".chartPie").addEventListener("click", e => toggleTabs(e, 'chartId', playerItem, pieChartData, chartList));
    playerItem.querySelector(".settings").addEventListener("click", e => toggleTabs(e, 'settingsId', playerItem));

   stats.map(async game => {
        const q = query(getRefs(userId).games, where("id", "==", game.gameId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const averageScore = Math.round(game.sumOfScore/game.numberOfPlays);
            const gameListItem = document.createElement("li");
            gameListItem.classList.add("game-list-item");
            gameListItem.innerHTML =`<div><p>${data.name}</p><img class="thumbnail" src=${data.url}><p>Best score: ${game.bestScore}</p><p>Average score: ${averageScore}</p><p>Plays: ${game.numberOfPlays}</p></div>`
            gameList.insertAdjacentElement("beforeend", gameListItem);

            if (gameList.classList.contains("empty")) {
                gameList.classList.remove("empty");
            }

            const pieChartGameData = {
                name: data.name,
                plays: game.numberOfPlays,
            }

            pieChartData.push(pieChartGameData);
        })
    })

    playersEl.insertAdjacentElement("beforeend", playerItem);
    playersEl.querySelectorAll("#defaultOpen").forEach(item => item.click());
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

async function getStats(playerId, userId) {
    const stats = [];
    const ids = [];
    const q = query(getRefs(userId).plays, where("playerId", "==", playerId.toString()));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        const play = doc.data();

        if (!ids.includes(play.gameId)) {
            const game = {
                bestScore: Number(play.score),
                numberOfPlays: 1,
                sumOfScore: Number(play.score),
                gameId: play.gameId
            }

            stats.push(game)
            ids.push(play.gameId)
        } else {
            stats.forEach(game => {
                if (game.gameId  === play.gameId) {
                    game.bestScore = game.bestScore > Number(play.score) ? game.bestScore : Number(play.score);
                    game.numberOfPlays = game.numberOfPlays + 1;
                    game.sumOfScore = game.sumOfScore + Number(play.score);
                }
            })
        }
    })

    return stats;
}

function toggleTabs(e, tab, parent, pieChartData, selector) {
    if (tab === "chartId") {
        createChart(selector, pieChartData);
    }

    const tabcontent = parent.querySelectorAll(".tabcontent");
    const tablinks = parent.querySelectorAll(".tablinks");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    parent.querySelector(`#${tab}`).style.display = "block";
    e.currentTarget.className += " active";
}

function createChart(parent, data) {
    const pieChart = {};

    if (data.length !== 0) {
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
        legend.innerHTML = "";
        const gamesPieChart = new PieChart(options);
        gamesPieChart.drawSlices();
        gamesPieChart.drawLegend();
    }
}

async function renamePlayer(playerId, submitButton) {
    const allPlayerItems = playersEl.children;
    const formData = new FormData(renameFormEl, submitButton);
    const userId = localStorage.getItem("userId");
    let newName = null;

    for (const [_, value] of formData) {
        if (value.trim()) {
            newName = value;
        } else  {
            Notify.failure('Value shouln\'t be empty');
        }
    }

    for (const player of playersNames) {
        if (player.name === newName.toLowerCase()) {
            Notify.failure('Such player already exists');
            return;
        }
    }

    try {
        const playerRef = await getPlayerRef(playerId);

        playersData.forEach(player => {
            if (player.id.toString() === playerId) {
                player.name = newName;
            }
        })

        await updateDoc(playerRef, {
            name: newName
        });

        for (const player of playersNames) {
            if (player.id === playerId) {
                player.name = newName.toLowerCase();
            }
        }

        Notify.success('The player is renamed successfully');

        // if player is user
        if (userId === playerId) {
            const userRef = doc(db, `users/${userId}/user`, userId);

            await updateDoc(userRef, {
                name: newName
            });
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    [...allPlayerItems].forEach(item => {
        if (item.dataset.playerItemId === playerId) {
            item.querySelector("button").innerHTML = newName;
        }
    })

    renameFormEl.reset();
    closePlayerSettingModal();
}

async function hidePlayer(playerId) {
    const allPlayerItems = playersEl.children;

    [...allPlayerItems].forEach(item => {
        if (item.dataset.playerItemId === playerId) {
            item.classList.add("hidden");
        }
    })

    try {
        const playerRef = await getPlayerRef(playerId);

        playersData.forEach(player => {
            if (player.id.toString() === playerId) {
                player.hidden = true;
            }
        })

        await updateDoc(playerRef, {
            hidden: true
        });

        Notify.success('The player is hidden successfully');
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    closePlayerSettingModal();
}

function showSettingsForm(e, player, accordion) {
    const playerName = accordion.innerText;
    const button = e.target;
    modalSettingsOverlayEl.classList.remove('hidden');

    if (button.classList.contains("renameButton")) {
        hideFormEl.style.display = "none";
        renameFormEl.style.display = "flex";
        const submitButtonEl = renameFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Rename ${playerName}`;
    } else {
        hideFormEl.style.display = "flex";
        renameFormEl.style.display = "none";
        const submitButtonEl = hideFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Hide ${playerName}`;
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
