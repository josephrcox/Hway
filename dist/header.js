const header_postButton = document.getElementById("post-button");

if (localStorage.getItem("currentUsername") == null) {
    document.getElementById("profile_button").style.display = 'none'
    document.getElementById("view_subs_button").style.display = 'none'
    document.getElementById("filter_nsfw_div").style.display = 'none'
} else {
    document.getElementById("header-notifs-bell").style.display = 'block'
    
}