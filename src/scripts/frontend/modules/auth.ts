export let isUserLoggedIn = false
export let currentUsername = null
export let currentUserID = null
export let currentUserSubscriptions = []

import { apiGetNotificationCount } from "../modules/notifications.js";
import { apiGetSubscriptions } from "./subscriptions.js";

export const getUser = async () => {
    const response = await fetch('/api/get/currentuser/')
    const data = await response.json()
    
    try {
        if (data.code == 400) { // Error code for 'no user logged in' or 'invalid JWT token'
            isUserLoggedIn = false;
            currentUsername = null
            localStorage.clear()
        } else {
            apiGetNotificationCount()
            currentUserID = data.id
            currentUsername = data.name
            isUserLoggedIn = true
            localStorage.setItem("currentUsername", currentUsername!)
            
            const response = await fetch('/api/get/user/'+data.name+'/show_nsfw');
            const data2 = await response.json();
            let filter_nsfw = document.getElementById('filter_nsfw') as HTMLInputElement;
            if (data2.show_nsfw == true) {
                filter_nsfw.checked = true;
            }
            else {
                filter_nsfw.checked = false;
            }
            await apiGetSubscriptions(currentUsername+"")
            
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
        dd_username.innerText = 'Login / Register'
        dd_login.style.display = 'block'
        dd_reg.style.display = 'block'
        dd_subscriptions.style.display = 'none'
        dd_logout.style.display = 'none'
        dd_profile.style.display = 'none'
        dd_nsfw.style.display = 'none'
    }
}

