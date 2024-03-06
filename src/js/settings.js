import {getDocs, query, updateDoc} from "firebase/firestore";
import {filterList, getPlayerRef, getRefs, handleTabsClick, removeFromFavourites} from "./constants";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import debounce from "lodash.debounce";

const panelEl = document.querySelector(".setting-panel");
const favouritesButtonEl = document.querySelector(".favourites-button");
const playersButtonEl = document.querySelector(".players-button");
const favouritesListEl = document.querySelector("#favouritesId");
const playersListEl = document.querySelector("#playersId");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");

const playersData = [];
const favoritesData = [];

filterEl.addEventListener("keydown",  debounce(e => getActiveTab(e), 500));
favouritesButtonEl.addEventListener("click", e => handleTabsClick(e, 'favouritesId', panelEl));
playersButtonEl.addEventListener("click", e => handleTabsClick(e, 'playersId', panelEl));

favouritesButtonEl.click();

function getActiveTab(e) {
    const activeTab = document.querySelector(".active-tab");

    if (activeTab === favouritesListEl) {
        filterList(e, favoritesData, favouritesListEl, renderFavouritesSettings);
    } else {
        filterList(e, playersData, playersListEl, renderPlayersSettings);
    }
}

onAuthStateChanged(auth,  user => {
    if (user) {
        panelEl.classList.remove("hidden");
        filterLabelEl.classList.remove("hidden");
        handlePlayersSection(user.uid);
        handleFavouritesSection(user.uid);
    }
});

async function handlePlayersSection(userId){
    const q = query(getRefs(userId).players);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        playersListEl.innerHTML = "";
        playersListEl.classList.remove("default");

        querySnapshot.forEach(doc => {
            playersData.push(doc.data());
            renderPlayersSettings(doc.data());
        })
    }
}
async function handleFavouritesSection(userId) {
    const q = query(getRefs(userId).favourites);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        favouritesListEl.innerHTML = "";
        favouritesListEl.classList.remove("default");

        querySnapshot.forEach(doc => {
            favoritesData.push(doc.data());
            renderFavouritesSettings(doc.data());
        })
    }
}

function renderPlayersSettings(player) {
    const playerItem = document.createElement("li");
    playerItem.dataset.id = player.id;
    const playerName = document.createElement("p");
    playerName.innerHTML = player.name;
    playerItem.appendChild(playerName);
    playerItem.appendChild(createSwitcher(player));

    playersListEl.insertAdjacentElement("beforeend", playerItem);

    const checkbox = playerItem.querySelector(".slider-checkbox");
    checkbox.addEventListener("click", e => changePlayerVisibility(e, playerItem.dataset.id));
}

function renderFavouritesSettings(favourite){
    const favouriteItem = document.createElement("li");
    favouriteItem.dataset.id = favourite.id;
    favouriteItem.classList.add("settings-item");
    const favouriteContainer = document.createElement("div");
    const favouriteName = document.createElement("p");
    favouriteName.innerHTML = favourite.name;
    const favouriteImage = document.createElement("img");
    favouriteImage.src = favourite.url;
    favouriteImage.classList.add("thumbnail");
    favouriteContainer.appendChild(favouriteName);
    favouriteContainer.appendChild(favouriteImage);
    favouriteItem.appendChild(favouriteContainer);
    favouriteItem.appendChild(createSwitcher(favourite));

    favouritesListEl.insertAdjacentElement("beforeend", favouriteItem);

    const checkbox = favouriteItem.querySelector(".slider-checkbox");
    checkbox.addEventListener("change", e => changeFavourites(e, favouriteItem.dataset.id));
}

function createSwitcher(item) {
    const label = document.createElement("label");
    label.classList.add("switch");
    const checkbox = document.createElement("input");
    checkbox.classList.add("slider-checkbox");
    checkbox.setAttribute("type", "checkbox");

    if (!item.hidden) {
        checkbox.setAttribute("checked", "");
    }

    const slider = document.createElement("span");
    slider.classList.add("slider", "round");
    label.appendChild(checkbox);
    label.appendChild(slider);
    return label;
}

async function changePlayerVisibility(e, playerId) {
    e.stopPropagation();
    const checkbox = e.currentTarget;

    try {
        const playerRef = await getPlayerRef(playerId);

        playersData.forEach(player => {
            if (player.id === playerId) {
                player.hidden = !checkbox.checked;
            }
        })

        await updateDoc(playerRef, {
            hidden: !checkbox.checked
        });

        Notify.success('The player visibility was changed successfully');
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function changeFavourites(e, favouriteId) {
    e.stopPropagation();
    const favouriteItem =  document.querySelector(`li[data-id = "${favouriteId}"]`)
    const userId =  localStorage.getItem("userId");

    removeFromFavourites(favouriteId, userId);

    setTimeout(() => {
        favouriteItem.remove();
        if (favouritesListEl.innerHTML.length === 0) {
            favouritesListEl.classList.add("default");
            favouritesListEl.innerHTML = "Favourite games are going to be here";
        }

        favouritesListEl.classList.remove("default");
    }, 500)
}
