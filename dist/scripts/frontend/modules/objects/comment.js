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
import { newNestedComment } from "../createComment.js";
var postsArray = document.getElementById('postsArray');
export var commentSection = document.getElementById('comments');
export var commentObject = {
    body: "",
    poster_name: "",
    createdAt: "",
    id: "",
    parentid: "",
    posterID: "",
    nested_comments: [],
    totalVotes: undefined,
    is_nested: false,
    nested_comment_parent_id: "",
    currentUserUpvoted: false,
    currentUserDownvoted: false,
    currentUserAdmin: false,
    display: function (appendDiv) {
        var house = document.createElement('div');
        house.classList.add('comment-house');
        house.classList.add('animated_entry');
        house.classList.add('menu_shadow');
        house.dataset.id = this.id;
        house.classList.add('nested_under_' + this.nested_comment_parent_id);
        house.style.display = 'block';
        var expand = "";
        if (this.nested_comments.length > 0) {
            expand = document.createElement('span');
            expand.innerText = '-';
            expand.classList.add('post-expand');
            expand.dataset.id = this.id;
            expand.classList.add('expanded');
            expand.onclick = function () {
                var elems = document.getElementsByClassName('nested_under_' + expand.dataset.id);
                for (var i = 0; i < elems.length; i++) {
                    var e = elems[i];
                    if (e.style.display == 'none') {
                        e.style.display = 'block';
                        expand.classList.add('expanded');
                        expand.innerText = '-';
                    }
                    else {
                        e.style.display = 'none';
                        expand.classList.remove('expanded');
                        expand.innerText = '+';
                    }
                }
            };
        }
        var container = document.createElement('div');
        container.classList.add('comment-container');
        container.dataset.id = this.id;
        container.dataset.postid = this.parentid;
        container.dataset.nested = this.is_nested + "";
        container.classList.add('post-comment-nested');
        var comDetailsContainer = document.createElement('div');
        comDetailsContainer.classList.add('comment-details-container');
        if (this.is_nested) {
            comDetailsContainer.classList.add('nested');
        }
        var title = document.createElement('span');
        title.classList.add('comment-title');
        title.innerText = this.body;
        var subtitle = document.createElement('span');
        subtitle.classList.add('comment-subtitle');
        subtitle.innerHTML = "@" + this.poster_name + " — " + this.createdAt;
        var voteContainer = document.createElement('div');
        voteContainer.classList.add('comment-vote-container');
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
        voteUpButton.dataset.is_nested = this.is_nested + "";
        voteUpButton.onclick = function () {
            voteComment(container.dataset.id, voteUpButton.dataset.parentID, voteUpButton.dataset.is_nested + "", "", voteCount, voteUpButton);
        };
        var replyContainer = document.createElement('div');
        replyContainer.classList.add('post-comment-reply-container');
        replyContainer.style.display = 'none';
        replyContainer.style.flexDirection = 'column';
        replyContainer.dataset.open = 'false';
        var replyInput = document.createElement('textarea');
        replyInput.classList.add('post-comment-reply-input');
        replyInput.rows = 2;
        replyInput.cols = 50;
        replyInput.classList.add('general_input');
        var replySubmit = document.createElement('div');
        replySubmit.classList.add('button_submit');
        replySubmit.classList.add('post-comment-reply-submit');
        replySubmit.innerText = "Reply";
        replySubmit.dataset.postID = this.parentid;
        replySubmit.dataset.id = this.id;
        replySubmit.onclick = function () {
            console.log(replyInput);
            newNestedComment(replySubmit.dataset.postID + "", replySubmit.dataset.id + "", replyInput, house);
        };
        if (!this.is_nested) {
            replyContainer.append(replyInput, replySubmit);
            var replyOpen = document.createElement('a');
            replyOpen.innerText = 'reply';
            replyOpen.classList.add('post-subcomment-element');
            replyOpen.onclick = function () {
                if (replyContainer.dataset.open == 'false') {
                    replyContainer.style.display = 'flex';
                    replyContainer.dataset.open = 'true';
                }
                else {
                    replyContainer.style.display = 'none';
                    replyContainer.dataset.open = 'false';
                }
            };
        }
        var subPostDetails = document.createElement('div');
        subPostDetails.classList.add('post-subpost-details-container');
        var reportButton = document.createElement('a');
        reportButton.classList.add('post-subcomment-element');
        reportButton.innerText = "report";
        reportButton.onclick = function () {
            window.open("mailto:" + supportEmail + "?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:" + container.dataset.postid));
        };
        if (!this.is_nested) {
            subPostDetails.append(replyOpen);
        }
        subPostDetails.append(reportButton);
        if (this.currentUserAdmin) {
            var d_1 = document.createElement('a');
            d_1.classList.add('post-subpost-element');
            d_1.innerText = "delete";
            d_1.dataset.commentID = this.id;
            d_1.dataset.nested_comment_parent_id = this.nested_comment_parent_id;
            if (this.nested_comments.length > 0) {
                d_1.dataset.nested = "true";
            }
            else {
                d_1.dataset.nested = "false";
            }
            d_1.onclick = function () {
                deleteComment(container.dataset.postid, container.dataset.id, house, d_1, d_1.dataset.nested + "", d_1.dataset.commentID, d_1.dataset.nested_comment_parent_id + "");
            };
            subPostDetails.appendChild(d_1);
        }
        comDetailsContainer.append(title, subtitle);
        voteContainer.append(voteUpButton, voteCount);
        if (this.totalVotes !== "") {
            container.append(expand, comDetailsContainer, voteContainer);
        }
        else {
            container.style.cursor = 'pointer';
            container.onclick = function () {
                window.location.href = '/p/' + container.dataset.postid;
            };
            container.append(expand, comDetailsContainer);
        }
        house.append(container, subPostDetails, replyContainer);
        if (appendDiv) {
            insertAfter(appendDiv, house);
        }
        else {
            commentSection.appendChild(house);
        }
        // commentSection.appendChild(subPostDetails)
        // commentSection.appendChild(replyContainer)
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
                }
                return [2 /*return*/];
        }
    });
}); };
var deleteComment = function (parentID, commentID, containerElement, deleteSpan, nested, nestedID, nested_comment_parent_id) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, response, data, elems, i, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(localStorage.getItem("deletecommentconfirmid") == commentID)) return [3 /*break*/, 7];
                settings = {
                    method: 'PUT',
                };
                if (!(nested == "true")) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch('/api/put/comment/delete/' + parentID + "/" + commentID, settings)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, fetch('/api/put/comment_nested/delete/' + parentID + "/" + nested_comment_parent_id + "/" + nestedID, settings)];
            case 4:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 5:
                data = _a.sent();
                _a.label = 6;
            case 6:
                if (data.status == 'ok') {
                    containerElement.innerHTML = "";
                    if (nested == "false") {
                        elems = document.getElementsByClassName('nested_under_' + commentID);
                        for (i = 0; i < elems.length; i++) {
                            e = elems[i];
                            e.style.display = 'none';
                        }
                    }
                }
                if (data.status == 'error') {
                    alert(data.error);
                }
                return [3 /*break*/, 8];
            case 7:
                localStorage.setItem("deletecommentconfirmid", commentID);
                deleteSpan.innerText = "Are you sure?";
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
export var newCommentInputArea = document.getElementsByClassName('newComContainer')[0];
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
//# sourceMappingURL=comment.js.map