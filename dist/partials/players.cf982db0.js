// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"5eP3g":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "72ee342acf982db0";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, importScripts */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else if ("reload" in location) location.reload();
            else {
                // Web extension context
                var ext = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome;
                if (ext && ext.runtime && ext.runtime.reload) ext.runtime.reload();
            }
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                if (asset.type === "js") {
                    if (typeof document !== "undefined") {
                        let script = document.createElement("script");
                        script.src = asset.url;
                        return new Promise((resolve, reject)=>{
                            var _document$head;
                            script.onload = ()=>resolve(script);
                            script.onerror = reject;
                            (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
                        });
                    } else if (typeof importScripts === "function") return new Promise((resolve, reject)=>{
                        try {
                            importScripts(asset.url);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id1][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"bRgy2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _auth = require("firebase/auth");
var _login = require("./login");
var _pieChart = require("./pieChart");
var _constants = require("./constants");
var _firestore = require("firebase/firestore");
var _notiflixNotifyAio = require("notiflix/build/notiflix-notify-aio");
var _lodashDebounce = require("lodash.debounce");
var _lodashDebounceDefault = parcelHelpers.interopDefault(_lodashDebounce);
var _spinJs = require("spin.js");
const playersEl = document.querySelector(".players");
const renameFormEl = document.querySelector("[id='rename-form']");
const hideFormEl = document.querySelector("[id='hide-form']");
const deleteFormEl = document.querySelector("[id='delete-form']");
const modalSettingsOverlayEl = document.querySelector(".players-settings-modal-overlay");
const closeLoginModalButtonEls = document.querySelectorAll(".close-player-settings-modal");
const submitFormButtonsEl = modalSettingsOverlayEl.querySelectorAll("button[type='submit']");
const filterLabelEl = document.querySelector(".filter-label");
const filterEl = document.querySelector(".filter");
const target = document.querySelector(".container");
closeLoginModalButtonEls.forEach((btn)=>btn.addEventListener("click", closePlayerSettingModal));
submitFormButtonsEl.forEach((btn)=>btn.addEventListener("click", (e)=>submitPlayerSettingsForm(e)));
const playersNames = [];
let playersData = [];
let i = 0;
let render = false;
filterEl.addEventListener("keydown", (0, _lodashDebounceDefault.default)((e)=>(0, _constants.filterList)(e, playersData, playersEl, playersTemplate), 500));
const spinner = new (0, _spinJs.Spinner)((0, _constants.opts)).spin(target);
(0, _auth.onAuthStateChanged)((0, _login.auth), async (user)=>{
    if (user) {
        playersEl.innerHTML = "";
        const q = (0, _firestore.query)((0, _constants.getRefs)(user.uid).players);
        const querySnapshot = await (0, _firestore.getDocs)(q);
        const length = querySnapshot.docs.length;
        querySnapshot.forEach((doc)=>{
            i++;
            if (i === length) render = true;
            filterLabelEl.classList.remove("hidden");
            const data = doc.data();
            playersData.push(data);
            playersNames.push({
                name: data.name.toLowerCase(),
                id: data.id.toString()
            });
            playersTemplate(data, user.uid, render);
        });
    }
});
async function playersTemplate(player, userId, render1) {
    if (player.hidden) return;
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
            <ul id="gamesId" class="tabcontent players empty"></ul>
            
            <div id="chartId" class="tabcontent players empty">
                <canvas></canvas>
                <div class="legend"></div>
            </div>
            
            <div id="settingsId" class="tabcontent players">
              <button class="rename-button">Rename player</button>
              <button class="hide-button">Hide player</button>
              <button class="delete-button">Delete player</button>
            </div>
        </div>`;
    const accordionEl = playerItem.querySelector(".accordion");
    const gameList = playerItem.querySelector("#gamesId");
    const chartList = playerItem.querySelector("#chartId");
    const settingsList = playerItem.querySelector("#settingsId");
    settingsList.addEventListener("click", (e)=>showSettingsForm(e, player, accordionEl));
    accordionEl.addEventListener("click", (e)=>toggleAccordion(e));
    playerItem.querySelector(".games").addEventListener("click", (e)=>toggleTabs(e, "gamesId", playerItem));
    playerItem.querySelector(".chartPie").addEventListener("click", (e)=>toggleTabs(e, "chartId", playerItem, pieChartData, chartList));
    playerItem.querySelector(".settings").addEventListener("click", (e)=>toggleTabs(e, "settingsId", playerItem));
    stats.map(async (game)=>{
        const q = (0, _firestore.query)((0, _constants.getRefs)(userId).games, (0, _firestore.where)("id", "==", game.gameId));
        const querySnapshot = await (0, _firestore.getDocs)(q);
        querySnapshot.forEach((doc)=>{
            const data = doc.data();
            const averageScore = Math.round(game.sumOfScore / game.numberOfPlays);
            const gameListItem = document.createElement("li");
            gameListItem.classList.add("game-list-item");
            gameListItem.innerHTML = `<div><p>${data.name}</p><img class="thumbnail" src=${data.url}><p>Best score: ${game.bestScore}</p><p>Average score: ${averageScore}</p><p>Plays: ${game.numberOfPlays}</p></div>`;
            gameList.insertAdjacentElement("beforeend", gameListItem);
            if (gameList.classList.contains("empty")) gameList.classList.remove("empty");
            const pieChartGameData = {
                name: data.name,
                plays: game.numberOfPlays
            };
            pieChartData.push(pieChartGameData);
        });
    });
    playersEl.insertAdjacentElement("beforeend", playerItem);
    playersEl.querySelectorAll("#defaultOpen").forEach((item)=>item.click());
    if (render1) target.removeChild(spinner.el);
}
function toggleAccordion(e) {
    const button = e.currentTarget;
    button.classList.toggle("active");
    const panel = button.nextElementSibling;
    if (panel.style.display === "block") panel.style.display = "none";
    else panel.style.display = "block";
}
async function getStats(playerId, userId) {
    const stats = [];
    const ids = [];
    const q = (0, _firestore.query)((0, _constants.getRefs)(userId).plays, (0, _firestore.where)("playerId", "==", playerId.toString()));
    const querySnapshot = await (0, _firestore.getDocs)(q);
    querySnapshot.forEach((doc)=>{
        const play = doc.data();
        if (!ids.includes(play.gameId)) {
            const game = {
                bestScore: Number(play.score),
                numberOfPlays: 1,
                sumOfScore: Number(play.score),
                gameId: play.gameId
            };
            stats.push(game);
            ids.push(play.gameId);
        } else stats.forEach((game)=>{
            if (game.gameId === play.gameId) {
                game.bestScore = game.bestScore > Number(play.score) ? game.bestScore : Number(play.score);
                game.numberOfPlays = game.numberOfPlays + 1;
                game.sumOfScore = game.sumOfScore + Number(play.score);
            }
        });
    });
    return stats;
}
function toggleTabs(e, tab, parent, pieChartData, selector) {
    if (tab === "chartId") createChart(selector, pieChartData);
    (0, _constants.handleTabsClick)(e, tab, parent);
}
function createChart(parent, data) {
    const pieChart = {};
    if (data.length !== 0) {
        data.forEach((game)=>{
            pieChart[game.name] = game.plays;
        });
        if (parent.classList.contains("empty")) parent.classList.remove("empty");
        const canvas = parent.querySelector("canvas");
        const legend = parent.querySelector(".legend");
        const options = {
            canvas,
            pieChart,
            colors: (0, _constants.COLORS),
            legend
        };
        legend.innerHTML = "";
        const gamesPieChart = new (0, _pieChart.PieChart)(options);
        gamesPieChart.drawSlices();
        gamesPieChart.drawLegend();
    }
}
async function renamePlayer(playerId, submitButton) {
    const allPlayerItems = playersEl.children;
    const formData = new FormData(renameFormEl, submitButton);
    const userId = localStorage.getItem("userId");
    let newName = null;
    for (const [_, value] of formData)if (value.trim()) newName = value;
    else (0, _notiflixNotifyAio.Notify).failure("Value shouln't be empty");
    for (const player2 of playersNames)if (player2.name === newName.toLowerCase()) {
        (0, _notiflixNotifyAio.Notify).failure("Such player already exists");
        return;
    }
    try {
        const playerRef = await (0, _constants.getPlayerRef)(playerId);
        playersData.forEach((player)=>{
            if (player.id.toString() === playerId) player.name = newName;
        });
        await (0, _firestore.updateDoc)(playerRef, {
            name: newName
        });
        for (const player1 of playersNames)if (player1.id === playerId) player1.name = newName.toLowerCase();
        (0, _notiflixNotifyAio.Notify).success("The player is renamed successfully");
        // if player is user
        if (userId === playerId) {
            const userRef = (0, _firestore.doc)((0, _login.db), `users/${userId}/user`, userId);
            await (0, _firestore.updateDoc)(userRef, {
                name: newName
            });
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    [
        ...allPlayerItems
    ].forEach((item)=>{
        if (item.dataset.playerItemId === playerId) item.querySelector("button").innerHTML = newName;
    });
    renameFormEl.reset();
    closePlayerSettingModal();
}
async function hidePlayer(playerId) {
    hidePlayerFromPage(playerId);
    try {
        const playerRef = await (0, _constants.getPlayerRef)(playerId);
        playersData.forEach((player)=>{
            if (player.id.toString() === playerId) player.hidden = true;
        });
        await (0, _firestore.updateDoc)(playerRef, {
            hidden: true
        });
        (0, _notiflixNotifyAio.Notify).success("The player is hidden successfully");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    closePlayerSettingModal();
}
async function deletePlayer(playerId) {
    hidePlayerFromPage(playerId);
    try {
        const playerRef = await (0, _constants.getPlayerRef)(playerId);
        playersData = playersData.filter((player)=>player.id.toString() !== playerId);
        await (0, _firestore.deleteDoc)(playerRef);
        (0, _notiflixNotifyAio.Notify).success("The player is deleted successfully");
    } catch (e) {
        console.error("Error removing document: ", e);
    }
    closePlayerSettingModal();
}
function showSettingsForm(e, player, accordion) {
    const playerName = accordion.innerText;
    const button = e.target;
    modalSettingsOverlayEl.classList.remove("hidden");
    if (button.classList.contains("rename-button")) {
        hideFormEl.style.display = "none";
        renameFormEl.style.display = "flex";
        deleteFormEl.style.display = "none";
        const submitButtonEl = renameFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Rename ${playerName}`;
    } else if (button.classList.contains("hide-button")) {
        hideFormEl.style.display = "flex";
        renameFormEl.style.display = "none";
        deleteFormEl.style.display = "none";
        const submitButtonEl = hideFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Hide ${playerName}`;
    } else {
        hideFormEl.style.display = "none";
        renameFormEl.style.display = "none";
        deleteFormEl.style.display = "flex";
        const submitButtonEl = deleteFormEl.querySelector("button[type='submit']");
        submitButtonEl.setAttribute("data-playerid", player.id);
        submitButtonEl.innerText = `Delete ${playerName}`;
    }
}
function closePlayerSettingModal() {
    modalSettingsOverlayEl.classList.add("hidden");
}
function submitPlayerSettingsForm(e) {
    e.preventDefault();
    const actionButton = e.target;
    if (actionButton.dataset.action === "hide-submit-btn") hidePlayer(actionButton.dataset.playerid);
    else if (actionButton.dataset.action === "rename-submit-btn") renamePlayer(actionButton.dataset.playerid, actionButton);
    else deletePlayer(actionButton.dataset.playerid);
}
function hidePlayerFromPage(playerId) {
    const allPlayerItems = playersEl.children;
    [
        ...allPlayerItems
    ].forEach((item)=>{
        if (item.dataset.playerItemId === playerId) item.classList.add("hidden");
    });
}

},{"firebase/auth":"79vzg","./login":"47T64","./pieChart":"dlNL4","./constants":"itKcQ","firebase/firestore":"8A4BC","notiflix/build/notiflix-notify-aio":"eXQLZ","lodash.debounce":"3JP5n","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","spin.js":"iZQ5x"}],"dlNL4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PieChart", ()=>PieChart);
class PieChart {
    constructor(options){
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.totalPlays = [
            ...Object.values(this.options.pieChart)
        ].reduce((a, b)=>a + b, 0);
        this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        this.legend = options.legend;
    }
    drawSlices() {
        let colorIndex = 0;
        let startAngle = -Math.PI / 2;
        for(const gameName in this.options.pieChart){
            const numberOfPlays = this.options.pieChart[gameName];
            const sliceAngle = 2 * Math.PI * numberOfPlays / this.totalPlays;
            this.drawPieSlice(this.ctx, this.canvas.width / 2, this.canvas.height / 2, this.radius, startAngle, startAngle + sliceAngle, this.colors[colorIndex]);
            startAngle += sliceAngle;
            colorIndex += 1;
        }
    }
    drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, fillColor) {
        ctx.save();
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    drawLegend() {
        let index = 0;
        let legend = this.legend;
        let ul = document.createElement("ul");
        for (let gameName of Object.keys(this.options.pieChart)){
            const numberOfPlays = this.options.pieChart[gameName];
            const labelText = Math.round(100 * numberOfPlays / this.totalPlays);
            const li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid " + this.colors[index];
            li.style.padding = "5px";
            li.textContent = `${gameName} (${labelText}%)`;
            ul.append(li);
            index++;
        }
        legend.append(ul);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3JP5n":[function(require,module,exports) {
var global = arguments[3];
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the `TypeError` message for "Functions" methods. */ var FUNC_ERROR_TEXT = "Expected a function";
/** Used as references for various `Number` constants. */ var NAN = 0 / 0;
/** `Object#toString` result references. */ var symbolTag = "[object Symbol]";
/** Used to match leading and trailing whitespace. */ var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */ var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var freeParseInt = parseInt;
/** Detect free variable `global` from Node.js. */ var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
/** Detect free variable `self`. */ var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function("return this")();
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeMax = Math.max, nativeMin = Math.min;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */ var now = function() {
    return root.Date.now();
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */ function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result1, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
        var args = lastArgs, thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result1 = func.apply(thisArg, args);
        return result1;
    }
    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result1;
    }
    function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result = wait - timeSinceLastCall;
        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
    }
    function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) return trailingEdge(time);
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) return invokeFunc(time);
        lastArgs = lastThis = undefined;
        return result1;
    }
    function cancel() {
        if (timerId !== undefined) clearTimeout(timerId);
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result1 : trailingEdge(now());
    }
    function debounced() {
        var time = now(), isInvoking = shouldInvoke(time);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) return leadingEdge(lastCallTime);
            if (maxing) {
                // Handle invocations in a tight loop.
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
        return result1;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function toNumber(value) {
    if (typeof value == "number") return value;
    if (isSymbol(value)) return NAN;
    if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") return value === 0 ? value : +value;
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = debounce;

},{}],"iZQ5x":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Spinner", ()=>Spinner);
var __assign = undefined && undefined.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: "#000",
    fadeColor: "transparent",
    animation: "spinner-line-fade-default",
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: "spinner",
    top: "50%",
    left: "50%",
    shadow: "0 0 1px transparent",
    position: "absolute"
};
var Spinner = /** @class */ function() {
    function Spinner1(opts) {
        if (opts === void 0) opts = {};
        this.opts = __assign(__assign({}, defaults), opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */ Spinner1.prototype.spin = function(target) {
        this.stop();
        this.el = document.createElement("div");
        this.el.className = this.opts.className;
        this.el.setAttribute("role", "progressbar");
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")"
        });
        if (target) target.insertBefore(this.el, target.firstChild || null);
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */ Spinner1.prototype.stop = function() {
        if (this.el) {
            if (typeof requestAnimationFrame !== "undefined") cancelAnimationFrame(this.animateId);
            else clearTimeout(this.animateId);
            if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
            this.el = undefined;
        }
        return this;
    };
    return Spinner1;
}();
/**
 * Sets multiple style properties at once.
 */ function css(el, props) {
    for(var prop in props)el.style[prop] = props[prop];
    return el;
}
/**
 * Returns the line color from the given string or array.
 */ function getColor(color, idx) {
    return typeof color == "string" ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */ function drawLines(el, opts) {
    var borderRadius = Math.round(opts.corners * opts.width * 500) / 1000 + "px";
    var shadow = "none";
    if (opts.shadow === true) shadow = "0 2px 4px #000"; // default shadow
    else if (typeof opts.shadow === "string") shadow = opts.shadow;
    var shadows = parseBoxShadow(shadow);
    for(var i = 0; i < opts.lines; i++){
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement("div"), {
            position: "absolute",
            top: -opts.width / 2 + "px",
            width: opts.length + opts.width + "px",
            height: opts.width + "px",
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: "left",
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)"
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement("div"), {
            width: "100%",
            height: "100%",
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for(var _i = 0, _a = boxShadow.split(","); _i < _a.length; _i++){
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) continue; // invalid syntax
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) xUnits = yUnits;
        if (y === 0 && !yUnits) yUnits = xUnits;
        if (xUnits !== yUnits) continue; // units must match to use as coordinates
        shadows.push({
            prefix: matches[1] || "",
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8]
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */ function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for(var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++){
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + " " + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(", ");
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000, 
    ];
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["5eP3g","bRgy2"], "bRgy2", "parcelRequire2ffc")

//# sourceMappingURL=players.cf982db0.js.map
