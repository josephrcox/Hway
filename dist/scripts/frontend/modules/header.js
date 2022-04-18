// @ts-nocheck
export var header_currentUser = document.getElementById("currentUser");
export var header_dd_profile = document.getElementById("profile_button");
export var header_dd = document.getElementById("user-dropdown");
if (localStorage.getItem("currentUsername") != null) {
    header_currentUser.innerText = localStorage.getItem("currentUsername") + "";
    header_dd_profile.href = "/user/" + localStorage.getItem("currentUsername");
}
export function currentuserDropdownClicked() {
    header_dd.classList.toggle("show");
}
document.onclick = function (e) {
    if (e.target.id !== 'currentUser') {
        if (header_dd.classList.contains('show')) {
            header_dd.classList.remove('show');
        }
    }
};
console.log("log");
//# sourceMappingURL=header.js.map