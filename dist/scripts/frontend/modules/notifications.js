var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { startLoaders, stopLoaders } from "../main.js";
var notifsBell = document.getElementById("header-notifs-bell");
var viewCleared = document.getElementById("notif_viewcleared");
var sorting = document.getElementById("notif_sorting");
var notifArray = document.getElementById('notif_array');
var clearAll = document.getElementById("notif_clearall");
export function apiGetNotificationCount() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/get/notification_count')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setBell(data.count);
                    return [2 /*return*/];
            }
        });
    });
}
function setBell(x) {
    if (x > 0) {
        notifsBell.innerText = x + "";
        notifsBell.classList.add('active');
    }
    else {
        notifsBell.innerText = "";
        notifsBell.classList.remove('active');
    }
}
export function apiGetNotifications(cleared) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startLoaders();
                    return [4 /*yield*/, fetch('/api/get/notifications/' + cleared)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.length < 1) {
                        notifArray.innerHTML = 'No new notifications!';
                        clearAll.style.display = 'none';
                        sorting.style.display = 'none';
                        stopLoaders();
                    }
                    else {
                        sorting.style.display = 'block';
                        displayNotifs(data, sorting.dataset.sortingoption + "");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
export function initNotificationButtons() {
    var _this = this;
    if (viewCleared.dataset.cleared == "false") {
        clearAll.style.display = 'block';
    }
    viewCleared.addEventListener('click', function () {
        if (viewCleared.dataset.cleared == "true") {
            viewCleared.dataset.cleared = "false";
            viewCleared.innerText = "View cleared";
            clearAll.style.display = 'block';
        }
        else {
            viewCleared.dataset.cleared = "true";
            viewCleared.innerText = "View new";
            clearAll.style.display = 'none';
        }
        notifArray.innerHTML = "";
        apiGetNotifications(viewCleared.dataset.cleared);
    });
    sorting.addEventListener('click', function () {
        if (sorting.dataset.sortingoption == "0") {
            sorting.dataset.sortingoption = "1";
            sorting.innerText = "Newest to oldest";
        }
        else {
            sorting.dataset.sortingoption = "0";
            sorting.innerText = "Oldest to newest";
        }
        notifArray.innerHTML = "";
        apiGetNotifications(sorting.dataset.sortingoption + "");
    });
    clearAll.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var fetchResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notifArray.innerHTML = 'No new notifications!';
                    clearAll.style.display = 'none';
                    sorting.style.display = 'none';
                    return [4 /*yield*/, fetch('/api/post/notif/clear/', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST'
                        })];
                case 1:
                    fetchResponse = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
function displayNotifs(n, sorting) {
    var s = parseInt(sorting);
    console.log(n);
    if (sorting == '0') {
        n.sort(function (a, b) { return a.timestamp - b.timestamp; });
    }
    else {
        n.sort(function (a, b) { return b.timestamp - a.timestamp; });
    }
    var currentTimestamp = new Date();
    var _loop_1 = function (i) {
        var diffMs = currentTimestamp.getTime() - n[i].timestamp;
        var timeago = 'less than 1 minute ago';
        if (diffMs > 60000) {
            timeago = Math.round(diffMs / 60000) + ' minutes ago';
        }
        if (diffMs > 3600000) {
            timeago = Math.round(diffMs / 3600000) + ' hours ago';
        }
        if (diffMs > 86400000) {
            timeago = Math.round(diffMs / 86400000) + ' days ago';
        }
        if (diffMs > 604800000) {
            timeago = Math.round(diffMs / 604800000) + ' weeks ago';
        }
        if (diffMs > (604800000 * 31)) {
            timeago = Math.round(diffMs / (604800000 * 31)) + ' months ago';
        }
        if (diffMs > 31556952000) {
            timeago = Math.round(diffMs / 31556952000) + ' years ago';
        }
        var c = document.createElement("div");
        c.setAttribute("class", "notifContainer");
        c.classList.add('animated_entry');
        c.setAttribute("id", "notifContainer_" + i);
        var anb = document.createElement("div");
        anb.setAttribute("class", "notifAvatarAndBody");
        anb.style.display = 'flex';
        var nb = document.createElement("div");
        nb.setAttribute("class", "notifBody");
        nb.style.paddingLeft = '10px';
        if (n[i].avatar) {
            var avatar = document.createElement("img");
            avatar.src = n[i].avatar;
            avatar.style.width = '50px';
            avatar.style.height = 'auto';
            avatar.style.marginLeft = '-6px';
            avatar.style.objectFit = 'contain';
            anb.append(avatar);
        }
        var check = document.createElement("span");
        check.setAttribute("class", "notifCheck noselect");
        check.innerHTML = "✔";
        check.dataset.timestamp = n[i].timestamp;
        check.onclick = function () {
            removeNotif(i, "notifContainer_" + i, check.dataset.timestamp + "");
        };
        if (n[i].type == 'comment') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>" + timeago + " — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " replied to '<a href='/p/" + n[i].postID + "'>" + n[i].post.title + "</a>':</span><br/> " + n[i].body;
        }
        if (n[i].type == 'comment_nested') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>" + timeago + " — </span><span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " replied to '<a href='/p/" + n[i].postID + "'>" + n[i].comment_body + "' in '" + n[i].post.title + "</a>':</span><br/> " + n[i].body;
        }
        if (n[i].type == 'mention') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>" + timeago + " — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " mentioned you in '<a href='/p/" + n[i].postID + "'>" + n[i].post.title + "</a>'" + ":</span><br/> " + n[i].body;
        }
        anb.append(nb);
        if (viewCleared.dataset.cleared == "false") {
            c.append(anb, check);
        }
        else {
            c.append(anb);
        }
        notifArray.append(c);
    };
    for (var i = 0; i < n.length; i++) {
        _loop_1(i);
    }
    stopLoaders();
}
var removeNotif = function (index, id, timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                settings = {
                    method: 'PUT',
                };
                return [4 /*yield*/, fetch('/api/put/notif/remove/' + timestamp, settings)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                if (data.status == 'ok') {
                    notifsBell.innerText = parseInt(notifsBell.innerText) - 1 + "";
                    document.getElementById(id).innerHTML = "";
                    if (parseInt(notifsBell.innerText) == 0) {
                        notifArray.innerHTML = 'No new notifications!';
                        clearAll.style.display = 'none';
                        sorting.style.display = 'none';
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=notifications.js.map