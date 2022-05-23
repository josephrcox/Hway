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
import { postObject, postsArray } from "./modules/objects/post.js";
import { apiGetPostsByTopic, apiGetPostByID, apiGetPostsBySearchQuery } from "./modules/postLoader.js";
import { getPageType, getPageSearchQueries } from "./modules/pageAnalyzer.js";
import { commentObject, newCommentInputArea, commentSection } from "./modules/objects/comment.js";
import { newComment } from "./modules/createComment.js";
import { getUser, currentUserID, isUserLoggedIn, currentUsername } from "./modules/auth.js";
import { addSortingEvents, addPageNavigation } from "./modules/pageNavigator.js";
import { init, phrase, topic, bar } from "./modules/search.js";
import { apiGetNotifications, initNotificationButtons } from "./modules/notifications.js";
import { subscribe_init } from "./modules/subscriptions.js";
var new_comment_login = document.getElementById("commentSection_login_button");
var new_comment_textarea = document.getElementById("newCom_body");
var new_comment_submit = document.getElementById("newCom_submit");
var loaders = document.getElementsByClassName("loader");
var postsAndMore = document.getElementById('posts_and_more');
var filter_nsfw_checkbox = document.getElementById("filter_nsfw");
var header_login_button = document.getElementById('login_button');
var sorting_options = document.getElementById('hamburger_sorting');
export function loadMain(reset) {
    return __awaiter(this, void 0, void 0, function () {
        var x, _a, submit_new_comment, queries, params;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    localStorage.setItem("deletepostconfirmid", "");
                    localStorage.setItem("deletecommentconfirmid", "");
                    x = getPageType() || [];
                    addSortingEvents();
                    init();
                    return [4 /*yield*/, getUser()];
                case 1:
                    _b.sent();
                    if (reset) {
                        postsArray.innerHTML = "";
                    }
                    _a = x[0];
                    switch (_a) {
                        case "all": return [3 /*break*/, 2];
                        case "topic": return [3 /*break*/, 4];
                        case "post": return [3 /*break*/, 6];
                        case "createnewpost": return [3 /*break*/, 8];
                        case "search": return [3 /*break*/, 9];
                        case "notifications": return [3 /*break*/, 10];
                        case "home": return [3 /*break*/, 11];
                        case "subscriptions": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 13];
                case 2: return [4 /*yield*/, getPostsByTopic("all")];
                case 3:
                    _b.sent();
                    header_login_button.href = '/login/?ref=/all';
                    sorting_options.style.display = 'block';
                    return [3 /*break*/, 13];
                case 4: return [4 /*yield*/, getPostsByTopic(x[1])];
                case 5:
                    _b.sent();
                    header_login_button.href = '/login/?ref=/h/' + x[1];
                    sorting_options.style.display = 'block';
                    return [3 /*break*/, 13];
                case 6: return [4 /*yield*/, getPostByID(x[1])];
                case 7:
                    _b.sent();
                    submit_new_comment = document.getElementById("newCom_submit");
                    submit_new_comment.onclick = function () {
                        newComment(x[1]);
                    };
                    header_login_button.href = '/login/?ref=/p/' + x[1];
                    return [3 /*break*/, 13];
                case 8:
                    header_login_button.href = '/login/?ref=/post/';
                    return [3 /*break*/, 13];
                case 9:
                    queries = window.location.search;
                    params = new URLSearchParams(queries);
                    phrase.value = params.get('query') + "";
                    topic.value = params.get("topic") + "";
                    bar.classList.add('open');
                    bar.style.margin = '';
                    sorting_options.style.display = 'none';
                    apiGetPostsBySearchQuery(params.get('query') + "", params.get("topic") + "");
                    return [3 /*break*/, 13];
                case 10:
                    apiGetNotifications("false");
                    initNotificationButtons();
                    return [3 /*break*/, 13];
                case 11:
                    if (isUserLoggedIn) {
                        getPostsByTopic("home");
                    }
                    return [3 /*break*/, 13];
                case 12:
                    subscribe_init();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
loadMain(false);
export function getPostsByTopic(topic) {
    return __awaiter(this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiGetPostsByTopic(topic, getPageSearchQueries(), filter_nsfw_checkbox.checked)];
                case 1:
                    posts = _a.sent();
                    if (posts.length > 0) {
                        loadPostOrPostObjects(posts);
                        addPageNavigation();
                    }
                    else {
                        postsAndMore.innerHTML = "<br/><a href='/post' style='color:blue;text-decoration:none;background-color:white;padding:10px;margin-top:10px;'>Start the conversation! :) </a>";
                        stopLoaders();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getPostByID(ID) {
    return __awaiter(this, void 0, void 0, function () {
        var post, _a, _b, i, c, d, x, c, d;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    post = [];
                    _a = post;
                    _b = 0;
                    return [4 /*yield*/, apiGetPostByID(ID)];
                case 1:
                    _a[_b] = _c.sent();
                    console.log(post);
                    loadPostOrPostObjects(post);
                    if (isUserLoggedIn) {
                        new_comment_login.style.display = 'none';
                        new_comment_textarea.style.display = 'flex';
                        new_comment_submit.style.display = 'flex';
                    }
                    else {
                        new_comment_login.style.display = 'block';
                        new_comment_login.href = '/login/?ref=/p/' + ID;
                        new_comment_textarea.style.display = 'none';
                        new_comment_submit.style.display = 'none';
                    }
                    //sorts comments by most votes to least votes
                    post[0].comments.sort(function (a, b) { return (a.total_votes < b.total_votes) ? 1 : -1; });
                    //
                    for (i = 0; i < post[0].comments.length; i++) {
                        c = Object.create(commentObject);
                        c.is_nested = false;
                        c.body = post[0].comments[i].body;
                        c.poster_name = post[0].comments[i].poster;
                        c.posterID = post[0].comments[i].posterID;
                        d = new Date(post[0].comments[i].createdAt);
                        c.createdAt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
                        c.id = post[0].comments[i]._id;
                        c.parentid = post[0]._id;
                        c.totalVotes = post[0].comments[i].total_votes;
                        c.nested_comments = post[0].comments[i].nested_comments;
                        if (post[0].comments[i].users_voted.includes(currentUserID)) {
                            c.currentUserUpvoted = true;
                        }
                        else {
                            c.currentUserUpvoted = false;
                        }
                        c.currentUserAdmin = post[0].comments[i].current_user_admin;
                        c.parentid = post[0]._id;
                        c.display();
                        for (x = 0; x < post[0].comments[i].nested_comments.length; x++) {
                            c = Object.create(commentObject);
                            c.is_nested = true;
                            c.body = post[0].comments[i].nested_comments[x].body;
                            c.poster_name = post[0].comments[i].nested_comments[x].poster;
                            d = new Date(post[0].comments[i].nested_comments[x].createdAt);
                            c.createdAt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
                            c.id = post[0].comments[i].nested_comments[x]._id;
                            c.parentid = post[0]._id;
                            c.posterID = post[0].comments[i].nested_comments[x].posterID;
                            c.nested_comment_parent_id = post[0].comments[i]._id;
                            c.totalVotes = post[0].comments[i].nested_comments[x].total_votes;
                            if (post[0].comments[i].nested_comments[x].users_voted.includes(currentUserID)) {
                                c.currentUserUpvoted = true;
                            }
                            else {
                                c.currentUserUpvoted = false;
                            }
                            console.log(post[0].comments[i].nested_comments[x].posterID, currentUserID);
                            if (post[0].comments[i].nested_comments[x].posterID == currentUserID) {
                                c.currentUserAdmin = true;
                                console.log("true");
                            }
                            else {
                                c.currentUserAdmin = false;
                            }
                            //c.currentUserAdmin = post[0].comments[i].nested_comments[x].current_user_admin
                            c.display();
                        }
                    }
                    stopLoaders();
                    newCommentInputArea.style.display = 'flex';
                    commentSection.style.display = 'flex';
                    return [2 /*return*/];
            }
        });
    });
}
export function loadPostOrPostObjects(posts) {
    for (var i = 0; i < posts.length; i++) {
        var post = Object.create(postObject);
        post.title = posts[i].title;
        post.body = posts[i].body;
        post.poster_name = posts[i].poster;
        var d = new Date(posts[i].createdAt);
        post.createdAt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
        post.id = posts[i]._id;
        post.currentUserUpvoted = posts[i].current_user_upvoted;
        post.currentUserDownvoted = posts[i].current_user_downvoted;
        post.currentUserAdmin = posts[i].current_user_admin;
        post.totalVotes = posts[i].total_votes;
        post.commentCount = 0 + posts[i].comments.length;
        post.topic = posts[i].topic.toLowerCase();
        post.post_type = posts[i].type;
        post.link = posts[i].link;
        post.nsfw = posts[i].nsfw;
        if (posts[i].type == 4) {
            post.poll_options = posts[i].poll_data.options;
            for (var x = 0; x < posts[i].poll_data.voters.length; x++) {
                if (posts[i].poll_data.voters[x][0] == currentUsername) {
                    post.poll_voted = posts[i].poll_data.voters[x][1];
                    break;
                }
            }
            var _loop_1 = function (x) {
                var filtered = posts[i].poll_data.voters.filter(function (a) { return a[1] == x; });
                post.poll_options[x].votes = filtered.length;
            };
            for (var x = 0; x < post.poll_options.length; x++) {
                _loop_1(x);
            }
            post.poll_total_votes = posts[i].poll_data.voters.length;
        }
        post.display();
    }
    stopLoaders();
}
filter_nsfw_checkbox.addEventListener('change', function () {
    return __awaiter(this, void 0, void 0, function () {
        var show, settings, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isUserLoggedIn) {
                        window.location.href = '/login';
                    }
                    show = filter_nsfw_checkbox.checked;
                    settings = {
                        method: 'PUT',
                    };
                    return [4 /*yield*/, fetch('/api/put/filter_nsfw/' + show, settings)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.status == 'ok') {
                        postsArray.innerHTML = "";
                        startLoaders();
                        loadMain(false);
                    }
                    if (data.status == 'error') {
                        alert(data.error);
                    }
                    return [2 /*return*/];
            }
        });
    });
});
export function stopLoaders() {
    console.info("finished loading");
    for (var i = 0; i < loaders.length; i++) {
        var l = loaders[i];
        l.style.display = 'none';
    }
    document.getElementById('footer').style.opacity = '1';
}
export function startLoaders() {
    console.info("loading");
    for (var i = 0; i < loaders.length; i++) {
        var l = loaders[i];
        l.style.display = 'block';
    }
}
//# sourceMappingURL=main.js.map