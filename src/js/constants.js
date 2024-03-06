import {addDoc, collection, deleteDoc, doc, getDocs, query, where} from "firebase/firestore";
import {db} from "./login";
import {Notify} from "notiflix/build/notiflix-notify-aio";

const palette = [
    '#F44336',
    '#FFEBEE',
    '#FFCDD2',
    '#EF9A9A',
    '#E57373',
    '#EF5350',
    '#E53935',
    '#D32F2F',
    '#C62828',
    '#B71C1C',
    '#FF8A80',
    '#FF5252',
    '#FF1744',
    '#D50000',
    '#FCE4EC',
    '#F8BBD0',
    '#F48FB1',
    '#F06292',
    '#EC407A',
    '#E91E63',
    '#D81B60',
    '#C2185B',
    '#AD1457',
    '#880E4F',
    '#FF80AB',
    '#FF4081',
    '#F50057',
    '#C51162',
    '#F3E5F5',
    '#E1BEE7',
    '#CE93D8',
    '#BA68C8',
    '#AB47BC',
    '#9C27B0',
    '#8E24AA',
    '#7B1FA2',
    '#6A1B9A',
    '#4A148C',
    '#EA80FC',
    '#E040FB',
    '#D500F9',
    '#AA00FF',
    '#EDE7F6',
    '#D1C4E9',
    '#B39DDB',
    '#9575CD',
    '#7E57C2',
    '#673AB7',
    '#5E35B1',
    '#512DA8',
    '#4527A0',
    '#311B92',
    '#B388FF',
    '#7C4DFF',
    '#651FFF',
    '#6200EA',
    '#E8EAF6',
    '#C5CAE9',
    '#9FA8DA',
    '#7986CB',
    '#5C6BC0',
    '#3F51B5',
    '#3949AB',
    '#303F9F',
    '#283593',
    '#1A237E',
    '#8C9EFF',
    '#536DFE',
    '#3D5AFE',
    '#304FFE',
    '#E3F2FD',
    '#BBDEFB',
    '#90CAF9',
    '#64B5F6',
    '#42A5F5',
    '#2196F3',
    '#1E88E5',
    '#1976D2',
    '#1565C0',
    '#0D47A1',
    '#82B1FF',
    '#448AFF',
    '#2979FF',
    '#2962FF',
    '#E1F5FE',
    '#B3E5FC',
    '#81D4FA',
    '#4FC3F7',
    '#29B6F6',
    '#03A9F4',
    '#039BE5',
    '#0288D1',
    '#0277BD',
    '#01579B',
    '#80D8FF',
    '#40C4FF',
    '#00B0FF',
    '#0091EA',
    '#E0F7FA',
    '#B2EBF2',
    '#80DEEA',
    '#4DD0E1',
    '#26C6DA',
    '#00BCD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064',
    '#84FFFF',
    '#18FFFF',
    '#00E5FF',
    '#00B8D4',
    '#E0F2F1',
    '#B2DFDB',
    '#80CBC4',
    '#4DB6AC',
    '#26A69A',
    '#009688',
    '#00897B',
    '#00796B',
    '#00695C',
    '#004D40',
    '#A7FFEB',
    '#64FFDA',
    '#1DE9B6',
    '#00BFA5',
    '#E8F5E9',
    '#C8E6C9',
    '#A5D6A7',
    '#81C784',
    '#66BB6A',
    '#4CAF50',
    '#43A047',
    '#388E3C',
    '#2E7D32',
    '#1B5E20',
    '#B9F6CA',
    '#69F0AE',
    '#00E676',
    '#00C853',
    '#F1F8E9',
    '#DCEDC8',
    '#C5E1A5',
    '#AED581',
    '#9CCC65',
    '#8BC34A',
    '#7CB342',
    '#689F38',
    '#558B2F',
    '#33691E',
    '#CCFF90',
    '#B2FF59',
    '#76FF03',
    '#64DD17',
    '#F9FBE7',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775',
    '#D4E157',
    '#CDDC39',
    '#C0CA33',
    '#AFB42B',
    '#9E9D24',
    '#827717',
    '#F4FF81',
    '#EEFF41',
    '#C6FF00',
    '#AEEA00',
    '#FFFDE7',
    '#FFF9C4',
    '#FFF59D',
    '#FFF176',
    '#FFEE58',
    '#FFEB3B',
    '#FDD835',
    '#FBC02D',
    '#F9A825',
    '#F57F17',
    '#FFFF8D',
    '#FFFF00',
    '#FFEA00',
    '#FFD600',
    '#FFF8E1',
    '#FFECB3',
    '#FFE082',
    '#FFD54F',
    '#FFCA28',
    '#FFC107',
    '#FFB300',
    '#FFA000',
    '#FF8F00',
    '#FF6F00',
    '#FFE57F',
    '#FFD740',
    '#FFC400',
    '#FFAB00',
    '#FFF3E0',
    '#FFE0B2',
    '#FFCC80',
    '#FFB74D',
    '#FFA726',
    '#FF9800',
    '#FB8C00',
    '#F57C00',
    '#EF6C00',
    '#E65100',
    '#FFD180',
    '#FFAB40',
    '#FF9100',
    '#FF6D00',
    '#FBE9E7',
    '#FFCCBC',
    '#FFAB91',
    '#FF8A65',
    '#FF7043',
    '#FF5722',
    '#F4511E',
    '#E64A19',
    '#D84315',
    '#BF360C',
    '#FF9E80',
    '#FF6E40',
    '#FF3D00',
    '#DD2C00',
    '#EFEBE9',
    '#D7CCC8',
    '#BCAAA4',
    '#A1887F',
    '#8D6E63',
    '#795548',
    '#6D4C41',
    '#5D4037',
    '#4E342E',
    '#3E2723',
    '#FAFAFA',
    '#F5F5F5',
    '#EEEEEE',
    '#E0E0E0',
    '#BDBDBD',
    '#9E9E9E',
    '#757575',
    '#616161',
    '#424242',
    '#212121',
    '#ECEFF1',
    '#CFD8DC',
    '#B0BEC5',
    '#90A4AE',
    '#78909C',
    '#607D8B',
    '#546E7A',
    '#455A64',
    '#37474F',
    '#263238'
];

export const opts = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-default', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#67ba04', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};

export const COLORS = palette.sort(() => (Math.random() > 0.5) ? 1 : -1);

export function getRefs(userId) {
    return ({
        games: collection(db, `users/${userId}/games`),
        plays: collection(db, `users/${userId}/plays`),
        players: collection(db, `users/${userId}/players`),
        user: collection(db, `users/${userId}/user`),
        favourites: collection(db, `users/${userId}/favourites`),
 })
}

export async function getPlayerRef(playerId) {
    const userId = localStorage.getItem("userId");
    let docId;

    const q = getPlayerQueryById(userId, playerId);

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(( doc) => {
        docId = doc.id;
    });

    return  doc(db, `users/${userId}/players`, docId);
}

export async function filterList(e, data, list, func) {
    const value = e.target.value;
    const userId = localStorage.getItem("userId");

    if (value) {
        const filteredElements = data.filter(el => el.name.toLowerCase().includes(value.toLowerCase()));
        list.innerHTML = "";

        if (filteredElements.length > 0) {
            filteredElements.forEach(el => {
                func(el, userId);
            })
        } else {
            list.innerHTML = `<p>The list is empty</p>`
        }
    } else {
        list.innerHTML = "";

        data.forEach(el => {
            func(el, userId);
        })
    }
}

export function getPlayerQueryById(userId, playerId) {
    return (userId === playerId
        ? query(getRefs(userId).players, where("id", "==", playerId))
        : query(getRefs(userId).players, where("id", "==", Number(playerId))));
}
export async function isGameInFavourites(id, userId) {
    const q = query(getRefs(userId).favourites, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return false;
    } else {
        return true;
    }
}

export function toggleFavourites(e, {id, name, url}, userId) {
    const input = e.currentTarget;

    if (input.checked) {
        addToFavourites(id, name, url, userId);
    } else {
        removeFromFavourites(id, userId);
    }
}

export async function addToFavourites(id, name, url, userId) {
    try {
        if (await isGameInFavourites(id)) {
            Notify.failure('The game is already in favourites');
        } else {
            await addDoc(getRefs(userId).favourites, {id, name, url});
            Notify.success('The game is added to favourites');
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function removeFromFavourites(id, userId) {
    try {
        let docId = null;
        const q = query(getRefs(userId).favourites, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            docId = doc.id;
        });

        await deleteDoc(doc(getRefs(userId).favourites, docId));
        Notify.success('The game is removed from favourites');
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

export function handleTabsClick(e, tab, parent) {
    const tabcontent = parent.querySelectorAll(".tabcontent");
    const tablinks = parent.querySelectorAll(".tablinks");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    const activeTab = parent.querySelector(`#${tab}`);
    activeTab.style.display = "block";
    [...parent.children].forEach(el => el.classList.remove("active-tab"));
    activeTab.classList.add("active-tab");
    e.currentTarget.className += " active";
}
