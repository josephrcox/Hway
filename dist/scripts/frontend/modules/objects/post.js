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
import { isUserLoggedIn } from "../auth.js";
import { isSubscribed, subscribeTo } from "../subscriptions.js";
export var supportEmail = "josephrobertcox@gmail.com";
export var postsArray = document.getElementById('postsArray');
export var postObject = {
    title: "",
    body: "",
    link: "",
    post_type: 0,
    poster_name: "",
    createdAt: "",
    id: "",
    totalVotes: 0,
    commentCount: 0,
    topic: "",
    nsfw: "",
    poll_options: [],
    poll_voted: -1,
    poll_total_votes: -1,
    currentUserUpvoted: false,
    currentUserDownvoted: false,
    currentUserAdmin: false,
    display: function () {
        var container = document.createElement('div');
        container.classList.add('post-container');
        container.classList.add('menu_shadow');
        container.dataset.postid = this.id;
        var postDetailsContainer = document.createElement('div');
        postDetailsContainer.classList.add('post-details-container');
        var body = document.createElement('p');
        body.classList.add('post-body');
        body.innerText = this.body;
        body.style.display = "none";
        if (this.post_type == 4) {
            var pollOps = void 0;
            pollOps = this.poll_options;
            console.log(pollOps);
            body.innerHTML = "";
            var pollTotalVotes = 0;
            var _loop_1 = function (i) {
                var d = document.createElement('div');
                d.innerHTML = pollOps[i].title;
                d.style.padding = '5px';
                d.style.border = '1px solid black';
                d.dataset.postid = this_1.id;
                d.dataset.index = i + "";
                d.onclick = function () {
                    if (isUserLoggedIn) {
                        voteOnPoll(d.dataset.postid + "", d.dataset.index + "", body);
                    }
                    else {
                        window.location.href = '/login/?ref=/p/' + d.dataset.postid;
                    }
                };
                if (this_1.poll_voted != -1) {
                    d.innerHTML += "(" + pollOps[i].votes + " votes)";
                    d.style.background = 'linear-gradient(to right, #9595ff ' + (Math.floor((parseInt(pollOps[i].votes) / this_1.poll_total_votes) * 100)) + '%, lightgray 0%)';
                    if (this_1.poll_voted == i) {
                        d.innerHTML += "✔️";
                    }
                }
                body.append(d);
            };
            var this_1 = this;
            for (var i = 0; i < pollOps.length; i++) {
                _loop_1(i);
            }
        }
        var title = document.createElement('h3');
        title.classList.add('post-title');
        title.dataset.title = this.title;
        title.dataset.link = this.link;
        if (this.post_type == 1 && this.body.length > 0) {
            title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>[+] </span>" + this.title;
            title.onclick = function () {
                if (body.style.display == "none") {
                    body.style.display = "block";
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>[-] </span>" + title.dataset.title;
                }
                else {
                    body.style.display = "none";
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>[+] </span>" + title.dataset.title;
                }
            };
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block';
            }
        }
        else if (this.post_type == 2) {
            title.innerHTML = "<span style='font-size:10px;padding-right:5px'>🔗 </span>" + title.dataset.title;
            title.onclick = function () {
                window.open(title.dataset.link);
            };
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block';
            }
        }
        else if (this.post_type == 3) {
            title.innerHTML = "<img src='" + title.dataset.link + "' class='post-img-thumb' alt='Post thumbnail'> " + this.title;
            title.onclick = function () {
                if (body.style.display == "none") {
                    body.style.display = "block";
                    body.innerHTML = "<img class='post-img' src='" + title.dataset.link + "' alt='Post media'>";
                }
                else {
                    body.style.display = "none";
                    body.innerHTML = "";
                }
            };
        }
        else if (this.post_type == 1) {
            title.innerText = this.title;
            title.style.cursor = 'auto';
        }
        else if (this.post_type == 4) {
            title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>❓ [+] </span>" + this.title;
            title.onclick = function () {
                if (body.style.display == "none") {
                    body.style.display = "block";
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>❓ [-] </span>" + title.dataset.title;
                }
                else {
                    body.style.display = "none";
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>❓ [+] </span>" + title.dataset.title;
                }
            };
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block';
            }
        }
        var subtitle = document.createElement('span');
        subtitle.classList.add('post-subtitle');
        if (this.nsfw) {
            subtitle.innerHTML = "<span class='nsfw_post_label'>NSFW</span>";
        }
        subtitle.innerHTML += "<span>" + this.poster_name + "</span> — " + this.createdAt + " — <a href='/h/" + this.topic + "'>" + this.topic + "</a>";
        var subscriptionButton = document.createElement('img');
        subscriptionButton.dataset.topic = this.topic.toLowerCase();
        subscriptionButton.setAttribute('id', 'post-subscribe-button_' + this.id);
        if (isSubscribed(this.topic.toLowerCase())) {
            subscriptionButton.src = "/dist/images/square-minus-solid.svg";
            subscriptionButton.classList.add('filter_purple');
        }
        else {
            subscriptionButton.src = "/dist/images/square-plus-solid.svg";
            subscriptionButton.classList.add('filter_green');
        }
        subscriptionButton.onclick = function () {
            subscribeTo(subscriptionButton.dataset.topic + "", "topic");
        };
        subscriptionButton.classList.add('post-subscription-button');
        subtitle.append(subscriptionButton);
        var voteContainer = document.createElement('div');
        voteContainer.classList.add('post-vote-container');
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
        container.classList.add('animated_entry');
        subPostDetails.classList.add('animated_entry');
        postDetailsContainer.append(title, body, subtitle);
        voteContainer.append(voteUpButton, voteCount, voteDownButton);
        container.append(postDetailsContainer, voteContainer);
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
                else {
                    window.location.href = '/login/?ref=/p/' + id;
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
                    setInterval(function () {
                        containerE.innerHTML = "";
                    }, 2000);
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
function voteOnPoll(postid, answer, postelem) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = {
                        method: 'PUT',
                    };
                    return [4 /*yield*/, fetch('/api/put/poll/' + postid + '/' + answer, settings)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data.status == 'ok') {
                        postelem.innerHTML = "<a href='/p/" + postid + "'>View results</a>";
                        postelem.style.color = 'blue';
                    }
                    else {
                        alert(data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=post.js.map