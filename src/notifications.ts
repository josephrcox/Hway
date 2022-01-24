 // [type (comment), string of notification heading, postID, avatar of user initiated change]
var ncount:number = 0
var notifs:any[] = []
var notifsDiv = document.getElementById('header-notifs-bell')
var notifArray = document.getElementById('notif_array')
var notifAlert = document.getElementById('notif_alert')
var clearNotifButton = document.getElementById('notif_clearall')
var notifSorting = document.getElementById('notif_sorting')

const getNCount = async() => {
    const response = await fetch('/api/get/notification_count')
    const data = await response.json()
    ncount = parseInt(data.length) 
    
    if (ncount >= 1) {
        ringBell()
        if ((window.location.href).indexOf('notifications') != -1) {
            getNotifs()
            displayNotifs()
        }
    } else {
        ringBell()
        if ((window.location.href).indexOf('notifications') != -1) {
            notifAlert.innerHTML = 'No new notifications!'
        }
    }
    if ((window.location.href).indexOf('notifications') != -1) {
        if (notifAlert.innerHTML != "") {
            notifAlert.style.display = 'block'
        }
    }

}

const getNotifs = async() => {
    console.info("Finding notifications...")
    const response = await fetch('/api/get/notifications')
    const data = await response.json()

    ncount = data.length
    notifs = data

    if (data.status == 'error') {
        notifAlert.innerHTML = '<a href="/login">Login to view notifications </a>'
    } else {
        console.info("Found "+ncount+" notification(s)...")

        if (ncount >= 1) {
            ringBell()
            if ((window.location.href).split('/')[3] == 'notifications') {
                displayNotifs()
            }
        } else {
            ringBell()
            notifAlert.innerHTML = 'No new notifications!'
        }
        if (notifAlert.innerHTML != "") {
            notifAlert.style.display = 'block'
        }
    }
    
}

function ringBell() {
    notifsDiv.innerHTML = ""+ncount
}

function displayNotifs() {
    if (notifSorting.dataset.sortingoption == '0') {
        notifs.sort(function(a, b){return a.timestamp - b.timestamp}); 
    } else {
        notifs.sort(function(a, b){return b.timestamp - a.timestamp}); 
    }

    notifSorting.style.display = 'block'
    clearNotifButton.style.display = 'block'
    notifArray.innerHTML = ""
    let currentTimestamp = new Date()

    for (let i=0;i<ncount;i++) {
        console.log(notifs)
        let diffMs = currentTimestamp.getTime() - notifs[i].timestamp;
        let timeago = 'less than 1 minute ago'
        console.log(diffMs)
        
        if (diffMs > 60000) {
            timeago = Math.round(diffMs/60000) + ' minutes ago'
        }
        if (diffMs > 3600000) {
            timeago = Math.round(diffMs/3600000) + ' hours ago'
        }
        if (diffMs > 86400000) {
            timeago = Math.round(diffMs/86400000) + ' days ago'
        }
        if (diffMs > 604800000) {
            timeago = Math.round(diffMs/604800000) + ' weeks ago'
        }
        if (diffMs > (604800000*31)) {
            timeago = Math.round(diffMs/(604800000*31)) + ' months ago'
        }
        if (diffMs > 31556952000) {
            timeago = Math.round(diffMs/31556952000) + ' years ago'
        }

        let c = document.createElement("div");
        c.setAttribute("class", "notifContainer");
        c.setAttribute("id", "notifContainer_" + i);
        
        let anb = document.createElement("div")
        anb.setAttribute("class", "notifAvatarAndBody");
        anb.style.display = 'flex'

        let nb = document.createElement("div");
        nb.setAttribute("class", "notifBody");
        nb.style.paddingLeft = '10px'

        let avatar = document.createElement("img")
        avatar.src = notifs[i].avatar
        avatar.style.width = '50px'
        avatar.style.height = 'auto'
        avatar.style.marginLeft = '-6px'
        avatar.style.objectFit = 'contain'

        let check = document.createElement("span");
        check.setAttribute("class", "notifCheck noselect");
        check.innerHTML = "✔";

        check.onclick = function () {
            removeNotif(i, "notifContainer_" + i);
        };
        if (notifs[i].type == 'comment') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " replied to '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].post.title + "</a>':</span><br/> " + notifs[i].body;
        }
        if (notifs[i].type == 'comment_nested') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span><span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " replied to '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].comment_body + "' in '" + notifs[i].post.title + "</a>':</span><br/> " + notifs[i].body;
        }
        if (notifs[i].type == 'mention') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + notifs[i].user + " mentioned you in '<a href='/posts/" + notifs[i].postID + "'>" + notifs[i].post.title + "</a>'";
            check.style.paddingTop = '5px';
            check.style.paddingBottom = '5px';
        }

        anb.append(avatar, nb)
        c.append(anb, check);
        notifArray.append(c);
    }
}

notifsDiv.addEventListener('click', function() {
    window.location.href = '/notifications'
})

const removeNotif = async(index, id) => {
    const settings = {
        method: 'PUT',
    };

    const response = await fetch('/api/put/notif/remove/'+index, settings)
    const data = await response.json()

   

    if (data.status == 'ok') {
        ncount -= 1
        document.getElementById(id).innerHTML = ""
        notifs.splice(index,1)
        if (ncount == 0) {
            notifAlert.innerHTML = 'No new notifications!'
            notifArray.innerHTML = ""
            clearNotifButton.style.display = 'none'
            notifAlert.style.display = 'block'
            notifSorting.style.display = 'none'
        } 
        if (ncount != 0) {
            displayNotifs()
        }
        ringBell()
    }
}

if ((window.location.href).split('/')[3] == 'notifications') {
    clearNotifButton.addEventListener('click', async() => {
        notifAlert.innerHTML = 'No new notifications!'
        notifArray.innerHTML = ""
        clearNotifButton.style.display = 'none'
        notifAlert.style.display = 'block'
        notifSorting.style.display = 'none'
        const fetchResponse = await fetch('/api/post/notif/clear/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST'
        }); 
        var data = await fetchResponse.json()
        notifs = []

        ringBell()
       
    })

    notifSorting.addEventListener('click', function() {
        if (notifSorting.dataset.sortingoption == '0') {
            notifSorting.dataset.sortingoption = '1'
            notifSorting.innerHTML = 'Sorting newest to oldest'
        } else {
            notifSorting.dataset.sortingoption = '0'
            notifSorting.innerHTML = 'Sorting oldest to newest'
        }
        displayNotifs()
    })
}


getNCount()