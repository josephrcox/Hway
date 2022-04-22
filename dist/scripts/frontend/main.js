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
import { postObject } from "./modules/objects/post.js";
import { apiGetPostsByTopic, apiGetPostByID } from "./modules/postLoader.js";
import { getPageType } from "./modules/pageAnalyzer.js";
import { commentObject, newCommentInputArea, commentSection } from "./modules/objects/comment.js";
import { newComment } from "./modules/createComment.js";
import { getUser, currentUserID } from "./modules/auth.js";
window.onload = function () {
    return __awaiter(this, void 0, void 0, function () {
        var x, submit_new_comment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localStorage.setItem("deletepostconfirmid", "");
                    localStorage.setItem("deletecommentconfirmid", "");
                    x = getPageType() || [];
                    return [4 /*yield*/, getUser()];
                case 1:
                    _a.sent();
                    switch (x[0]) {
                        case "all":
                            getPostsByTopic("all");
                            break;
                        case "topic":
                            getPostsByTopic(x[1]);
                            break;
                        case "post":
                            getPostByID(x[1]);
                            submit_new_comment = document.getElementById("newCom_submit");
                            submit_new_comment.onclick = function () {
                                newComment(x[1]);
                            };
                            break;
                        case "createnewpost":
                            break;
                    }
                    return [2 /*return*/];
            }
        });
    });
};
function getPostsByTopic(topic) {
    return __awaiter(this, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiGetPostsByTopic(topic)];
                case 1:
                    posts = _a.sent();
                    console.log(posts);
                    loadPostOrPostObjects(posts);
                    return [2 /*return*/];
            }
        });
    });
}
function getPostByID(ID) {
    return __awaiter(this, void 0, void 0, function () {
        var post, _a, _b, i, c, d;
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
                    //sorts comments by most votes to least votes
                    post[0].comments.sort(function (a, b) { return (a.total_votes < b.total_votes) ? 1 : -1; });
                    //
                    for (i = 0; i < post[0].comments.length; i++) {
                        c = Object.create(commentObject);
                        c.body = post[0].comments[i].body;
                        c.poster_name = post[0].comments[i].poster;
                        d = new Date(post[0].comments[i].createdAt);
                        c.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString();
                        c.id = post[0].comments[i]._id;
                        c.totalVotes = post[0].comments[i].total_votes;
                        if (post[0].comments[i].users_voted.includes(currentUserID)) {
                            c.currentUserUpvoted = true;
                        }
                        else {
                            c.currentUserUpvoted = false;
                        }
                        c.currentUserAdmin = post[0].comments[i].current_user_admin;
                        c.parentid = post[0]._id;
                        c.display();
                    }
                    newCommentInputArea.style.display = 'flex';
                    commentSection.style.display = 'flex';
                    return [2 /*return*/];
            }
        });
    });
}
function loadPostOrPostObjects(posts) {
    for (var i = 0; i < posts.length; i++) {
        var post = Object.create(postObject);
        post.title = posts[i].title;
        post.body = posts[i].body;
        post.poster_name = posts[i].poster;
        var d = new Date(posts[i].createdAt);
        post.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString();
        post.id = posts[i]._id;
        post.currentUserUpvoted = posts[i].current_user_upvoted;
        post.currentUserDownvoted = posts[i].current_user_downvoted;
        post.currentUserAdmin = posts[i].current_user_admin;
        post.totalVotes = posts[i].total_votes;
        post.commentCount = 0 + posts[i].comments.length;
        post.topic = posts[i].topic;
        post.post_type = posts[i].type;
        post.link = posts[i].link;
        post.display();
    }
}
//# sourceMappingURL=main.js.map