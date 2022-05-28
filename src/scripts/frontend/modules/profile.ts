const profile_avatar = document.getElementsByClassName('profile-info_avatar_name')[0] as HTMLDivElement
const profile_stats = document.getElementsByClassName('profile-info_stats')[0] as HTMLDivElement
const profile_feed = document.getElementsByClassName('profile-feed')[0] as HTMLDivElement
const profile_stats_table = document.getElementsByClassName('profile-info_stats_table')[0] as HTMLDivElement
const profile_avatar_file = document.getElementById('avatar_file') as HTMLInputElement
const profile_avatar_file_label = document.getElementById('avatar_file_label') as HTMLInputElement

const profile_username = window.location.pathname.split('/user/')[1]
let profile_user:any

import { getPostsByTopic, loadPostOrPostObjects } from "../main.js"
import { currentUserID, currentUsername, getUser } from "./auth.js"
import { commentObject } from "./objects/comment.js"

const init = async() => {
    let response = await fetch('/api/get/user/'+profile_username+'/none')
    let data = await response.json();

    (profile_avatar.children[0] as HTMLImageElement).src = data.avatar;
    (profile_avatar.children[1] as HTMLSpanElement).innerText = profile_username

    profile_stats_table.innerHTML += "... joined on  <span class='profile-stat'>" +data.statistics.misc.account_creation_date[0]+"</span>"
    profile_stats_table.innerHTML += "<br/>"
    profile_stats_table.innerHTML += "... has a score of <span class='profile-stat'>" +data.statistics.score+"</span>"
    profile_stats_table.innerHTML += "<br/>"
    profile_stats_table.innerHTML += "... has created  <span class='profile-stat'>" +data.statistics.posts.created_num+"</span> posts"
    profile_stats_table.innerHTML += "<br/>"
    profile_stats_table.innerHTML += "... has created  <span class='profile-stat'>" +data.statistics.comments.created_num+"</span> comments"

    response = await fetch('/api/get/posts/user/'+profile_username)  
    data = await response.json()

    loadPostOrPostObjects(data)

    response = await fetch('/api/get/user/'+profile_username+'/all_comments')
    data = await response.json()

    for (let i=0;i<data.length;i++) {
        let c = Object.create(commentObject)
        c.body = data[i][0].body
        c.poster = data[i][0].poster
        c.posterID = data[i][0].posterID
        c.totalVotes = ""
        c.id = data[i][0]._id
        c.parentid = data[i][1]
        let d = new Date(data[i][0].createdAt)
        c.createdAt = d.toLocaleDateString() + " " + d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1')
        if (data[i][0].users_voted.includes(currentUserID)) {
            c.currentUserUpvoted = true
        } else {
            c.currentUserUpvoted = false
        }
        if (data[i][0].posterID == currentUserID) {
            c.currentUserAdmin = true
        } else {
            c.currentUserAdmin = false
        }
        c.display()

    }
    if (profile_username == currentUsername) {
        profile_avatar_file_label.style.display = 'block'
    }

}

init();

profile_avatar_file.addEventListener("change", async function() {

    let body = new FormData()
    body.set('key', 'e23bc3a1c5f2ec99cc1aa7676dc0f3fb')
    body.append('image', profile_avatar_file.files![0])

    const fetchResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: body
    })
    const data = await fetchResponse.json();
    const url = (JSON.stringify(data.data.image.url)).replace(/["]+/g, '')

    changeAvatar(url)

})

async function changeAvatar(url:any) {
    const bodyJSON = {
        "src":url,
    }
    const response = await fetch('/api/put/user/'+currentUsername+'/avatar/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'PUT',
        body: JSON.stringify(bodyJSON)
    }); 
    const data = await response.json()

    if (data.status == 'ok') {
        (profile_avatar.children[0] as HTMLImageElement).src = url
    }
    if (data.status == 'error') {
        alert(data.error)
    }

}