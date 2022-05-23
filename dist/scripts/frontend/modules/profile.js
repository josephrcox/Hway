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
var profile_avatar = document.getElementsByClassName('profile-info_avatar_name')[0];
var profile_stats = document.getElementsByClassName('profile-info_stats')[0];
var profile_feed = document.getElementsByClassName('profile-feed')[0];
var profile_stats_table = document.getElementsByClassName('profile-info_stats_table')[0];
var profile_avatar_file = document.getElementById('avatar_file');
var profile_avatar_file_label = document.getElementById('avatar_file_label');
var profile_username = window.location.pathname.split('/user/')[1];
var profile_user;
import { loadPostOrPostObjects } from "../main.js";
import { currentUserID, currentUsername } from "./auth.js";
import { commentObject } from "./objects/comment.js";
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, i, c, d;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('/api/get/user/' + profile_username + '/none')];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                profile_avatar.children[0].src = data.avatar;
                profile_avatar.children[1].innerText = profile_username;
                profile_stats_table.innerHTML += "... joined on  <span class='profile-stat'>" + data.statistics.misc.account_creation_date[0] + "</span>";
                profile_stats_table.innerHTML += "<br/>";
                profile_stats_table.innerHTML += "... has a score of <span class='profile-stat'>" + data.statistics.score + "</span>";
                profile_stats_table.innerHTML += "<br/>";
                profile_stats_table.innerHTML += "... has created  <span class='profile-stat'>" + data.statistics.posts.created_num + "</span> posts";
                profile_stats_table.innerHTML += "<br/>";
                profile_stats_table.innerHTML += "... has created  <span class='profile-stat'>" + data.statistics.comments.created_num + "</span> comments";
                return [4 /*yield*/, fetch('/api/get/posts/user/' + profile_username)];
            case 3:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 4:
                data = _a.sent();
                loadPostOrPostObjects(data);
                return [4 /*yield*/, fetch('/api/get/user/' + profile_username + '/all_comments')];
            case 5:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 6:
                data = _a.sent();
                for (i = 0; i < data.length; i++) {
                    c = Object.create(commentObject);
                    c.body = data[i][0].body;
                    c.poster = data[i][0].poster;
                    c.posterID = data[i][0].posterID;
                    c.totalVotes = "";
                    c.id = data[i][0]._id;
                    c.parentid = data[i][1];
                    d = new Date(data[i][0].createdAt);
                    c.createdAt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
                    if (data[i][0].users_voted.includes(currentUserID)) {
                        c.currentUserUpvoted = true;
                    }
                    else {
                        c.currentUserUpvoted = false;
                    }
                    if (data[i][0].posterID == currentUserID) {
                        c.currentUserAdmin = true;
                    }
                    else {
                        c.currentUserAdmin = false;
                    }
                    c.display();
                }
                if (profile_username == currentUsername) {
                    profile_avatar_file_label.style.display = 'block';
                }
                return [2 /*return*/];
        }
    });
}); };
init();
profile_avatar_file.addEventListener("change", function () {
    return __awaiter(this, void 0, void 0, function () {
        var body, fetchResponse, data, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = new FormData();
                    body.set('key', 'e23bc3a1c5f2ec99cc1aa7676dc0f3fb');
                    body.append('image', profile_avatar_file.files[0]);
                    return [4 /*yield*/, fetch('https://api.imgbb.com/1/upload', {
                            method: 'POST',
                            body: body
                        })];
                case 1:
                    fetchResponse = _a.sent();
                    return [4 /*yield*/, fetchResponse.json()];
                case 2:
                    data = _a.sent();
                    url = (JSON.stringify(data.data.image.url)).replace(/["]+/g, '');
                    changeAvatar(url);
                    return [2 /*return*/];
            }
        });
    });
});
function changeAvatar(url) {
    return __awaiter(this, void 0, void 0, function () {
        var bodyJSON, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bodyJSON = {
                        "src": url,
                    };
                    return [4 /*yield*/, fetch('/api/put/user/' + currentUsername + '/avatar/', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'PUT',
                            body: JSON.stringify(bodyJSON)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.status == 'ok') {
                        profile_avatar.children[0].src = url;
                    }
                    if (data.status == 'error') {
                        alert(data.error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=profile.js.map