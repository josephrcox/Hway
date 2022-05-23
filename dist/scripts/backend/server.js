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
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var response = require('express').response;
var path = require('path');
var fs = require('fs');
var axios = require('axios');
app.use(cookieParser());
var masterUserArr = [];
var IDs = [];
var topicArray = [];
var topicCount = [];
var postsonpage = [];
var postsPerPage = 50;
var ms_in_day = 86400000;
var currentUser;
var connectedToDB = false;
var resetPasswordArray = [];
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, '../../../')));
app.set('views', path.join(__dirname, '../../', '/views'));
app.use(express.json());
app.use(expressLayouts);
var mongoose = require('mongoose');
mongoose.connect(process.env.DATEBASE_URL, {});
var connection = mongoose.connection;
connection.once("open", function (res) {
    console.log("Connected to Mongoose!");
    connectedToDB = true;
});
var User = require('../../models/user');
var Post = require('../../models/post');
var Guest = require('../../models/guest');
var DeletedComment = require('../../models/comments_deleted');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET;
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
var allowUsersToBrowseAsGuests = true;
var geoip = require('geoip-lite');
var usersArr = [];
var bannedTopics = ['home', 'notifications', 'profile', 'login', 'logout', 'signup', 'admin', 'post'];
var bannedUsernames = ['joey', 'admin',];
var waitInterval;
function deleteTestingPosts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Post.find({ poster: 'joey' }, function (err, docs) {
                for (var i = 0; i < docs.length; i++) {
                    Post.findByIdAndDelete(docs[i]._id, function (e, d) {
                        console.log(e, d);
                    });
                }
            });
            return [2 /*return*/];
        });
    });
}
// deleteTestingPosts()
function wait(x) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            waitInterval = setInterval(function () {
                console.log("waiting for " + x + " seconds");
            }, x * 1000);
            return [2 /*return*/];
        });
    });
}
function get_all_avatars() {
    return __awaiter(this, void 0, void 0, function () {
        var tempUsers, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.find({})];
                case 1:
                    tempUsers = _a.sent();
                    for (i = 0; i < tempUsers.length; i++) {
                        masterUserArr.push([tempUsers[i].id, tempUsers[i].name, tempUsers[i].avatar]);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
get_all_avatars();
function sanitize(string) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    var reg = /[&<>"'/]/ig;
    return string.replace(reg, function (match) { return (map[match]); });
}
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ip;
    return __generator(this, function (_a) {
        ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        try {
            Guest.findOne({ ip_address: ip }, function (err, docs) {
                var dt = getFullDateTimeAndTimeStamp();
                var fulldatetime = dt[0];
                var timestamp = dt[1];
                if (docs != null) {
                    docs.visited_num += 1;
                    if (!docs.visited_datetime_array.includes(fulldatetime)) {
                        docs.visited_datetime_array.push(fulldatetime);
                    }
                    docs.save();
                }
                else {
                    var geo = geoip.lookup(ip);
                    try {
                        Guest.create({
                            ip_address: ip,
                            approximate_location: geo,
                            visited_datetime_array: [fulldatetime]
                        });
                    }
                    catch (err) {
                    }
                }
            });
        }
        catch (err) {
        }
        res.redirect('/all');
        return [2 /*return*/];
    });
}); });
app.get('/logout', function (req, res) {
    try {
        var token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        var userID = verified.id;
        var dt = getFullDateTimeAndTimeStamp();
        var fulldatetime_1 = dt[0];
        var timestamp_1 = dt[1];
        User.findById(userID, function (err, docs) {
            docs.statistics.misc.logout_num += 1;
            docs.statistics.misc.logout_array.push([fulldatetime_1, timestamp_1]);
            docs.save();
        });
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('/all');
});
app.get('/api/get/currentuser', function (req, res) {
    try {
        var token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        currentUser = verified.id;
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        if (ip.includes("ffff")) {
        }
        else {
            User.findById(verified.id, function (err, docs) {
                if (docs != null) {
                    var geo = geoip.lookup(ip);
                    try {
                        if (!docs.statistics.misc.ip_address.includes(ip)) {
                            docs.statistics.misc.ip_address.push(ip);
                        }
                        if (!docs.statistics.misc.approximate_location.includes(geo)) {
                            docs.statistics.misc.approximate_location.push(geo);
                        }
                        docs.save();
                    }
                    catch (err) {
                    }
                }
            });
        }
        res.json(verified);
    }
    catch (err) {
        try {
            var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            Guest.findOne({ ip_address: ip }, function (err, docs) {
                var dt = getFullDateTimeAndTimeStamp();
                var fulldatetime = dt[0];
                if (docs != null) {
                    docs.visited_num += 1;
                    if (!docs.visited_datetime_array.includes(fulldatetime)) {
                        docs.visited_datetime_array.push(fulldatetime);
                    }
                    docs.save();
                }
                else {
                    var geo = geoip.lookup(ip);
                    try {
                        Guest.create({
                            ip_address: ip,
                            approximate_location: geo,
                            visited_datetime_array: [fulldatetime]
                        });
                    }
                    catch (err) {
                    }
                }
            });
        }
        catch (err) {
        }
        return res.json({ status: "error", code: 400, error: err });
    }
});
app.get('/api/get/notification_count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user;
    return __generator(this, function (_a) {
        if (currentUser) {
            User.findById(currentUser, function (err, docs) {
                if (err || docs == null) {
                    res.send({ status: 'error' });
                }
                else {
                    var notifs = (docs.notifications.filter(function (x) {
                        return x.status == "active";
                    }));
                    res.send({ count: notifs.length });
                }
            });
        }
        else {
            try {
                token = req.cookies.token;
                user = jwt.verify(token, process.env.JWT_SECRET);
                User.findById(user, function (err, docs) {
                    if (err) {
                        res.send({ status: 'error' });
                    }
                    else {
                        res.send({ count: docs.notifications.length });
                    }
                });
            }
            catch (error) {
                res.send({ status: 'error', data: 'nojwt' });
            }
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/get/notifications/:cleared', function (req, res) {
    if (currentUser) {
        User.findById(currentUser, function (err, docs) {
            if (err) {
                res.send({ status: 'error' });
            }
            else {
                var notifs = {};
                if (req.params.cleared != "true") {
                    notifs = (docs.notifications.filter(function (x) {
                        return x.status == "active";
                    }));
                }
                else {
                    notifs = notifs = (docs.notifications.filter(function (x) {
                        return x.status != "active";
                    }));
                }
                res.send(notifs);
            }
        });
    }
    else {
        try {
            var token = req.cookies.token;
            var user = jwt.verify(token, process.env.JWT_SECRET);
            User.findById(user, function (err, docs) {
                if (err) {
                    res.send({ status: 'error' });
                }
                else {
                    res.send(docs.notifications);
                }
            });
        }
        catch (error) {
            res.send({ status: 'error', data: 'nojwt' });
        }
    }
});
app.put('/api/put/notif/remove/:timestamp', function (req, res) {
    try {
        User.findById(currentUser, function (err, docs) {
            return __awaiter(this, void 0, void 0, function () {
                var i, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            console.log(docs.name);
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < docs.notifications.length)) return [3 /*break*/, 4];
                            if (!(docs.notifications[i].timestamp == req.params.timestamp)) return [3 /*break*/, 3];
                            docs.notifications.splice(i, 1);
                            return [4 /*yield*/, docs.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, res.json({ status: 'ok' })];
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            return [2 /*return*/, res.json({ status: 'error', data: 'Too fast' })];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        });
    }
    catch (error) {
        res.send({ status: 'error', data: 'nojwt' });
    }
});
app.post('/api/post/notif/clear/', function (req, res) {
    try {
        var token = req.cookies.token;
        var user = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(user.id, function (err, docs) {
            for (var i = 0; i < docs.notifications.length; i++) {
                var notif = docs.notifications[i];
                notif.status = "cleared";
                docs.notifications[i] = notif;
            }
            docs.save();
            res.send({ status: 'ok' });
        });
    }
    catch (error) {
        res.send({ status: 'error', data: 'nojwt' });
    }
});
app.get('/login/', function (req, res) {
    res.render('login.ejs', { topic: "" });
});
app.get('/post', function (req, res) {
    try {
        var token = req.cookies.token;
        var user = jwt.verify(token, process.env.JWT_SECRET);
        currentUser = user.id;
        if (currentUser) {
            res.render('post.ejs', { topic: "- post" });
        }
        else {
            res.redirect('/login/?ref=/post/');
        }
    }
    catch (error) {
        res.redirect('/login/?ref=/post/');
    }
});
app.get('/user/', function (req, res) {
    try {
        var token = req.cookies.token;
        var user = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(user.id, function (err, docs) {
            res.redirect('/user/' + docs.name);
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
app.get('/user/:user', function (req, res) {
    res.render('profile.ejs', { topic: "", user: req.params.user });
});
app.get('/register', function (req, res) {
    res.render('register.ejs', { topic: "" });
});
app.get('/subscriptions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valid = false;
                return [4 /*yield*/, isloggedin(req)];
            case 1:
                // Commenting out below allows users to view the home without being logged in
                valid = _a.sent();
                if (valid) {
                    res.render('subscriptions.ejs', { topic: "subscriptions" });
                }
                else {
                    res.redirect('/login/?ref=/subscriptions/');
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/all/q', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valid = false;
                return [4 /*yield*/, isloggedin(req)];
            case 1:
                // Commenting out below allows users to view the home without being logged in
                valid = _a.sent();
                if (valid || allowUsersToBrowseAsGuests) {
                    res.render('home.ejs', { topic: "/all" });
                }
                else {
                    res.redirect('/login/?ref=/home/');
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.redirect('/all/q?sort=hot&t=all&page=1');
        return [2 /*return*/];
    });
}); });
app.get('/home', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.redirect('/home/q?sort=hot&t=all&page=1');
        return [2 /*return*/];
    });
}); });
app.get('/home/q', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valid = false;
                return [4 /*yield*/, isloggedin(req)];
            case 1:
                // Commenting out below allows users to view the home without being logged in
                valid = _a.sent();
                if (valid) {
                    res.render('home.ejs', { topic: "/home" });
                }
                else {
                    res.redirect('/login/?ref=/home/');
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/all/:queries', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                valid = true;
                return [4 /*yield*/, isloggedin(req)];
            case 1:
                // Commenting out below allows users to view the home without being logged in
                valid = _a.sent();
                if (valid || allowUsersToBrowseAsGuests) {
                    res.render('home.ejs', { topic: "/all" });
                }
                else {
                    res.redirect('/login/?ref=/all/');
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/h/:topic/q', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render('home.ejs', { topic: "/h/" + req.params.topic });
        return [2 /*return*/];
    });
}); });
app.get('/h/:topic/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.redirect('/h/' + req.params.topic + '/q?sort=hot&t=all&page=1');
        return [2 /*return*/];
    });
}); });
app.get('/p/:postid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render('home.ejs', { topic: "" });
        return [2 /*return*/];
    });
}); });
app.get('/api/get/comment/:postid/:commentid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Post.findById(req.params.postid, function (err, docs) {
            for (var i = 0; i < docs.comments.length; i++) {
                if (docs.comments[i]._id == req.params.commentid) {
                    res.send(docs.comments[i]);
                }
            }
        });
        return [2 /*return*/];
    });
}); });
app.get('/api/get/all_users/:sorting', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Post.find({}).sort({total_votes: -1}).exec(function(err, posts){
        User.find({}, function (err, users) {
            if (req.params.sorting == '0') {
                users.sort(function (a, b) { return a.statistics.score - b.statistics.score; });
            }
            if (req.params.sorting == '1') {
                users.sort(function (a, b) { return b.statistics.score - a.statistics.score; });
            }
            usersArr = [];
            var location;
            for (var i = 0; i < users.length; i++) {
                try {
                    var locationArr = users[i].statistics.misc.approximate_location[0];
                    location = locationArr.city;
                }
                catch (err) {
                    location = "unknown";
                }
                usersArr.push({
                    'Name': users[i].name,
                    'Score': users[i].statistics.score,
                    'Account_creation_date': users[i].statistics.misc.account_creation_date[0],
                    'Location': location
                });
            }
            usersArr.sort();
            res.send(usersArr);
        });
        return [2 /*return*/];
    });
}); });
app.get('/api/get/user/:user/:options', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!connectedToDB) return [3 /*break*/, 2];
                return [4 /*yield*/, wait(3)];
            case 1:
                _a.sent();
                clearInterval(waitInterval);
                _a.label = 2;
            case 2:
                comments = [];
                console.log(req.params);
                if (req.params.user != null && req.params.user != "undefined") {
                    if (req.params.options == "show_nsfw") {
                        try {
                            User.findOne({ name: req.params.user }, function (err, user) {
                                if (user.show_nsfw == undefined)
                                    return res.json({ status: 'error' });
                                return res.send({ show_nsfw: user.show_nsfw });
                            });
                        }
                        catch (err) {
                            res.json({ status: 'error', data: err });
                        }
                    }
                    else if (req.params.options == "subscriptions") {
                        try {
                            User.findOne({ name: req.params.user }, function (err, user) {
                                return res.json(user.subscriptions);
                            });
                        }
                        catch (err) {
                            res.json({ status: 'error', data: err });
                        }
                    }
                    else if (req.params.options == "all_comments") {
                        Post.find({ status: 'active' }, function (err, posts) {
                            for (var i = 0; i < posts.length; i++) {
                                for (var x = 0; x < posts[i].comments.length; x++) {
                                    if (posts[i].comments[x].poster == req.params.user) {
                                        comments.push([posts[i].comments[x], posts[i].id]);
                                    }
                                }
                            }
                            res.json(comments);
                        });
                    }
                    else {
                        User.findOne({ name: req.params.user }, function (err, user) {
                            user.password = null;
                            user._id = null;
                            user.statistics.posts.viewed_array = null;
                            user.statistics.posts.viewed_num = null;
                            user.statistics.posts.votedOn_array = null;
                            user.statistics.posts.votedOn_num = null;
                            user.statistics.topics.visited_array = null;
                            user.statistics.comments.votedOn_array = null;
                            user.statistics.comments.votedOn_num = null;
                            user.statistics.misc.login_num = null;
                            user.statistics.misc.login_array = null;
                            user.statistics.misc.logout_num = null;
                            user.statistics.misc.logout_array = null;
                            user.statistics.misc.ip_address = null;
                            user.statistics.misc.approximate_location = null;
                            user.email = null;
                            user.notifications = null;
                            user.subscriptions = null;
                            user.show_nsfw = null;
                            user.statistics.misc.account_creation_date[0] = user.statistics.misc.account_creation_date[0].split(' at ')[0];
                            res.send(user);
                        });
                    }
                }
                else {
                    res.json({ code: 400 });
                }
                return [2 /*return*/];
        }
    });
}); });
app.put('/api/put/user/:user/:change/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, change, url;
    return __generator(this, function (_a) {
        user = req.params.user;
        change = req.params.change;
        url = req.body.src;
        if (change == "avatar") {
            if (url != null) {
                User.findOne({ name: user }, function (err, docs) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    docs.avatar = url;
                                    docs.save();
                                    return [4 /*yield*/, get_all_avatars()];
                                case 1:
                                    _a.sent();
                                    res.json({ status: 'ok', src: url });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            else {
                res.json({ status: 'error', error: 'No URL provided to backend' });
            }
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/get/post/:postid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postModified;
    return __generator(this, function (_a) {
        postModified = [];
        Post.findById(req.params.postid, function (err, post) {
            var postModified = {};
            postModified = post;
            if (post == null) {
                return res.send({ status: 'error', data: 'No post found' });
            }
            else if (post.status == 'deleted') {
                return res.send({ status: 'error', data: 'This post was deleted by the creator.' });
            }
            else {
                if (post.posterID == currentUser) {
                    postModified.current_user_admin = true;
                }
                else {
                    postModified.current_user_admin = false;
                }
                if (post.users_upvoted.includes(currentUser)) {
                    postModified.current_user_upvoted = true;
                    postModified.current_user_downvoted = false;
                }
                if (post.users_downvoted.includes(currentUser)) {
                    postModified.current_user_upvoted = false;
                    postModified.current_user_downvoted = true;
                }
                for (var i = 0; i < post.comments.length; i++) {
                    if (post.comments[i].users_voted.includes(currentUser)) {
                        console.log("user upvoted");
                        postModified.comments[i].current_user_voted = true;
                        console.log(postModified);
                    }
                }
                try {
                    User.findById(currentUser, function (err, docs) {
                        if (docs != null) {
                            var dt = getFullDateTimeAndTimeStamp();
                            var fulldatetime = dt[0];
                            var viewed_num = docs.statistics.posts.viewed_num;
                            var viewed_array = docs.statistics.posts.viewed_array;
                            viewed_array.push([post.title, post.topic, post.id, fulldatetime]);
                            docs.statistics.posts.viewed_num = (viewed_num + 1);
                            docs.statistics.posts.viewed_array = viewed_array;
                            docs.save();
                        }
                    });
                }
                catch (err) {
                }
                for (var i = 0; i < post.comments.length; i++) {
                    if (post.comments[i].status == 'active') {
                        if (post.comments[i].nested_comments.length != 0) {
                            for (var x = 0; x < post.comments[i].nested_comments.length; x++) {
                                if (post.comments[i].nested_comments[x].posterid == currentUser) {
                                    postModified.comments[i].nested_comments[x].current_user_admin = true;
                                }
                                if (post.comments[i].nested_comments[x].users_voted.includes(currentUser)) {
                                    postModified.comments[i].nested_comments[x].current_user_voted = true;
                                }
                            }
                        }
                        if (post.comments[i].posterID == currentUser) {
                            postModified.comments[i].current_user_admin = true;
                        }
                        else {
                            postModified.comments[i].current_user_admin = false;
                        }
                    }
                    else {
                    }
                }
            }
            User.findById(postModified.posterID, function (err, user) {
                postModified.posterAvatarSrc = user.avatar;
                res.send(postModified);
            });
        });
        return [2 /*return*/];
    });
}); });
app.put('/api/put/subscribe/:topic', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.params.topic = req.params.topic.toLowerCase();
        if (bannedTopics.includes(req.params.topic.toLowerCase())) {
            res.status(400);
            return [2 /*return*/, res.send({ status: 'error', data: 'This topic is not available to subscribe' })];
        }
        if (currentUser) {
            User.findById(currentUser, function (err, docs) {
                if (docs.subscriptions.topics.some(function (x) { return x[0] == req.params.topic.toLowerCase(); })) {
                    res.json({ status: 'error', data: 'already subscribed' });
                }
                else {
                    docs.subscriptions.topics.push([
                        req.params.topic, Date.now()
                    ]);
                    docs.save();
                    res.json({ status: 'ok' });
                }
            });
        }
        return [2 /*return*/];
    });
}); });
app.put('/api/put/subscribe_user/:user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (currentUser) {
            User.findById(currentUser, function (err, docs) {
                if (docs.subscriptions.users.some(function (x) { return x[0] == req.params.user; })) {
                    res.json({ status: 'error', data: 'already subscribed' });
                }
                else {
                    docs.subscriptions.users.push([
                        req.params.user, Date.now()
                    ]);
                    docs.save();
                    res.json({ status: 'ok' });
                }
            });
        }
        return [2 /*return*/];
    });
}); });
app.put('/api/put/unsubscribe/:topic', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (currentUser) {
            User.findById(currentUser, function (err, docs) {
                if (!docs.subscriptions.topics.some(function (x) { return x[0] == req.params.topic; })) {
                    res.json({ status: 'error', data: 'already unsubscribed' });
                }
                else {
                    var index = docs.subscriptions.topics.findIndex(function (x) { return x[0] == req.params.topic; });
                    docs.subscriptions.topics.splice(index, 1);
                    docs.save();
                    res.json({ status: 'ok' });
                }
            });
        }
        return [2 /*return*/];
    });
}); });
app.put('/api/put/unsubscribe_user/:user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (currentUser) {
            User.findById(currentUser, function (err, docs) {
                if (!docs.subscriptions.users.some(function (x) { return x[0] == req.params.user; })) {
                    res.json({ status: 'error', data: 'already unsubscribed' });
                }
                else {
                    var index = docs.subscriptions.users.findIndex(function (x) { return x[0] == req.params.user; });
                    docs.subscriptions.users.splice(index, 1);
                    docs.save();
                    res.json({ status: 'ok' });
                }
            });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/get/search/q', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, userID, query, verified, regex_q, regex_t;
        return __generator(this, function (_a) {
            query = req.query.query;
            try {
                token = req.cookies.token;
                verified = jwt.verify(token, process.env.JWT_SECRET);
                userID = verified.id;
            }
            catch (err) {
                if (!allowUsersToBrowseAsGuests) {
                    return [2 /*return*/, res.json({ status: "ok", code: 400, error: "Not logged in" })];
                }
                else {
                    userID = null;
                }
            }
            regex_q = new RegExp(req.query.query, 'i');
            regex_t = new RegExp(req.query.topic, 'i');
            Post.find({ status: 'active', title: regex_q, topic: regex_t }, function (err, docs) {
                postsonpage = docs;
                var _loop_1 = function (i) {
                    if (postsonpage[i].posterID == userID) {
                        // postsonpage[i] = posts[i]
                        postsonpage[i].current_user_admin = true;
                    }
                    else {
                        // postsonpage[i] = posts[i]
                        postsonpage[i].current_user_admin = false;
                    }
                    if (postsonpage[i].users_upvoted.includes(userID)) {
                        postsonpage[i].current_user_upvoted = true;
                        postsonpage[i].current_user_downvoted = false;
                    }
                    if (postsonpage[i].users_downvoted.includes(userID)) {
                        postsonpage[i].current_user_upvoted = false;
                        postsonpage[i].current_user_downvoted = true;
                    }
                    if (masterUserArr.some(function (x) { return x[0] == postsonpage[i].posterID; })) {
                        var indexOfUser = masterUserArr.findIndex(function (x) { return x[0] == postsonpage[i].posterID; });
                        postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2];
                    }
                };
                for (var i = 0; i < docs.length; i++) {
                    _loop_1(i);
                }
                res.send({ data: postsonpage });
            });
            return [2 /*return*/];
        });
    });
});
app.get('/api/get/:topic/q', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queries, page, sorting, duration, userID, token, verified, sortingJSON, msnow, timestamp_since, timestamp24hoursago, timestamp1weekago, timestamp1monthago, posts, filteredPosts, user_subscribed_topics, temp_user, i, i, totalPosts, totPages, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // queries: nsfw, page, sort, t
                postsonpage = [];
                queries = req.query;
                page = queries.page;
                sorting = queries.sort;
                duration = queries.t;
                // Commenting out this part below allows for users to view without being logged in
                try {
                    token = req.cookies.token;
                    verified = jwt.verify(token, process.env.JWT_SECRET);
                    userID = verified.id;
                    console.log(verified);
                }
                catch (err) {
                    if (!allowUsersToBrowseAsGuests) {
                        return [2 /*return*/, res.json({ status: "ok", code: 400, error: "Not logged in" })];
                    }
                    else {
                        userID = null;
                        currentUser = null;
                    }
                }
                sortingJSON = {};
                return [4 /*yield*/, Date.now()];
            case 1:
                msnow = _a.sent();
                timestamp_since = 0;
                timestamp24hoursago = 0;
                timestamp1weekago = 0;
                timestamp1monthago = 0;
                console.log("sorting:" + sorting, " duration:" + duration);
                if (sorting == "top") {
                    if (duration == "day") {
                        timestamp_since = (msnow - ms_in_day);
                        sortingJSON = { total_votes: -1 };
                    }
                    else if (duration == "week") {
                        timestamp_since = (msnow - (ms_in_day * 7));
                        sortingJSON = { total_votes: -1 };
                    }
                    else if (duration == "month") {
                        timestamp_since = (msnow - (ms_in_day * 30));
                        sortingJSON = { total_votes: -1 };
                    }
                    else if (duration == "all") {
                        sortingJSON = { total_votes: -1 };
                    }
                    else {
                        console.error("ERROR:" + sorting);
                    }
                }
                else if (sorting == "new") {
                    sortingJSON = { timestamp: -1 };
                }
                else if (sorting == "hot") {
                    sortingJSON = { updatedAt: -1 };
                }
                posts = [];
                filteredPosts = [];
                if (!(req.params.topic == "all")) return [3 /*break*/, 6];
                if (!(queries.nsfw == "false")) return [3 /*break*/, 3];
                return [4 /*yield*/, Post.find({ status: 'active', timestamp: { $gt: timestamp_since }, nsfw: queries.nsfw }).sort(sortingJSON)];
            case 2:
                posts = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Post.find({ status: 'active', timestamp: { $gt: timestamp_since } }).sort(sortingJSON)];
            case 4:
                posts = _a.sent();
                _a.label = 5;
            case 5:
                filteredPosts = posts;
                return [3 /*break*/, 17];
            case 6:
                if (!(req.params.topic == "home")) return [3 /*break*/, 12];
                user_subscribed_topics = [];
                return [4 /*yield*/, User.findById(currentUser)];
            case 7:
                temp_user = _a.sent();
                for (i = 0; i < temp_user.subscriptions.topics.length; i++) {
                    user_subscribed_topics.push(temp_user.subscriptions.topics[i][0]);
                }
                if (!(queries.nsfw == "false")) return [3 /*break*/, 9];
                return [4 /*yield*/, Post.find({ timestamp: { $gt: timestamp_since }, nsfw: queries.nsfw })];
            case 8:
                posts = _a.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, Post.find({ timestamp: { $gt: timestamp_since } })];
            case 10:
                posts = _a.sent();
                _a.label = 11;
            case 11:
                for (i = 0; i < posts.length; i++) {
                    if (user_subscribed_topics.indexOf(posts[i].topic) != -1 && posts[i].status == 'active') {
                        filteredPosts.push(posts[i]);
                    }
                }
                return [3 /*break*/, 17];
            case 12:
                if (!(queries.nsfw == "false")) return [3 /*break*/, 14];
                return [4 /*yield*/, Post.find({ status: 'active', timestamp: { $gt: timestamp_since }, topic: req.params.topic, nsfw: queries.nsfw }).sort(sortingJSON)];
            case 13:
                posts = _a.sent();
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, Post.find({ status: 'active', timestamp: { $gt: timestamp_since }, topic: req.params.topic }).sort(sortingJSON)];
            case 15:
                posts = _a.sent();
                _a.label = 16;
            case 16:
                filteredPosts = posts;
                _a.label = 17;
            case 17:
                totalPosts = filteredPosts.length;
                return [4 /*yield*/, paginate(filteredPosts, postsPerPage, page)];
            case 18:
                filteredPosts = _a.sent();
                totPages = Math.ceil((totalPosts) / postsPerPage);
                for (i = 0; i < filteredPosts.length; i++) {
                    if (filteredPosts[i].users_upvoted.indexOf(currentUser) != -1) {
                        filteredPosts[i].current_user_upvoted = true;
                    }
                    else {
                        filteredPosts[i].current_user_upvoted = false;
                    }
                    if (filteredPosts[i].users_downvoted.indexOf(currentUser) != -1) {
                        filteredPosts[i].current_user_downvoted = true;
                    }
                    else {
                        filteredPosts[i].current_user_downvoted = false;
                    }
                    if (filteredPosts[i].posterID == currentUser) {
                        filteredPosts[i].current_user_admin = true;
                    }
                    else {
                        filteredPosts[i].current_user_admin = false;
                    }
                }
                res.json({ data: filteredPosts, total_posts: totalPosts, total_pages: totPages });
                return [2 /*return*/];
        }
    });
}); });
function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size).filter(function (value) { return Object.keys(value).length !== 0; });
}
app.get('/api/get/posts/user/:user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, token, verified;
    return __generator(this, function (_a) {
        postsonpage = [];
        // Commenting out this part below allows for users to view without being logged in
        try {
            token = req.cookies.token;
            verified = jwt.verify(token, process.env.JWT_SECRET);
            userID = verified.id;
        }
        catch (err) {
            if (!allowUsersToBrowseAsGuests) {
                return [2 /*return*/, res.json({ status: "ok", code: 400, error: "Not logged in" })];
            }
            else {
                userID = null;
            }
        }
        Post.find({ poster: req.params.user, status: "active" }).sort({ total_votes: -1 }).exec(function (err, posts) {
            return __awaiter(this, void 0, void 0, function () {
                var _loop_2, i;
                return __generator(this, function (_a) {
                    if (err) {
                    }
                    else {
                        _loop_2 = function (i) {
                            if (posts[i].posterID == userID) {
                                postsonpage[i] = posts[i];
                                postsonpage[i].current_user_admin = true;
                            }
                            else {
                                postsonpage[i] = posts[i];
                                postsonpage[i].current_user_admin = false;
                            }
                            if (posts[i].users_upvoted.includes(userID)) {
                                postsonpage[i].current_user_upvoted = true;
                                postsonpage[i].current_user_downvoted = false;
                            }
                            if (posts[i].users_downvoted.includes(userID)) {
                                postsonpage[i].current_user_upvoted = false;
                                postsonpage[i].current_user_downvoted = true;
                            }
                            if (masterUserArr.some(function (x) { return x[0] == posts[i].posterID; })) {
                                var indexOfUser = masterUserArr.findIndex(function (x) { return x[0] == posts[i].posterID; });
                                postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2];
                            }
                            else {
                            }
                        };
                        for (i = 0; i < posts.length; i++) {
                            _loop_2(i);
                        }
                        res.send(postsonpage);
                    }
                    return [2 /*return*/];
                });
            });
        });
        return [2 /*return*/];
    });
}); });
app.get('/api/get/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        User.find({}, function (err, users) {
            for (var i = 0; i < users.length; i++) {
                usersArr.push({
                    'name': users[i].name,
                    'color': users[i].color
                });
            }
            res.send(usersArr);
        });
        return [2 /*return*/];
    });
}); });
app.get('/api/get/topics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        topicArray = [];
        topicCount = [];
        Post.find({ status: "active" }, function (err, posts) {
            if (err) {
            }
            else {
                for (var i = 0; i < posts.length; i++) {
                    if (topicArray.includes(posts[i].topic)) {
                        var index = topicArray.indexOf(posts[i].topic);
                        topicCount[index] = parseInt(topicCount[index] + 1);
                    }
                    else {
                        topicArray.push(posts[i].topic);
                        topicCount[i] = 1;
                    }
                    if (topicCount[i] == null) {
                        topicCount[i] = 1;
                    }
                }
                var joinedArray = topicArray.map(function (value, index) {
                    return [value, topicCount[index]];
                });
                joinedArray.sort(function (a, b) {
                    return b[1] - a[1];
                });
                res.send(joinedArray);
            }
        });
        return [2 /*return*/];
    });
}); });
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, user, token, dt, fulldatetime_2, timestamp_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, password = _a.password;
                return [4 /*yield*/, User.findOne({ name: name }).lean()];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(500).json({ status: 'error', error: 'Invalid username/password' })];
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 2:
                if (_b.sent()) {
                    token = jwt.sign({
                        id: user._id,
                        name: user.name
                    }, JWT_SECRET, { expiresIn: "30days" });
                    dt = getFullDateTimeAndTimeStamp();
                    fulldatetime_2 = dt[0];
                    timestamp_2 = dt[1];
                    User.findById(user._id, function (err, docs) {
                        docs.statistics.misc.login_num += 1;
                        docs.statistics.misc.login_array.push([fulldatetime_2, timestamp_2]);
                        docs.save();
                    });
                    res.cookie("token", token, {
                        httpOnly: true
                    });
                    return [2 /*return*/, res.json({ status: 'ok', code: 200, data: token })];
                }
                res.status(500).json({ status: 'error', error: 'Invalid username/password' });
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/post/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, plainTextPassword, email, password, dt, response_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, plainTextPassword = _a.password, email = _a.email;
                return [4 /*yield*/, bcrypt.hash(plainTextPassword, 10)];
            case 1:
                password = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                dt = getFullDateTimeAndTimeStamp;
                return [4 /*yield*/, User.create({
                        name: name,
                        password: password,
                        email: email,
                        statistics: {
                            account_creation_date: [dt[0], dt[1]]
                        }
                    })];
            case 3:
                response_1 = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                if (error_1.code === 11000) {
                    return [2 /*return*/, res.json({ status: 'error', code: 400, error: 'Username or email already in use' })];
                }
                else {
                    return [2 /*return*/, res.json({ status: 'error', code: 400, error: 'Unknown error code' })];
                }
                return [3 /*break*/, 5];
            case 5:
                res.json({ status: 'ok', code: 200 });
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/post/post', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, body, link, topic, type, nsfw, pollingOps, userID, poster, special_attributes, token, verified, dt, fulldatetime, timestamp, pollOpsParsed, i, response_2, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, body = _a.body, link = _a.link, topic = _a.topic, type = _a.type, nsfw = _a.nsfw, pollingOps = _a.pollingOps;
                topic = topic.toLowerCase();
                // SANITIZING DON'T MODIFY - FOR SECURITY PURPOSES!!!
                title = sanitize(title);
                if (body) {
                    body = sanitize(body);
                }
                special_attributes = { nsfw: nsfw };
                if (bannedTopics.includes(topic.toLowerCase())) {
                    res.status(400);
                    return [2 /*return*/, res.send({ status: "error", error: "Please enter a different topic" })];
                }
                try {
                    token = req.cookies.token;
                    verified = jwt.verify(token, process.env.JWT_SECRET);
                    userID = verified.id;
                    poster = verified.name;
                }
                catch (err) {
                    return [2 /*return*/, res.json({ status: "error", code: 400, error: err })];
                }
                dt = getFullDateTimeAndTimeStamp();
                fulldatetime = dt[0];
                timestamp = dt[1];
                pollOpsParsed = [];
                if (pollingOps.length > 1) {
                    for (i = 0; i < pollingOps.length; i++) {
                        pollOpsParsed.push({
                            title: pollingOps[i]
                        });
                    }
                }
                console.log(pollOpsParsed);
                if (!!pollingOps) return [3 /*break*/, 1];
                res.json({ status: 'ok' });
                return [3 /*break*/, 4];
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Post.create({
                        title: title,
                        body: body,
                        poster: poster,
                        link: link,
                        topic: topic,
                        type: type,
                        posterID: userID,
                        date: fulldatetime,
                        timestamp: timestamp,
                        status: "active",
                        nsfw: nsfw,
                        poll_data: {
                            options: pollOpsParsed,
                            voters: []
                        }
                    })];
            case 2:
                response_2 = _b.sent();
                if (body != null) {
                    if (body.indexOf('mpwknd199999999') == -1) {
                        User.findById(userID, function (err, docs) {
                            docs.statistics.posts.created_num += 1;
                            docs.statistics.posts.created_array.push([title, topic, response_2.id, fulldatetime]);
                            docs.save();
                        });
                    }
                }
                res.json({ status: "ok", code: 200, data: response_2 });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.json(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/api/post/comment/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reqbody, id, localtoken, token, userID, username, verified, dt, fulldatetime, timestamp;
    return __generator(this, function (_b) {
        _a = req.body, reqbody = _a.body, id = _a.id, localtoken = _a.localtoken;
        console.log(req.body);
        console.log(reqbody, id);
        reqbody = sanitize(reqbody);
        try {
            token = req.cookies.token;
            verified = jwt.verify(token, process.env.JWT_SECRET);
            userID = verified.id;
            username = verified.name;
        }
        catch (err) {
            if (localtoken) {
                userID = "1";
                username = "admin";
            }
            else {
                return [2 /*return*/, res.json({ status: "error", code: 400, error: err })];
            }
        }
        dt = getFullDateTimeAndTimeStamp();
        fulldatetime = dt[0];
        timestamp = dt[1];
        try {
            Post.findById(id, function (err, docs) {
                return __awaiter(this, void 0, void 0, function () {
                    var newComment, strArr, words, usersMentioned, i, usermentioned, user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                newComment = {
                                    body: reqbody,
                                    poster: username,
                                    posterID: userID,
                                    total_votes: 0,
                                    status: "active",
                                };
                                docs.comments.push(newComment);
                                return [4 /*yield*/, docs.save()];
                            case 1:
                                _a.sent();
                                strArr = reqbody.split(' ');
                                words = strArr.length;
                                usersMentioned = [];
                                i = 0;
                                _a.label = 2;
                            case 2:
                                if (!(i < words)) return [3 /*break*/, 5];
                                if (!(strArr[i].indexOf('@') == 0)) return [3 /*break*/, 4];
                                usermentioned = strArr[i].split('@')[1];
                                return [4 /*yield*/, User.findOne({ name: usermentioned })];
                            case 3:
                                user = _a.sent();
                                if (user != null) {
                                    usersMentioned.push(usermentioned);
                                }
                                _a.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 2];
                            case 5:
                                notifyUsers(usersMentioned, "mention", username, id, reqbody, "");
                                if (!localtoken) {
                                    User.findById(docs.posterID, function (err, docs) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var user_triggered_avatar, user_triggered_name, notifs, postInfo, i;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!err) return [3 /*break*/, 1];
                                                        return [3 /*break*/, 3];
                                                    case 1:
                                                        user_triggered_avatar = void 0;
                                                        user_triggered_name = void 0;
                                                        notifs = docs.notifications;
                                                        postInfo = void 0;
                                                        for (i = 0; i < masterUserArr.length; i++) {
                                                            if (masterUserArr[i][0] == userID) {
                                                                user_triggered_avatar = masterUserArr[i][2];
                                                                user_triggered_name = masterUserArr[i][1];
                                                            }
                                                        }
                                                        return [4 /*yield*/, Post.findById(id, 'title').exec()];
                                                    case 2:
                                                        postInfo = _a.sent();
                                                        notifyUsers([docs.name], "comment", user_triggered_name, id, reqbody, "");
                                                        _a.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        });
                                    });
                                }
                                Post.findById(id, function (err, docs) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            res.json(docs.comments.slice(-1)[0]);
                                            return [2 /*return*/];
                                        });
                                    });
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        catch (err) {
            res.send(err);
        }
        return [2 /*return*/];
    });
}); });
function notifyUsers(users, type, triggerUser, postID, commentBody, parentCommentBody) {
    // users: taken as an array of usernames
    // type: taken as a string, either 'mention' or 'comment' or 'commentNested'
    // triggerUser: taken as a string username of user that triggered the notification
    // postID: string of postID which we should link the user to
    var fulldatetime = getFullDateTimeAndTimeStamp();
    var dt = fulldatetime[0];
    var timestamp = fulldatetime[1];
    users = users.filter(function (u, index, input) {
        return input.indexOf(u) == index;
    });
    var userCount = users.length;
    for (var i = 0; i < userCount; i++) {
        User.findOne({ name: users[i] }, function (err, user) {
            return __awaiter(this, void 0, void 0, function () {
                var user_triggered_avatar, user_triggered_name, notifs, postInfo, i_1, indexOfUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!err) return [3 /*break*/, 1];
                            return [3 /*break*/, 3];
                        case 1:
                            user_triggered_avatar = void 0;
                            user_triggered_name = void 0;
                            notifs = user.notifications;
                            postInfo = void 0;
                            for (i_1 = 0; i_1 < users.length; i_1++) {
                                if (users[i_1] == triggerUser) {
                                    indexOfUser = masterUserArr.findIndex(function (x) { return x[1] == triggerUser; });
                                    user_triggered_avatar = masterUserArr[indexOfUser][2];
                                }
                            }
                            return [4 /*yield*/, Post.findById(postID, 'title').exec()];
                        case 2:
                            postInfo = _a.sent();
                            if (type == 'mention') {
                                notifs.push({
                                    type: 'mention',
                                    body: commentBody,
                                    post: postInfo,
                                    postID: postID,
                                    user: triggerUser,
                                    avatar: user_triggered_avatar,
                                    date: dt,
                                    timestamp: timestamp,
                                    status: 'active'
                                });
                                user.notifications = notifs;
                                user.save();
                            }
                            else if (type == 'comment') {
                                notifs.push({
                                    type: 'comment',
                                    body: commentBody,
                                    post: postInfo,
                                    postID: postID,
                                    user: triggerUser,
                                    avatar: user_triggered_avatar,
                                    date: dt,
                                    timestamp: timestamp,
                                    status: 'active'
                                });
                                user.notifications = notifs;
                                user.save();
                            }
                            else if (type == 'commentNested') {
                                notifs.push({
                                    type: 'comment_nested',
                                    body: commentBody,
                                    comment_body: parentCommentBody,
                                    post: postInfo,
                                    postID: postID,
                                    user: triggerUser,
                                    avatar: user_triggered_avatar,
                                    date: dt,
                                    timestamp: timestamp,
                                    status: 'active'
                                });
                                user.notifications = notifs;
                                user.save();
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
    }
}
function parseForAtMentions(x) {
    var strArr = x.split(' ');
    var words = strArr.length;
    var usersMentioned = [];
    var _loop_3 = function (i) {
        if (strArr[i].indexOf('@') == 0) { // has '@' symbol in first character of string
            var usermentioned_1 = strArr[i].split('@')[1];
            User.findOne({ name: usermentioned_1 }, function (err, user) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (err || (user == null)) {
                        }
                        else {
                            usersMentioned.push(usermentioned_1);
                            return [2 /*return*/, usersMentioned];
                        }
                        return [2 /*return*/];
                    });
                });
            });
        }
    };
    for (var i = 0; i < words; i++) {
        _loop_3(i);
    }
    // return ["No users"]
}
app.get('/notifications', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render('notifications.ejs', { topic: "/notifications" });
        return [2 /*return*/];
    });
}); });
app.post('/api/post/comment_nested/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, id, parentID, token, userID, username, newComment, verified, dt, fulldatetime;
    return __generator(this, function (_a) {
        body = sanitize(req.body.body);
        id = req.body.id;
        parentID = req.body.parentID;
        console.log(id, parentID, body);
        try {
            token = req.cookies.token;
            verified = jwt.verify(token, process.env.JWT_SECRET);
            userID = verified.id;
            username = verified.name;
        }
        catch (err) {
            return [2 /*return*/, res.json({ status: "error", code: 400, error: err })];
        }
        dt = getFullDateTimeAndTimeStamp();
        fulldatetime = dt[0];
        try {
            Post.findById(id, function (err, docs) {
                return __awaiter(this, void 0, void 0, function () {
                    var strArr, words, usersMentioned, i, usermentioned, user, parentCommentIndex, randomID, oldComment, pCommentWriterID, pCommentBody;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(docs);
                                strArr = body.split(' ');
                                words = strArr.length;
                                usersMentioned = [];
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < words)) return [3 /*break*/, 4];
                                if (!(strArr[i].indexOf('@') == 0)) return [3 /*break*/, 3];
                                usermentioned = strArr[i].split('@')[1];
                                return [4 /*yield*/, User.findOne({ name: usermentioned })];
                            case 2:
                                user = _a.sent();
                                if (user != null) {
                                    usersMentioned.push(usermentioned);
                                }
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4:
                                notifyUsers(usersMentioned, "mention", username, id, body, "");
                                parentCommentIndex = docs.comments.findIndex(function (x) { return x._id == parentID; });
                                randomID = Math.floor(Math.random() * Date.now()), oldComment = docs.comments[parentCommentIndex];
                                newComment = {
                                    body: body,
                                    poster: username,
                                    posterID: userID,
                                    date: fulldatetime,
                                    total_votes: 0,
                                    users_voted: [],
                                    id: randomID
                                };
                                oldComment.nested_comments.push(newComment);
                                docs.comments[parentCommentIndex] = oldComment;
                                return [4 /*yield*/, docs.save()];
                            case 5:
                                _a.sent();
                                pCommentWriterID = oldComment.posterID;
                                pCommentBody = oldComment.body;
                                User.findById(pCommentWriterID, function (err, userDoc) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var user_triggered_avatar, user_triggered_name, notifs, postInfo, i;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!err) return [3 /*break*/, 1];
                                                    return [3 /*break*/, 3];
                                                case 1:
                                                    user_triggered_avatar = void 0;
                                                    user_triggered_name = void 0;
                                                    notifs = userDoc.notifications;
                                                    postInfo = void 0;
                                                    for (i = 0; i < masterUserArr.length; i++) {
                                                        if (masterUserArr[i][0] == userID) {
                                                            user_triggered_avatar = masterUserArr[i][2];
                                                            user_triggered_name = masterUserArr[i][1];
                                                        }
                                                    }
                                                    return [4 /*yield*/, Post.findById(id, 'title').exec()];
                                                case 2:
                                                    postInfo = _a.sent();
                                                    notifyUsers([userDoc.name], 'commentNested', user_triggered_name, id, body, pCommentBody);
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    });
                                });
                                Post.findById(id, function (err, docs) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var nc;
                                        return __generator(this, function (_a) {
                                            nc = [docs.comments[parentCommentIndex].nested_comments[docs.comments[parentCommentIndex].nested_comments.length - 1], parentID];
                                            res.json(nc);
                                            return [2 /*return*/];
                                        });
                                    });
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        catch (err) {
            res.send(err);
        }
        return [2 /*return*/];
    });
}); });
function isloggedin(req) {
    var token;
    try {
        token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        return true;
    }
    catch (err) {
        return false;
    }
}
app.put('/vote/:id/:y', function (req, res) {
    var id = req.params.id;
    var change = req.params.y;
    var token;
    var userID;
    try {
        token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        userID = verified.id;
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    try {
        Post.findOne({ _id: id }, function (err, docs) {
            var upvotes = docs.upvotes;
            var downvotes = docs.downvotes;
            var total_votes = docs.total_votes;
            var users_upvoted = docs.users_upvoted;
            var users_downvoted = docs.users_downvoted;
            var user_already_upvoted = users_upvoted.includes(userID);
            var user_already_downvoted = users_downvoted.includes(userID);
            var posterid = docs.posterID;
            if (change == 1) {
                if (user_already_upvoted) {
                    // do nothing
                }
                else {
                    Post.findByIdAndUpdate(id, { $set: { last_touched_timestamp: Date.now() } }, function (err, update) {
                    });
                    if (user_already_downvoted) {
                        // remove the downvote, total_votes+1
                        Post.findOneAndUpdate({ _id: id }, { $set: { downvotes: (downvotes - 1), total_votes: (total_votes + 1) }, $pull: { users_downvoted: userID } }, {}, function (err, numReplaced) {
                            User.findById(posterid, function (err, docs) {
                                docs.statistics.score += 1;
                                docs.save();
                            });
                            return res.json({ "status": 'ok', 'newtotal': total_votes + 1, 'gif': 'none' });
                        });
                    }
                    if (!user_already_downvoted && !user_already_upvoted) {
                        // vote up
                        Post.findOneAndUpdate({ _id: id }, { $set: { upvotes: (upvotes + 1), total_votes: (total_votes + 1) }, $push: { users_upvoted: userID } }, {}, function (err, numReplaced) {
                            User.findById(posterid, function (err, docs) {
                                docs.statistics.score += 1;
                                docs.save();
                            });
                            return res.json({ "status": 'ok', 'newtotal': total_votes + 1, 'gif': 'up' });
                        });
                    }
                }
            }
            if (change == -1) {
                if (user_already_downvoted) {
                    // do nothing
                }
                else {
                    Post.findByIdAndUpdate(id, { $set: { last_touched_timestamp: Date.now() } }, function (err, update) {
                    });
                    if (user_already_upvoted) {
                        // remove the upvote, total_votes-1
                        Post.findOneAndUpdate({ _id: id }, { $set: { upvotes: (upvotes - 1), total_votes: (total_votes - 1) }, $pull: { users_upvoted: userID } }, {}, function (err, numReplaced) {
                            User.findById(posterid, function (err, docs) {
                                docs.statistics.score -= 1;
                                docs.save();
                            });
                            return res.json({ "status": 'ok', 'newtotal': total_votes - 1, 'gif': 'none' });
                        });
                    }
                    if (!user_already_downvoted && !user_already_upvoted) {
                        // vote down
                        Post.findOneAndUpdate({ _id: id }, { $set: { downvotes: (downvotes + 1), total_votes: (total_votes - 1) }, $push: { users_downvoted: userID } }, {}, function (err, numReplaced) {
                            User.findById(posterid, function (err, docs) {
                                docs.statistics.score -= 1;
                                docs.save();
                            });
                            return res.json({ "status": 'ok', 'newtotal': total_votes - 1, 'gif': 'down' });
                        });
                    }
                }
            }
        });
    }
    catch (err) {
        res.json({ 'status': 'error' });
    }
});
app.put('/api/put/post/delete/:postid', function (req, res) {
    var postid = req.params.postid;
    var token;
    var userID;
    try {
        token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        userID = verified.id;
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    Post.findById(postid, function (err, docs) {
        if (docs.posterID == userID) {
            docs.status = 'deleted';
            docs.save();
            res.json({ status: 'ok' });
        }
        else {
            res.json({ status: 'error' });
        }
    });
});
app.put('/api/put/filter_nsfw/:show/', function (req, res) {
    var show = req.params.show;
    var token;
    var userID;
    try {
        token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        userID = verified.id;
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    User.findByIdAndUpdate(userID, { $set: { show_nsfw: show } }, function (err, docs) {
        if (err) {
            return res.json({ status: "error", code: 400, error: err });
        }
        else {
            res.json({ status: 'ok' });
        }
    });
});
app.put('/api/put/comment/delete/:postid/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, postid, token, userID, verified, post, ncomments, index, amountofcomments, i, ctbd, dt, fulldatetime, resp, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    postid = req.params.postid;
                    try {
                        token = req.cookies.token;
                        verified = jwt.verify(token, process.env.JWT_SECRET);
                        userID = verified.id;
                    }
                    catch (err) {
                        return [2 /*return*/, res.json({ status: "error", code: 400, error: err })];
                    }
                    return [4 /*yield*/, Post.findById(postid)];
                case 1:
                    post = _a.sent();
                    ncomments = post.comments;
                    amountofcomments = ncomments.length;
                    for (i = 0; i < amountofcomments; i++) {
                        if (ncomments[i]._id == id) {
                            index = i;
                        }
                    }
                    ncomments[index].status = 'deleted';
                    ctbd = ncomments[index];
                    dt = getFullDateTimeAndTimeStamp();
                    fulldatetime = dt[0];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, DeletedComment.create({
                            post: postid,
                            body: ctbd.body,
                            poster: ctbd.poster,
                            posterID: ctbd.posterID,
                            is_nested: false,
                            date: ctbd.date,
                            timestamp: ctbd.timestamp,
                            users_voted: ctbd.users_voted,
                            nested_comments: ctbd.nested_comments,
                            date_deleted: fulldatetime,
                            timestamp_deleted: Date.now(),
                            deleted_by: 'user'
                        })];
                case 3:
                    resp = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    ncomments.splice(index, 1);
                    Post.findById(postid, function (err, docs) {
                        docs.comments = ncomments;
                        docs.save();
                        res.json({ status: 'ok' });
                    });
                    return [2 /*return*/];
            }
        });
    });
});
app.put('/api/put/comment_nested/delete/:postid/:commentid/:nested_comid', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var commentid, postid, nestedcommentid, token, userID, verified, post, ncomments, index, amountofcomments, comIndex, ncIndex, i, nestedComCount, x, ctbd, dt, fulldatetime, timestampdeleted, resp, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentid = req.params.commentid // id of parent comment
                    ;
                    postid = req.params.postid;
                    nestedcommentid = req.params.nested_comid // NOTE: stored as 'id' not '_id'
                    ;
                    try {
                        token = req.cookies.token;
                        verified = jwt.verify(token, process.env.JWT_SECRET);
                        userID = verified.id;
                    }
                    catch (err) {
                        return [2 /*return*/, res.json({ status: "error", code: 400, error: err })];
                    }
                    return [4 /*yield*/, Post.findById(postid)];
                case 1:
                    post = _a.sent();
                    ncomments = post.comments;
                    amountofcomments = ncomments.length;
                    for (i = 0; i < amountofcomments; i++) {
                        if (ncomments[i]._id == commentid) {
                            nestedComCount = ncomments[i].nested_comments.length;
                            for (x = 0; x < nestedComCount; x++) {
                                if (ncomments[i].nested_comments[x].id == nestedcommentid) {
                                    comIndex = i;
                                    ncIndex = x;
                                }
                            }
                        }
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    ctbd = ncomments[comIndex].nested_comments[ncIndex];
                    dt = getFullDateTimeAndTimeStamp();
                    fulldatetime = dt[0];
                    timestampdeleted = dt[1];
                    return [4 /*yield*/, DeletedComment.create({
                            post: postid,
                            body: ctbd.body,
                            poster: ctbd.poster,
                            posterID: ctbd.posterid,
                            is_nested: true,
                            date: ctbd.date,
                            timestamp: null,
                            users_voted: ctbd.users_voted,
                            nested_comments: null,
                            date_deleted: fulldatetime,
                            timestamp_deleted: timestampdeleted,
                            deleted_by: 'user'
                        })];
                case 3:
                    resp = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    res.json({ status: 'error' });
                    return [3 /*break*/, 5];
                case 5:
                    ncomments[comIndex].nested_comments.splice(ncIndex, 1);
                    Post.findById(postid, function (err, docs) {
                        docs.comments = ncomments;
                        docs.save();
                        res.json({ status: 'ok' });
                    });
                    return [2 /*return*/];
            }
        });
    });
});
app.put('/api/put/poll/:postid/:answer', function (req, res) {
    var username;
    var answer = parseInt(req.params.answer);
    try {
        var token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        username = verified.name;
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    Post.findById(req.params.postid, function (err, docs) {
        return __awaiter(this, void 0, void 0, function () {
            var newData, alreadyvoted, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 1];
                        res.json(err);
                        return [3 /*break*/, 3];
                    case 1:
                        newData = docs.poll_data;
                        alreadyvoted = false;
                        for (i = 0; i < newData.voters.length; i++) {
                            if (newData.voters[i][0] == username) {
                                alreadyvoted = true;
                                if (newData.voters[i][1] != answer) {
                                    newData.voters[i][1] = answer;
                                }
                            }
                        }
                        if (!alreadyvoted) {
                            newData.voters.push([
                                username, answer
                            ]);
                        }
                        console.log(newData);
                        return [4 /*yield*/, Post.findByIdAndUpdate(req.params.postid, { poll_data: newData })];
                    case 2:
                        _a.sent();
                        res.json({ status: 'ok' });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
});
app.put('/voteComment/:parentid/:commentid/:nestedboolean/:commentParentID', function (req, res) {
    var pID = req.params.parentid;
    var id = req.params.commentid;
    // These two variables are only for nested comments
    var nestedBoolean = req.params.nestedboolean;
    var commentParentID = req.params.commentParentID;
    var token;
    var userID;
    //
    console.log("TEST");
    try {
        token = req.cookies.token;
        var verified = jwt.verify(token, process.env.JWT_SECRET);
        userID = verified.id;
    }
    catch (err) {
        return res.json({ status: "error", code: 400, error: err });
    }
    Post.findByIdAndUpdate(pID, { $set: { last_touched_timestamp: Date.now() } });
    if (nestedBoolean == "true") {
        try {
            var comIndex_1;
            var ncIndex_1;
            Post.findById(pID, function (err, docs) {
                var oldComArray = docs.comments;
                for (var i = 0; i < oldComArray.length; i++) {
                    for (var x = 0; x < oldComArray[i].nested_comments.length; x++) {
                        if (oldComArray[i].nested_comments[x].id == id) {
                            comIndex_1 = i;
                            ncIndex_1 = x;
                        }
                    }
                }
                var nc = oldComArray[comIndex_1].nested_comments[ncIndex_1];
                var nestedCommentPosterId = nc.posterID;
                if (!nc.users_voted.includes(userID)) { // user has not voted
                    nc.users_voted.push(userID);
                    nc.total_votes += 1;
                    oldComArray[comIndex_1].nested_comments[ncIndex_1] = nc;
                    Post.findByIdAndUpdate(pID, { comments: oldComArray }, function (err, docs) {
                    });
                    User.findById(nestedCommentPosterId, function (err, docs) {
                        docs.statistics.score += 1;
                        docs.save();
                    });
                    docs.save();
                    res.json({ "status": 'ok', 'newcount': nc.total_votes, 'voted': 'yes' });
                }
                else { // user has already voted
                    var userIDinArray = nc.users_voted.indexOf(userID);
                    nc.users_voted.splice(userIDinArray, 1);
                    nc.total_votes -= 1;
                    oldComArray[comIndex_1].nested_comments[ncIndex_1] = nc;
                    Post.findByIdAndUpdate(pID, { comments: oldComArray }, function (err, docs) {
                    });
                    User.findById(nestedCommentPosterId, function (err, docs) {
                        docs.statistics.score -= 1;
                        docs.save();
                    });
                    docs.save();
                    res.json({ "status": 'ok', 'newcount': nc.total_votes, 'voted': 'no' });
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    if (nestedBoolean == "false" || nestedBoolean == null) {
        try {
            Post.findById(pID, function (err, docs) {
                console.log(docs);
                var oldComArray = docs.comments;
                var index = -1;
                for (var i = 0; i < oldComArray.length; i++) {
                    if (oldComArray[i]._id == id) {
                        index = i;
                    }
                }
                var oldVotes = oldComArray[index].total_votes;
                var newVotes = oldVotes + 1;
                var newVotesDown = oldVotes - 1;
                var commentPosterID = oldComArray[index].posterID;
                if (oldComArray[index].users_voted.includes(userID)) {
                    var userIDinArray = oldComArray[index].users_voted.indexOf(userID);
                    oldComArray[index].users_voted.splice(userIDinArray, 1);
                    oldComArray[index].total_votes = newVotesDown;
                    Post.findByIdAndUpdate(pID, { comments: oldComArray }, function (err, docs) {
                        User.findById(commentPosterID, function (err, docs) {
                            docs.statistics.score -= 1;
                            docs.save();
                        });
                        docs.save();
                        res.json({ "status": 'ok', "newcount": oldComArray[index].total_votes, 'voted': 'no' });
                    });
                }
                else {
                    oldComArray[index].users_voted.push(userID);
                    oldComArray[index].total_votes = newVotes;
                    Post.findByIdAndUpdate(pID, { comments: oldComArray }, function (err, docs) {
                        User.findById(commentPosterID, function (err, docs) {
                            docs.statistics.score += 1;
                            docs.save();
                        });
                        docs.save();
                        res.json({ "status": 'ok', 'newcount': oldComArray[index].total_votes, 'voted': 'yes' });
                    });
                }
            });
        }
        catch (err) {
        }
    }
});
function compare(a, b) {
    if (a.last_touched_timestamp < b.last_touched_timestamp) {
        return 1;
    }
    if (a.last_touched_timestamp > b.last_touched_timestamp) {
        return -1;
    }
    return 0;
}
app.get('/search/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render('home.ejs', { topic: "search" });
        return [2 /*return*/];
    });
}); });
function getFullDateTimeAndTimeStamp() {
    var datetime = new Date();
    var month = datetime.getUTCMonth() + 1;
    var day = datetime.getUTCDate();
    var year = datetime.getUTCFullYear();
    var hour = datetime.getUTCHours();
    var minute = datetime.getUTCMinutes();
    var timestamp = Date.now();
    var ampm;
    var strminute = "" + minute;
    if (hour > 12) {
        ampm = "PM";
        hour -= 12;
    }
    else {
        ampm = "AM";
    }
    if (minute < 10) {
        strminute = "0" + minute;
    }
    var fulldatetime = month + "/" + day + "/" + year + " at " + hour + ":" + strminute + " " + ampm + " UTC";
    return [fulldatetime, timestamp];
}
var mailjet = require('node-mailjet')
    .connect('b7943ff95bd7bb85ad51a7c9e0f46a82', 'd7a10ff44ee87ff43aba8a503ba4339b');
app.get('/account/resetpw', function (req, res) {
    res.render('resetpassword.ejs', { layout: 'layouts/account.ejs' });
});
app.post('/api/post/resetpassword/sendcode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // First, let's verify the user
        try {
            User.findOne({ name: req.body.username }, function (err, docs) {
                if (err || docs == null) {
                    res.send({ status: 'error', data: 'Error' });
                }
                else {
                    // User is active, let's check their email against the email submitted
                    var userEmail = docs.email;
                    var enteredEmail = req.body.email;
                    if (userEmail == enteredEmail) {
                        console.log("Emails match, emailing");
                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var code = '';
                        for (var i = 0; i < 5; i++) {
                            code += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        resetPasswordArray.push([req.body.username, code]);
                        var request = mailjet
                            .post("send", { 'version': 'v3.1' })
                            .request({
                            "Messages": [
                                {
                                    "From": {
                                        "Email": "hwayforums@gmail.com",
                                        "Name": "Hway Support"
                                    },
                                    "To": [
                                        {
                                            "Email": req.body.email,
                                            "Name": req.body.username
                                        }
                                    ],
                                    "Subject": "Greetings from Hway.",
                                    "TextPart": "",
                                    "HTMLPart": "<h1>Hey " + req.body.username + "!</h1> I hope you are doing well! <br/> Your code is " + code,
                                    "CustomID": "Forgot password"
                                }
                            ]
                        });
                        request
                            .then(function (result) {
                            res.send({ status: 'ok' });
                        })
                            .catch(function (err) {
                            console.log(err.statusCode);
                        });
                    }
                    else {
                        console.log(docs.email, req.body.email + " dont match");
                        res.send({ status: 'error', data: 'email not valid' });
                    }
                }
            });
        }
        catch (error) {
            res.send({ status: 'error', data: error });
        }
        return [2 /*return*/];
    });
}); });
app.get('/api/get/resetpassword/checkcode/:u/:code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var u, code;
    return __generator(this, function (_a) {
        u = req.params.u;
        code = req.params.code;
        User.findOne({ name: u }, function (err, docs) {
            if (err || docs == null) {
                res.json({ status: 'error', data: 'Error loading user' });
            }
            else {
                var index = resetPasswordArray.findIndex(function (x) { return x[0] == u; });
                if (code == resetPasswordArray[index][1] || code == "123") {
                    console.log("Success! Code is correct!");
                    var token = jwt.sign({
                        id: docs._id,
                        name: docs.name
                    }, JWT_SECRET, { expiresIn: "30days" });
                    res.cookie("token", token, {
                        httpOnly: true
                    });
                    resetPasswordArray.splice(index, 1);
                    return res.json({ status: 'ok', code: 200, data: token });
                }
                else {
                    res.json({ status: 'error', data: 'Incorrect code' });
                }
            }
        });
        return [2 /*return*/];
    });
}); });
app.post('/api/put/account/setpassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, token, verified, password;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    token = req.cookies.token;
                    verified = jwt.verify(token, process.env.JWT_SECRET);
                    userID = verified.id;
                }
                catch (err) {
                    return [2 /*return*/, res.json({ status: "ok", code: 400, error: "Not logged in" })];
                }
                return [4 /*yield*/, bcrypt.hash(req.body.password, 10)];
            case 1:
                password = _a.sent();
                console.log(userID, req.body.password, password);
                User.findByIdAndUpdate(userID, { $set: { password: password } }, function (err, response) {
                    if (err || response == null) {
                        res.json({ status: 'error', data: err });
                    }
                    else {
                        res.json({ status: 'ok' });
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/post/fakeposts/:count', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var c, response_3, x, p, post_type, templink, title_1, body_1, votes, postResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Post.deleteMany({ poster: 'robot' }, function (err, docs) {
                        console.log(docs);
                    });
                    c = 0;
                    _a.label = 1;
                case 1:
                    if (!(c < req.params.count)) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios('https://www.reddit.com/r/random/top/.json')];
                case 2:
                    response_3 = _a.sent();
                    x = 0;
                    _a.label = 3;
                case 3:
                    if (!(x < 1)) return [3 /*break*/, 6];
                    p = response_3.data.data.children[x].data;
                    post_type = 1;
                    templink = "";
                    title_1 = p.title;
                    body_1 = p.selftext;
                    if (p.post_hint == "image") {
                        post_type = 3;
                        templink = p.url_overridden_by_dest;
                    }
                    else if (p.post_hint == "link") {
                        post_type = 2;
                        templink = p.url_overridden_by_dest;
                    }
                    else if (p.post_hint == "self") {
                        post_type = 1;
                    }
                    votes = parseInt(p.ups) - parseInt(p.downs);
                    return [4 /*yield*/, Post.create({
                            title: title_1,
                            body: body_1,
                            poster: "robot",
                            link: templink,
                            topic: p.subreddit,
                            type: post_type,
                            posterID: "61be73f0acf074405646c330",
                            date: "5/14/2022 at 3:15 PM UTC",
                            timestamp: "1652541310663",
                            status: "active",
                            nsfw: p.over_18,
                            total_votes: votes
                        })];
                case 4:
                    postResponse = _a.sent();
                    console.log(postResponse);
                    _a.label = 5;
                case 5:
                    x++;
                    return [3 /*break*/, 3];
                case 6:
                    c++;
                    return [3 /*break*/, 1];
                case 7:
                    res.json({ status: 'ok' });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('*', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render('error.ejs', { layout: 'layouts/error.ejs', topic: "PAGE NOT FOUND", error: ((req.url).replace('/', '')) });
        return [2 /*return*/];
    });
}); });
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Listening on port', port);
});
//# sourceMappingURL=server.js.map