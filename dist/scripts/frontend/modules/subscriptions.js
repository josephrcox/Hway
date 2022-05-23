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
import { isUserLoggedIn } from "./auth.js";
export var subscribedTopics = [];
export var subscribedUsers = [];
var subscribe_input = document.getElementById('subscribe_topic_input');
var subscribe_submit = document.getElementById("subscribe_topic_submit");
export function apiGetSubscriptions(x) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, i, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subscribedTopics = [];
                    subscribedUsers = [];
                    return [4 /*yield*/, fetch('/api/get/user/' + x + "/subscriptions")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    for (i = 0; i < data.topics.length; i++) {
                        if (!subscribedTopics.includes(data.topics[i][0].toLowerCase())) {
                            subscribedTopics.push(data.topics[i][0].toLowerCase());
                        }
                    }
                    for (i = 0; i < data.users.length; i++) {
                        if (!subscribedUsers.includes(data.users[i][0].toLowerCase())) {
                            subscribedUsers.push(data.users[i][0].toLowerCase());
                        }
                    }
                    if (window.location.href.includes('/subscriptions')) {
                        showSubscriptions();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
export function isSubscribed(x) {
    if (subscribedTopics.indexOf(x) > -1 || subscribedUsers.indexOf(x) > -1) {
        return true;
    }
    else {
        return false;
    }
}
export var subscribeTo = function (x, type) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, fetchResponse, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!isUserLoggedIn) return [3 /*break*/, 1];
                window.location.href = '/login/';
                return [3 /*break*/, 13];
            case 1:
                settings = {
                    method: 'PUT',
                };
                if (!!isSubscribed(x)) return [3 /*break*/, 6];
                if (!(type == "topic")) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch('/api/put/subscribe/' + x, settings)];
            case 2:
                fetchResponse = _a.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!(type == "user")) return [3 /*break*/, 5];
                return [4 /*yield*/, fetch('/api/put/subscribe_user/' + x, settings)];
            case 4:
                fetchResponse = _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6:
                if (!(type == "topic")) return [3 /*break*/, 8];
                return [4 /*yield*/, fetch('/api/put/unsubscribe/' + x, settings)];
            case 7:
                fetchResponse = _a.sent();
                return [3 /*break*/, 10];
            case 8:
                if (!(type == "user")) return [3 /*break*/, 10];
                return [4 /*yield*/, fetch('/api/put/unsubscribe_user/' + x, settings)];
            case 9:
                fetchResponse = _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, fetchResponse.json()];
            case 11:
                data = _a.sent();
                if (!(data.status = 'ok')) return [3 /*break*/, 13];
                return [4 /*yield*/, apiGetSubscriptions(localStorage.getItem('currentUsername') + "")];
            case 12:
                _a.sent();
                subscriptionToggle();
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
function subscriptionToggle() {
    var elems = document.getElementsByClassName('post-subscription-button');
    for (var i = 0; i < elems.length; i++) {
        var e = elems[i];
        if (isSubscribed(e.dataset.topic + "")) {
            e.src = "/dist/images/square-minus-solid.svg";
            e.classList.add('filter_purple');
            e.classList.remove('filter_green');
        }
        else {
            e.src = "/dist/images/square-plus-solid.svg";
            e.classList.add('filter_green');
            e.classList.remove('filter_purple');
        }
    }
}
function showSubscriptions() {
    document.getElementById("subscriptions_page_container").innerHTML = "";
    startLoaders();
    console.log(subscribedTopics, subscribedUsers);
    for (var i = 0; i < subscribedTopics.length; i++) {
        var t = Object.create(topicObject);
        t.name = subscribedTopics[i];
        t.isUser = false;
        t.display();
    }
    for (var i = 0; i < subscribedUsers.length; i++) {
        var t = Object.create(topicObject);
        t.name = subscribedUsers[i];
        t.isUser = true;
        t.display();
    }
    stopLoaders();
}
var topicObject = {
    name: "",
    isUser: false,
    display: function () {
        var topicContainer = document.createElement("div");
        topicContainer.setAttribute("id", "topicContainer_" + this.name);
        topicContainer.setAttribute("class", "topicContainer postContainer");
        topicContainer.classList.add('animated_entry');
        var topicFrame = document.createElement("div");
        topicFrame.setAttribute("id", "topicFrame_" + this.name);
        topicFrame.setAttribute("class", "topicFrame postFrame");
        var href = "";
        if (!this.isUser) {
            href = '/h/' + topicFrame.id.split('_')[1];
        }
        else if (this.isUser) {
            href = '/user/' + topicFrame.id.split('_')[1].split(" ")[0];
        }
        topicFrame.innerHTML = "<a href='" + href + "'>" + this.name + "</a>";
        var unsub = document.createElement('img');
        unsub.src = "/dist/images/square-minus-solid.svg";
        unsub.classList.add('filter_purple');
        unsub.classList.remove('filter_green');
        unsub.classList.add('post-subscription-button');
        unsub.dataset.topic = this.name;
        unsub.onclick = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, subscribeTo(unsub.dataset.topic + "", "topic")];
                        case 1:
                            _a.sent();
                            topicContainer.classList.add('animated_exit');
                            return [2 /*return*/];
                    }
                });
            });
        };
        topicFrame.append(unsub);
        topicContainer.append(topicFrame);
        document.getElementById("subscriptions_page_container").append(topicContainer);
    }
};
export function subscribe_init() {
    subscribe_submit.addEventListener('click', function () {
        if (subscribe_input.value.length > 0) {
            subscribeTo(subscribe_input.value.toLowerCase(), 'topic');
        }
        apiGetSubscriptions(localStorage.getItem('currentUsername') + "");
    });
}
//# sourceMappingURL=subscriptions.js.map