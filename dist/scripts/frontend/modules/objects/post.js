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
export var supportEmail = "josephrobertcox@gmail.com";
var postsArray = document.getElementById('postsArray');
export var postObject = {
    title: "",
    body: "",
    poster_name: "",
    createdAt: "",
    id: "",
    totalVotes: 0,
    commentCount: 0,
    topic: "",
    currentUserUpvoted: false,
    currentUserDownvoted: false,
    currentUserAdmin: false,
    display: function () {
        var container = document.createElement('div');
        container.classList.add('post-container');
        container.dataset.postid = this.id;
        var postDetailsContainer = document.createElement('div');
        postDetailsContainer.classList.add('post-details-container');
        var body = document.createElement('p');
        body.classList.add('post-body');
        body.innerText = this.body;
        body.style.display = "none";
        var title = document.createElement('span');
        title.classList.add('post-title');
        title.dataset.title = this.title;
        title.innerHTML = this.title + " <span style='font-size:8px'>[+]</span>";
        title.onclick = function () {
            if (body.style.display == "none") {
                body.style.display = "block";
                title.innerHTML = title.dataset.title + " <span style='font-size:8px'>[-]</span>";
            }
            else {
                body.style.display = "none";
                title.innerHTML = title.dataset.title + " <span style='font-size:8px'>[+]</span>";
            }
        };
        var subtitle = document.createElement('span');
        subtitle.classList.add('post-subtitle');
        subtitle.innerHTML = "@" + this.poster_name + " — " + this.createdAt + " — <a href='/h/" + this.topic + "'>" + this.topic + "</a>";
        var voteContainer = document.createElement('div');
        voteContainer.classList.add('post-vote-container');
        var voteCountContainer = document.createElement('div');
        voteCountContainer.classList.add('post-vote-count-container');
        var voteCount = document.createElement('span');
        voteCount.classList.add('post-vote-count');
        voteCount.innerText = "" + this.totalVotes;
        var voteUpButton = document.createElement('img');
        var voteDownButton = document.createElement('img');
        voteUpButton.src = "/dist/images/angle-up-solid.svg";
        voteDownButton.src = "/dist/images/angle-down-solid.svg";
        voteUpButton.classList.add('post-vote-button');
        voteDownButton.classList.add('post-vote-button');
        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted');
        }
        else if (this.currentUserDownvoted) {
            voteDownButton.classList.add('downvoted');
        }
        voteUpButton.onclick = function () {
            vote(1, container.dataset.postid + "", voteCount, voteUpButton, voteDownButton);
        };
        voteDownButton.onclick = function () {
            vote(-1, container.dataset.postid + "", voteCount, voteUpButton, voteDownButton);
        };
        var subPostDetails = document.createElement('div');
        subPostDetails.classList.add("post-subpost-details-container");
        var viewComments = document.createElement('a');
        viewComments.classList.add('post-subpost-element');
        viewComments.innerText = "comments (" + this.commentCount + ")";
        viewComments.onclick = function () {
            window.location.href = '/p/' + container.dataset.postid;
        };
        subPostDetails.appendChild(viewComments);
        var shareButton = document.createElement('a');
        shareButton.classList.add('post-subpost-element');
        shareButton.innerText = "copy link";
        shareButton.onclick = function () {
            var link = window.location.origin + '/p/' + container.dataset.postid;
            navigator.clipboard.writeText(link);
            shareButton.innerText = "copied";
            setTimeout(function () { shareButton.innerText = "copy link"; }, 3000);
        };
        subPostDetails.appendChild(shareButton);
        var reportButton = document.createElement('a');
        reportButton.classList.add('post-subpost-element');
        reportButton.innerText = "report";
        reportButton.onclick = function () {
            window.open("mailto:" + supportEmail + "?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:" + container.dataset.postid));
        };
        subPostDetails.appendChild(reportButton);
        if (this.currentUserAdmin) {
            var d = document.createElement('a');
            d.classList.add('post-subpost-element');
            d.innerText = "delete";
            d.onclick = function () {
                deletePost(container.dataset.postid + "", container, subPostDetails, this);
            };
            subPostDetails.appendChild(d);
        }
        postDetailsContainer.append(title, body, subtitle);
        voteContainer.append(voteUpButton, voteDownButton);
        voteCountContainer.append(voteCount);
        container.append(postDetailsContainer, voteCountContainer, voteContainer);
        postsArray.appendChild(container);
        postsArray.appendChild(subPostDetails);
    }
};
var lastClick = 0; // These two are used to prevent vote-mashing of posts and comments by placing a delay of Xms
var delay = 400;
var vote = function (change, id, voteCountElement, up, down) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, fetchResponse, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (lastClick >= (Date.now() - delay)) {
                    return [2 /*return*/];
                }
                lastClick = Date.now();
                settings = {
                    method: 'PUT',
                };
                return [4 /*yield*/, fetch('/vote/' + id + '/' + change, settings)];
            case 1:
                fetchResponse = _a.sent();
                return [4 /*yield*/, fetchResponse.json()];
            case 2:
                data = _a.sent();
                if (data.status == 'ok') {
                    voteCountElement.innerText = data.newtotal;
                    if (data.gif == "up") {
                        up.classList.add('upvoted');
                        down.classList.remove('downvoted');
                    }
                    else if (data.gif == "none") {
                        up.classList.remove('upvoted');
                        down.classList.remove('downvoted');
                    }
                    else if (data.gif == "down") {
                        up.classList.remove('upvoted');
                        down.classList.add('downvoted');
                    }
                }
                if (data.error) {
                    if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
                        window.location.href = '/login';
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
var deletePost = function (id, containerE, containerSub, deleteSpan) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, response_1, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(localStorage.getItem("deletepostconfirmid") == id)) return [3 /*break*/, 3];
                settings = {
                    method: 'PUT',
                };
                return [4 /*yield*/, fetch('/api/put/post/delete/' + id, settings)];
            case 1:
                response_1 = _a.sent();
                return [4 /*yield*/, response_1.json()];
            case 2:
                data = _a.sent();
                if (data.status == 'ok') {
                    containerE.innerHTML = "<span>The post was permanantly deleted.</span>";
                    containerSub.innerHTML = "";
                }
                else if (data.status == 'error') {
                    alert(data.error);
                }
                return [3 /*break*/, 4];
            case 3:
                localStorage.setItem("deletepostconfirmid", id);
                deleteSpan.innerText = "Are you sure?";
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=post.js.map