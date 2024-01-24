// _____search games_____ 
const gameListEl = document.querySelector(".game-list");
const searhFormEl = document.querySelector(".search-form");
const submitButtonEl = document.querySelector(".submit-button");

if (submitButtonEl) {
    submitButtonEl.addEventListener("click", e => submitForm(e));
}

const defaultImage = "./images/no_image.jpg";
const addGameImage = "./images/plus.png";
const gameData = {};

function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(searhFormEl, submitButtonEl);

    for (const [_, value] of formData) {
        if (value) {
            gameSearch(value);
        } else {
            gameListEl.innerHTML = `<p>Type something...</p>`
        }   
    }
}

async function fetchAPI(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network response was not OK");
        }

        const xmlString = await response.text();
        var XmlNode = new DOMParser().parseFromString(xmlString, 'text/xml');
        return xmlToJson(XmlNode)
    } catch (error) {
        gameListEl.innerHTML = `<p>Oops... Something went wrong</p>`
        console.error("There has been a problem with your fetch operation:", error);
    }
}

async function gameSearch(name) {
    const url = `https://boardgamegeek.com/xmlapi/search?search=${name}`;

    const data = await fetchAPI(url);

    if (!data.boardgames.boardgame) {
        handleWrongSearchRequest(name);
    } else {
        getGameByName(data);
    }
}

async function getGameByName(gamesObj) {
    gameListEl.innerHTML = "";
    const games = gamesObj.boardgames.boardgame;

    if (games.length) { 
        games.forEach(async item => {
            const name = item.name;
            const year = item.yearpublished || "";
            const id = item._attributes.objectid;
            const {url, category, description, otherNames} = await getGameById(id);
            gameData[id] = { id, name, year, url, category, description };
            renderGames(gameData[id]);
        });
    } else {
        const name = games.name;
        const year = games.yearpublished || "";
        const id = games._attributes.objectid;
        const {url, category, description, otherNames} = await getGameById(id);
        gameData[id] = { id, name, year, url, category, description };
        renderGames(gameData[id]);
    }

}

async function getGameById(id) {
    const url = `https://boardgamegeek.com/xmlapi/boardgame/${id}`;

    const data = await fetchAPI(url);

    return ({
        url: data.boardgames.boardgame.image || defaultImage,
        category: data.boardgames.boardgame.boardgamesubdomain || [],
        description: data.boardgames.boardgame.description,
    })
} 

function renderGames(obj) {
    const categories = obj.category;
    const gameListItem = document.createElement("li");
    gameListItem.classList.add("game-list-item");

    const categoriesEl = document.createElement("p");
    
    if (Array.isArray(categories)) {
        categories.forEach(el => {
            const span = document.createElement("span");
            span.innerHTML = el;
            categoriesEl.insertAdjacentElement("beforeend", span);
        })
    } else {
        const span = document.createElement("span");
        span.innerHTML = categories;
        categoriesEl.insertAdjacentElement("beforeend", span);
    }

    gameListItem.setAttribute("data-id", obj.id);
    gameListItem.innerHTML =`<button class="accordion">${obj.name}<img class="thumbnail" src=${obj.url}></button><div class="panel"><img class="image" src=${obj.url}><p>${obj.year || ""}</p><p>${categories.length > 0 ? categoriesEl.outerHTML : ""}</p><p>${obj.description}</p><button><img src=${addGameImage}></button></div>`
    const accordionButtonEl = gameListItem.querySelector(".accordion");
    accordionButtonEl.addEventListener("click", e => toggleAccordion(e));
    gameListEl.insertAdjacentElement("beforeend", gameListItem);
}

function toggleAccordion(e) {
    const item = e.currentTarget.parentElement;
    const thumbnail = item.querySelector(".thumbnail");
    const accordion =  item.querySelector(".accordion");
    const panel = item.querySelector(".panel");

    accordion.classList.toggle("active");

    if (panel.style.display === "block") {
        panel.style.display = "none";
        thumbnail.style.display = "block";
    } else {
        panel.style.display = "block";
        thumbnail.style.display = "none";
    }
}

function handleWrongSearchRequest(searchValue) {
    gameListEl.innerHTML = `<p>There is no game called <span>"${searchValue}"</span></p>`
}


function xmlToJson(xml) {
    // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["_attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["_attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }
  
    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
      return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
        return text + node.nodeValue;
      }, "");
    } else if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
}

// _____main_____ 



