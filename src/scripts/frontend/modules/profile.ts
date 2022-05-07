const profile_avatar = document.getElementsByClassName('profile-info_avatar_name')[0] as HTMLDivElement
const profile_stats = document.getElementsByClassName('profile-info_stats')[0] as HTMLDivElement
const profile_feed = document.getElementsByClassName('profile-feed')[0] as HTMLDivElement
const profile_stats_table = document.getElementsByClassName('profile-info_stats_table')[0] as HTMLDivElement

const profile_username = window.location.pathname.split('/user/')[1]
let profile_user:any

import { getPostsByTopic, loadPostOrPostObjects } from "../main.js"

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
    console.log("POSTS:")
    console.log(data)

    loadPostOrPostObjects(data)
}

init()