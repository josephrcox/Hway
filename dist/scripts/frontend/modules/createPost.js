"use strict";
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
var logs = document.getElementsByClassName('np_logs')[0];
var np_types = document.getElementsByClassName('np_type');
var title = document.getElementsByClassName('np-title')[0].children[1];
var body = document.getElementsByClassName('np-body')[0].children[1];
var link = document.getElementsByClassName('np-link')[0].children[1];
var file = document.getElementsByClassName('np-file')[0].children[1];
var body_d = document.getElementsByClassName('np-body')[0];
var link_d = document.getElementsByClassName('np-link')[0];
var file_d = document.getElementsByClassName('np-file')[0];
var topic = document.getElementsByClassName('np-topic')[0].children[1];
var nsfw = document.getElementsByClassName('np-nsfw')[0].children[1];
var submit = document.getElementsByClassName('np_submit')[0];
var pollOptions = document.getElementById('np_poll_options');
var uploadedImageUrls = [];
var newPost = function () { return __awaiter(void 0, void 0, void 0, function () {
    var post_type, i, isNSFW, check, templink, pollingOps, i, x, bodyJSON, fetchResponse, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                post_type = 1;
                for (i = 0; i < np_types.length; i++) {
                    if (np_types[i].getAttribute('data-selected') == "true") {
                        post_type = i + 1; // model starts index at 1
                        i = np_types.length + 1;
                    }
                }
                if (nsfw.checked) {
                    isNSFW = true;
                }
                else {
                    isNSFW = false;
                }
                check = postBouncer(post_type);
                if (!(check != "")) return [3 /*break*/, 1];
                logs.innerText = check;
                logs.style.display = "block";
                return [3 /*break*/, 4];
            case 1:
                logs.style.display = "none";
                logs.innerText = "";
                templink = "";
                pollingOps = [];
                if (post_type == 1) {
                    link.value = "";
                }
                else if (post_type == 2) {
                    body.value = "";
                    templink = link.value;
                }
                else if (post_type == 3) {
                    templink = localStorage.getItem("lastuploadedimage") + "";
                    body.value = "";
                }
                else if (post_type == 4) {
                    for (i = 1; i < pollOptions.children.length; i++) {
                        x = pollOptions.children[i];
                        if (!onlySpaces(x.value)) {
                            if (x.value.length > 0) {
                                pollingOps.push(x.value);
                            }
                        }
                    }
                }
                bodyJSON = {
                    "title": title.value,
                    "body": body.value,
                    "topic": topic.value,
                    "type": post_type,
                    "nsfw": isNSFW,
                    "link": templink,
                    "pollingOps": pollingOps
                };
                console.log(bodyJSON);
                return [4 /*yield*/, fetch('/api/post/post', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(bodyJSON)
                    })];
            case 2:
                fetchResponse = _a.sent();
                return [4 /*yield*/, fetchResponse.json()];
            case 3:
                data = _a.sent();
                if (data.code != 200) {
                    logs.innerHTML = data.error;
                }
                else {
                    window.location.href = '/p/' + data.data._id;
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
function postBouncer(post_type) {
    var msg = "";
    var myRegEx = /[^a-z\d]/i;
    if ((myRegEx.test(topic.value))) {
        msg = "Please enter valid topic. No spaces or characters allowed.";
    }
    if (topic.value == "") {
        topic.value = "all";
    }
    if (title.value.length < 1) {
        // all post types require a title and a topic, which defaults to "all"
        msg = "Please enter a title.";
    }
    if (post_type == 2) { // link post
        // requires a link
        if (link.value.length < 1 || isValidUrl(link.value) == false) {
            msg = "Please enter valid link.";
        }
    }
    else if (post_type == 3) { // photo post
        // requires a photo URL
        if (isValidUrl(uploadedImageUrls.pop() + "") == false) {
            msg = "Please upload a photo.";
        }
    }
    else if (post_type == 4) { // poll post
        var options = [];
        for (var i = 1; i < pollOptions.children.length; i++) {
            var x = pollOptions.children[i];
            if (!onlySpaces(x.value)) {
                if (x.value.length > 0) {
                    options.push(x.value);
                }
            }
        }
        if (options.length < 2) {
            msg = "Polls need to have at least 2 options.";
        }
        else {
            if (hasDuplicates(options)) {
                msg = "Polls can not have duplicate options.";
            }
        }
    }
    return msg;
}
var _loop_1 = function (i) {
    np_types[i].addEventListener('click', function () {
        for (var j = 0; j < np_types.length; j++) {
            np_types[j].setAttribute("data-selected", "false");
        }
        np_types[i].setAttribute("data-selected", "true");
        switch (i + 1) {
            case 1:
                // text post, requires body
                body_d.style.display = 'flex';
                link_d.style.display = 'none';
                file_d.style.display = 'none';
                pollOptions.style.display = 'none';
                break;
            case 2:
                // link post, requires link
                body_d.style.display = 'none';
                link_d.style.display = 'flex';
                file_d.style.display = 'none';
                pollOptions.style.display = 'none';
                break;
            case 3:
                // photo post, requires file
                body_d.style.display = 'none';
                link_d.style.display = 'none';
                file_d.style.display = 'flex';
                pollOptions.style.display = 'none';
                break;
            case 4:
                // poll post, requires post options
                body_d.style.display = 'none';
                link_d.style.display = 'none';
                file_d.style.display = 'none';
                pollOptions.style.display = 'flex';
                pollOptions.style.flexDirection = 'column';
        }
    });
};
for (var i = 0; i < np_types.length; i++) {
    _loop_1(i);
}
submit.addEventListener('click', newPost, false);
function isValidUrl(string) {
    var matchpattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(string);
}
file.addEventListener("change", function () {
    return __awaiter(this, void 0, void 0, function () {
        var body, fetchResponse, data, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = new FormData();
                    body.set('key', 'e23bc3a1c5f2ec99cc1aa7676dc0f3fb');
                    body.append('image', file.files[0]);
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
                    uploadedImageUrls.push(url);
                    localStorage.setItem("lastuploadedimage", url);
                    console.log(uploadedImageUrls);
                    return [2 /*return*/];
            }
        });
    });
});
function onlySpaces(str) {
    return str.trim().length === 0;
}
function hasDuplicates(a) {
    for (var i = 0; i < a.length; i++) {
        if (a.indexOf(a[i]) !== a.lastIndexOf(a[i])) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=createPost.js.map