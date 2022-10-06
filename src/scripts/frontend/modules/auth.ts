export let isUserLoggedIn = false
export let currentUsername = null
export let currentUserID = null
export let currentUserSubscriptions = []

import { apiGetNotificationCount, setBell } from "../modules/notifications.js";
import { apiGetSubscriptions } from "./subscriptions.js";

export const getUser = async () => {
    const response = await fetch('/api/get/currentuser/')
    const data = await response.json()
    
    try {
        if (data.code == 400) { // Error code for 'no user logged in' or 'invalid JWT token'
            isUserLoggedIn = false;
            currentUsername = null
            //localStorage.clear()
        } else {
            setBell(data.bell_count)
            currentUserID = data.id
            currentUsername = data.name
            isUserLoggedIn = true
            localStorage.setItem("currentUsername", currentUsername!)
            
            let filter_nsfw = document.getElementById('filter_nsfw') as HTMLInputElement;
            filter_nsfw.checked = data.show_nsfw;

            let subscribedTopics:any = []
            let subscribedUsers:any = []

            for (let i=0;i<data.subscriptions.topics.length;i++) {
                if (!subscribedTopics.includes(data.subscriptions.topics[i][0].toLowerCase())) {
                    subscribedTopics.push(data.subscriptions.topics[i][0].toLowerCase())
                }
                
            }
            for (let i=0;i<data.subscriptions.users.length;i++) {
                if (!subscribedUsers.includes(data.subscriptions.users[i][0].toLowerCase())) {
                    subscribedUsers.push(data.subscriptions.users[i][0].toLowerCase())
                }
            }
        }    
    } catch(err) {
        console.error(err)
    }
    
    modifyHeader(isUserLoggedIn, currentUsername + "")
}

const dd_username = document.getElementById("currentUser") as HTMLSpanElement
const dd_profile = document.getElementById("profile_button") as HTMLAnchorElement
const dd_logout = document.getElementById("logout_button") as HTMLAnchorElement
const dd_login = document.getElementById("login_button") as HTMLAnchorElement
const dd_reg = document.getElementById("reg_button") as HTMLAnchorElement
const dd_resetpw = document.getElementById("resetpw_button") as HTMLAnchorElement
const dd_subscriptions = document.getElementById("view_subs_button") as HTMLAnchorElement
const dd_nsfw = document.getElementById("filter_nsfw_div") as HTMLDivElement

function modifyHeader(loggedin:Boolean, name:string) {
    if (loggedin) {
        dd_username.innerText = name
        dd_login.style.display = 'none'
        dd_reg.style.display = 'none'
        dd_resetpw.style.display = 'none'
        dd_logout.style.display = 'block'
        dd_profile.style.display = 'block'
        dd_nsfw.style.display = 'block'
        dd_subscriptions.style.display = 'block'
    } else {
        dd_username.innerText = 'Login / Join'
        dd_login.style.display = 'block'
        dd_reg.style.display = 'block'
        dd_subscriptions.style.display = 'none'
        dd_logout.style.display = 'none'
        dd_profile.style.display = 'none'
        dd_nsfw.style.display = 'none'
    }
}

