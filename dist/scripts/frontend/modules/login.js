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
import { startLoaders } from "../main.js";
var login_form = document.getElementById("reg-form");
var login_username = document.getElementById("username");
var login_password = document.getElementById("password");
var login_logs = document.getElementById("logs");
var login_submit;
if (window.location.pathname.includes("/login")) {
    login_submit = document.getElementById('login_submit');
    login_submit.addEventListener('click', loginUser);
}
login_password.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        startLoaders();
        login_submit.click();
    }
});
export function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var bodyJSON, fetchResponse, data, ref;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bodyJSON = {
                        "name": login_username.value,
                        "password": login_password.value
                    };
                    return [4 /*yield*/, fetch('/login', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify(bodyJSON)
                        })];
                case 1:
                    fetchResponse = _a.sent();
                    return [4 /*yield*/, fetchResponse.json()];
                case 2:
                    data = _a.sent();
                    if (data.code == 200) {
                        localStorage.clear();
                        ref = window.location.search.split('ref=')[1];
                        if (ref == undefined) {
                            ref = "/";
                        }
                        window.location.href = ref;
                    }
                    if (data.code == 400) {
                        login_logs.innerHTML = data.error;
                    }
                    if (fetchResponse.status != 200) {
                        login_logs.innerHTML = fetchResponse.error;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=login.js.map