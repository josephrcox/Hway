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
import { supportEmail } from "./post.js";
var postsArray = document.getElementById('postsArray');
export var commentObject = {
    body: "",
    poster_name: "",
    createdAt: "",
    id: "",
    parentid: "",
    totalVotes: null,
    currentUserUpvoted: false,
    currentUserDownvoted: false,
    currentUserAdmin: false,
    display: function () {
        var container = document.createElement('div');
        container.classList.add('comment-container');
        container.dataset.id = this.id;
        container.dataset.postid = this.parentid;
        var comDetailsContainer = document.createElement('div');
        comDetailsContainer.classList.add('comment-details-container');
        var title = document.createElement('span');
        title.classList.add('comment-title');
        title.innerText = this.body;
        var subtitle = document.createElement('span');
        subtitle.classList.add('comment-subtitle');
        subtitle.innerHTML = "@" + this.poster_name + " — " + this.createdAt;
        var voteContainer = document.createElement('div');
        voteContainer.classList.add('comment-vote-container');
        var voteCountContainer = document.createElement('div');
        voteCountContainer.classList.add('comment-vote-count-container');
        var voteCount = document.createElement('span');
        voteCount.classList.add('comment-vote-count');
        voteCount.innerText = "" + this.totalVotes;
        var voteUpButton = document.createElement('img');
        voteUpButton.src = "/dist/images/angle-up-solid.svg";
        voteUpButton.classList.add('comment-vote-button');
        voteUpButton.dataset.parentID = this.parentid;
        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted');
        }
        voteUpButton.onclick = function () {
            voteComment(container.dataset.id, voteUpButton.dataset.parentID, false, "", voteCount, voteUpButton);
        };
        var subPostDetails = document.createElement('div');
        subPostDetails.classList.add('post-subpost-details-container');
        var reportButton = document.createElement('a');
        reportButton.classList.add('post-subcomment-element');
        reportButton.innerText = "report";
        reportButton.onclick = function () {
            window.open("mailto:" + supportEmail + "?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:" + container.dataset.postid));
        };
        subPostDetails.appendChild(reportButton);
        if (this.currentUserAdmin) {
            var d_1 = document.createElement('a');
            d_1.classList.add('post-subpost-element');
            d_1.innerText = "delete";
            d_1.onclick = function () {
                deleteComment(container.dataset.postid, container.dataset.id, container, d_1);
            };
            subPostDetails.appendChild(d_1);
        }
        comDetailsContainer.append(title, subtitle);
        voteContainer.append(voteUpButton);
        voteCountContainer.append(voteCount);
        container.append(comDetailsContainer, voteCountContainer, voteContainer);
        postsArray.appendChild(container);
        postsArray.appendChild(subPostDetails);
    }
};
var voteComment = function (id, parentID, nested, commentParentID, voteCountElement, voteUpImg) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, fetchResponse, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (commentParentID == null || commentParentID == "") {
                    commentParentID = "0";
                }
                settings = {
                    method: 'PUT',
                };
                return [4 /*yield*/, fetch('/votecomment/' + parentID + '/' + id + '/' + nested + '/' + commentParentID, settings)];
            case 1:
                fetchResponse = _a.sent();
                return [4 /*yield*/, fetchResponse.json()];
            case 2:
                data = _a.sent();
                if (data.status == 'ok') {
                    voteCountElement.innerText = data.newcount;
                    if (data.voted == 'yes') {
                        if (nested) {
                            //(document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLSpanElement).innerHTML = fa_voteUp_filled
                        }
                        else {
                            //(document.getElementById('voteComUp_'+id) as HTMLSpanElement).innerHTML = fa_voteUp_filled;
                        }
                        voteUpImg.classList.add('upvoted');
                    }
                    else {
                        voteUpImg.classList.remove('upvoted');
                    }
                    //     if (data.voted == 'no') {
                    //         if (nested) {
                    //             (document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLImageElement).innerHTML = fa_voteUp;
                    //             (document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLImageElement).style.color = 'black';
                    //         } else {
                    //             (document.getElementById('voteComUp_'+id) as HTMLImageElement).innerHTML = fa_voteUp;
                    //         }
                    //     }
                    //     if (nested) {
                    //         document.getElementById('comnestedVoteCount_'+id).innerHTML = data.newcount
                    //     } else {
                    //         document.getElementById('voteCount_'+id).innerHTML = data.newcount
                    //     }
                    // } else {
                    //     if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
                    //         window.location.href = '/login'
                    //     }
                    // }
                }
                return [2 /*return*/];
        }
    });
}); };
var deleteComment = function (parentID, commentID, containerElement, deleteSpan) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, response_1, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(localStorage.getItem("deletecommentconfirmid") == commentID)) return [3 /*break*/, 3];
                settings = {
                    method: 'PUT',
                };
                return [4 /*yield*/, fetch('/api/put/comment/delete/' + parentID + "/" + commentID, settings)];
            case 1:
                response_1 = _a.sent();
                return [4 /*yield*/, response_1.json()];
            case 2:
                data = _a.sent();
                if (data.status == 'ok') {
                    containerElement.innerHTML = "This comment has been permanantly deleted";
                }
                if (data.status == 'error') {
                    alert(data.error);
                }
                return [3 /*break*/, 4];
            case 3:
                localStorage.setItem("deletecommentconfirmid", commentID);
                deleteSpan.innerText = "Are you sure?";
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
export var newCommentInputArea = document.getElementById('commentSection');
//# sourceMappingURL=comment.js.map