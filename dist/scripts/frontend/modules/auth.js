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
export var isUserLoggedIn = false;
export var currentUsername = null;
export var currentUserID = null;
export var currentUserSubscriptions = [];
import { apiGetNotificationCount } from "../modules/notifications.js";
import { apiGetSubscriptions } from "./subscriptions.js";
export var getUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, response_1, data2, filter_nsfw, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('/api/get/currentuser/')];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 9, , 10]);
                if (!(data.code == 400)) return [3 /*break*/, 4];
                isUserLoggedIn = false;
                currentUsername = null;
                localStorage.clear();
                return [3 /*break*/, 8];
            case 4:
                apiGetNotificationCount();
                currentUserID = data.id;
                currentUsername = data.name;
                isUserLoggedIn = true;
                localStorage.setItem("currentUsername", currentUsername);
                return [4 /*yield*/, fetch('/api/get/user/' + data.name + '/show_nsfw')];
            case 5:
                response_1 = _a.sent();
                return [4 /*yield*/, response_1.json()];
            case 6:
                data2 = _a.sent();
                filter_nsfw = document.getElementById('filter_nsfw');
                if (data2.show_nsfw == true) {
                    filter_nsfw.checked = true;
                }
                else {
                    filter_nsfw.checked = false;
                }
                return [4 /*yield*/, apiGetSubscriptions(currentUsername + "")];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 10];
            case 10:
                modifyHeader(isUserLoggedIn, currentUsername + "");
                return [2 /*return*/];
        }
    });
}); };
var dd_username = document.getElementById("currentUser");
var dd_profile = document.getElementById("profile_button");
var dd_logout = document.getElementById("logout_button");
var dd_login = document.getElementById("login_button");
var dd_reg = document.getElementById("reg_button");
var dd_resetpw = document.getElementById("resetpw_button");
var dd_subscriptions = document.getElementById("view_subs_button");
var dd_nsfw = document.getElementById("filter_nsfw_div");
function modifyHeader(loggedin, name) {
    if (loggedin) {
        dd_username.innerText = name;
        dd_login.style.display = 'none';
        dd_reg.style.display = 'none';
        dd_resetpw.style.display = 'none';
        dd_logout.style.display = 'block';
        dd_profile.style.display = 'block';
        dd_nsfw.style.display = 'block';
        dd_subscriptions.style.display = 'block';
    }
    else {
        dd_username.innerText = 'Login / Join';
        dd_login.style.display = 'block';
        dd_reg.style.display = 'block';
        dd_subscriptions.style.display = 'none';
        dd_logout.style.display = 'none';
        dd_profile.style.display = 'none';
        dd_nsfw.style.display = 'none';
    }
}
//# sourceMappingURL=auth.js.map