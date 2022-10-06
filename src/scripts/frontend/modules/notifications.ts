import { startLoaders, stopLoaders } from "../main.js"
import { getPageType } from "./pageAnalyzer.js"

const notifsBell = document.getElementById("header-notifs-bell") as HTMLDivElement
const viewCleared = document.getElementById("notif_viewcleared") as HTMLButtonElement
const sorting = document.getElementById("notif_sorting") as HTMLButtonElement
const notifArray = document.getElementById('notif_array') as HTMLDivElement
const clearAll = document.getElementById("notif_clearall") as HTMLButtonElement

export async function apiGetNotificationCount() {
    const response = await fetch('/api/get/notification_count')
    const data = await response.json()
    setBell(data.count)
}

export function setBell(x:number) {
    if (x > 0) {
        notifsBell.innerText = x+""
        notifsBell.classList.add('active')
    } else {
        notifsBell.innerText = ""
        notifsBell.classList.remove('active')
    }
}

export async function apiGetNotifications(cleared:string) {
    startLoaders()
    const response = await fetch('/api/get/notifications/'+cleared)
    const data = await response.json()
    if (data.length < 1) {
        notifArray.innerHTML = 'No new notifications!'
        clearAll.style.display = 'none'
        sorting.style.display = 'none'
        stopLoaders()
    } else {
        sorting.style.display = 'block'
        displayNotifs(data, sorting.dataset.sortingoption+"")
    }
    
}

export function initNotificationButtons() {
    if (viewCleared.dataset.cleared == "false") {
        clearAll.style.display = 'block'
    }
    viewCleared.addEventListener('click', function() {
        if (viewCleared.dataset.cleared == "true") {
            viewCleared.dataset.cleared = "false"
            viewCleared.innerText = "View cleared"
            clearAll.style.display = 'block'
        } else {
            viewCleared.dataset.cleared = "true"
            viewCleared.innerText = "View new"
            clearAll.style.display = 'none'
        }
        notifArray.innerHTML = ""
        
        apiGetNotifications(viewCleared.dataset.cleared)
    })
        
    sorting.addEventListener('click', function() {
        if (sorting.dataset.sortingoption == "0") {
            sorting.dataset.sortingoption = "1"
            sorting.innerText = "Newest to oldest"
            
        } else {
            sorting.dataset.sortingoption = "0"
            sorting.innerText = "Oldest to newest"
        }
        notifArray.innerHTML = ""
        apiGetNotifications(sorting.dataset.sortingoption+"")
    })
    clearAll.addEventListener('click', async() => {
        notifArray.innerHTML = 'No new notifications!'
        clearAll.style.display = 'none'
        sorting.style.display = 'none'
        const fetchResponse = await fetch('/api/post/notif/clear/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST'
        }); 
    })
}


function displayNotifs(n:Array<any>, sorting:string) {
    let s = parseInt(sorting)
    //console.log(n)

    if (sorting == '0') {
        n.sort(function(a, b){return a.timestamp - b.timestamp}); 
    } else {
        n.sort(function(a, b){return b.timestamp - a.timestamp}); 
    }

    let currentTimestamp = new Date()
    
    for (let i=0;i<n.length;i++) {
        let diffMs = currentTimestamp.getTime() - n[i].timestamp;
        let timeago = 'less than 1 minute ago'
        
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
        c.classList.add('animated_entry')
        c.setAttribute("id", "notifContainer_" + i);
        
        let anb = document.createElement("div")
        anb.setAttribute("class", "notifAvatarAndBody");
        anb.style.display = 'flex'

        let nb = document.createElement("div");
        nb.setAttribute("class", "notifBody");
        nb.style.paddingLeft = '10px'

        if (n[i].avatar) {
            let avatar = document.createElement("img")
            avatar.src = n[i].avatar
            avatar.style.width = '50px'
            avatar.style.height = 'auto'
            avatar.style.marginLeft = '-6px'
            avatar.style.objectFit = 'contain'
            anb.append(avatar)
        }


        let check = document.createElement("span");
        check.setAttribute("class", "notifCheck noselect");
        check.innerHTML = "✔";
        check.dataset.timestamp = n[i].timestamp

        check.onclick = function () {
            removeNotif(i, "notifContainer_" + i, check.dataset.timestamp+"");
        };
        if (n[i].type == 'comment') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " replied to '<a href='/p/" + n[i].postID + "'>" + n[i].post.title + "</a>':</span><br/> " + n[i].body;
        }
        if (n[i].type == 'comment_nested') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span><span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " replied to '<a href='/p/" + n[i].postID + "'>" + n[i].comment_body + "' in '" + n[i].post.title + "</a>':</span><br/> " + n[i].body;
        }
        if (n[i].type == 'mention') {
            nb.innerHTML = "<span style='font-size:14px;color:gray;'>"+timeago+" — </span> <span style='font-size:16px;color:gray;font-style:normal;'>" + n[i].user + " mentioned you in '<a href='/p/" + n[i].postID + "'>" + n[i].post.title + "</a>'" + ":</span><br/> " + n[i].body;
        }

        anb.append(nb)
        if (viewCleared.dataset.cleared == "false") {
            c.append(anb, check);
        } else {
            c.append(anb)
        }
        
        notifArray.append(c);
    }
    stopLoaders()
}


const removeNotif = async(index:any, id:string, timestamp:string) => {


    const settings = {
        method: 'PUT',
    };

    const response = await fetch('/api/put/notif/remove/'+timestamp, settings)
    const data = await response.json()

    if (data.status == 'ok') {
        notifsBell.innerText = parseInt(notifsBell.innerText) - 1 + "";
        (document.getElementById(id) as HTMLDivElement).innerHTML = ""
        if (parseInt(notifsBell.innerText) == 0) {
            notifArray.innerHTML = 'No new notifications!'
            clearAll.style.display = 'none'
            sorting.style.display = 'none'
        } 
    }
}