var ncount = 0;
var notifs = [];
var notifsDiv = document.getElementById('header-notifs-bell');
var notifArray = document.getElementById('notif_array');
var notifAlert = document.getElementById('notif_alert');
const getNotifs = async () => {
    console.info("Finding notifications...");
    const response = await fetch('/api/get/notifications');
    const data = await response.json();
    ncount = data.length;
    notifs = data;
    if (data.status == 'error') {
        notifAlert.innerHTML = '<a href="/login">Login to view notifications </a>';
    }
    else {
        console.info("Found " + ncount + " notification(s)...");
        if (ncount >= 1) {
            ringBell();
            if ((window.location.href).split('/')[3] == 'notifications') {
                displayNotifs();
            }
        }
        else {
            ringBell();
        }
    }
    if ((window.location.pathname == '/notifications')) {
        if (ncount < 1) {
            notifAlert.innerHTML = 'No new notifications!';
        }
        if (notifAlert.innerHTML != "") {
            notifAlert.style.display = 'block';
        }
    }
};
function ringBell() {
    notifsDiv.innerHTML = "" + ncount;
}
function displayNotifs() {
    notifArray.innerHTML = "";
    for (let i = 0; i < ncount; i++) {
        let c = document.createElement("div");
        c.setAttribute("class", "notifContainer");
        c.setAttribute("id", "notifContainer_" + i);
        let nb = document.createElement("div");
        nb.setAttribute("class", "notifBody");
        let check = document.createElement("span");
        check.setAttribute("class", "notifCheck noselect");
        check.innerHTML = "✔";
        check.onclick = function () {
            removeNotif(i, "notifContainer_" + i);
        };
        if (notifs[i].type == 'comment') {
            nb.innerHTML = "<span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " replied to '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].post.title + "</a>':</span><br/> " + notifs[i].body;
        }
        if (notifs[i].type == 'comment_nested') {
            nb.innerHTML = "<span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " replied to '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].comment_body + "' in '" + notifs[i].post.title + "</a>':</span><br/> " + notifs[i].body;
        }
        if (notifs[i].type == 'mention') {
            nb.innerHTML = "<span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " mentioned you in '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].post.title + "</a>'";
            check.style.paddingTop = '5px';
            check.style.paddingBottom = '5px';
        }
        c.append(nb, check);
        notifArray.append(c);
    }
}
notifsDiv.addEventListener('click', function () {
    window.location.href = '/notifications';
});
const removeNotif = async (index, id) => {
    console.log(index);
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/notif/remove/' + index, settings);
    const data = await response.json();
    console.log(data);
    if (data.status == 'ok') {
        document.getElementById(id).innerHTML = "";
        ncount -= 1;
        notifs.splice(index, 1);
        displayNotifs();
        ringBell();
    }
};
getNotifs();
