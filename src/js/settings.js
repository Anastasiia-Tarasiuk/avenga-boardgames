import {getDocs, query, updateDoc} from "firebase/firestore";
import {getPlayerRef, getRefs} from "./constants";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";

const playersListEl = document.querySelector(".players-manager");

onAuthStateChanged(auth, async user => {
    if (user) {
        const q = query(getRefs(user.uid).players);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            playersListEl.innerHTML = "";

            querySnapshot.forEach(doc => {
                renderPlayersSettings(doc.data());
            })
        }
    }
});

function renderPlayersSettings(player) {
    const playerItem = document.createElement("li");
    const playerName = document.createElement("p");
    playerName.innerHTML = player.name;
    playerItem.appendChild(playerName);
    playerItem.appendChild(createSwitcher(player));

    playersListEl.insertAdjacentElement("beforeend", playerItem);
}

function createSwitcher(player) {
    const label = document.createElement("label");
    label.classList.add("switch");
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    if (!player.hidden) {
        checkbox.setAttribute("checked", "");
    }

    checkbox.addEventListener("click", e => changePlayerVisibility(e, player.id));
    const slider = document.createElement("span");
    slider.classList.add("slider", "round");
    label.appendChild(checkbox);
    label.appendChild(slider);
    return label;
}

async function changePlayerVisibility(e, playerId) {
    const checkbox = e.currentTarget;

    try {
        const playerRef = await getPlayerRef(playerId);

        await updateDoc(playerRef, {
            hidden: !checkbox.checked
        });

        Notify.success('The player visibility was changed successfully');
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}
