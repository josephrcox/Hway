import { startLoaders, stopLoaders } from "../main.js"
import { isUserLoggedIn } from "./auth.js"

export let subscribedTopics:Array<string> = []
export let subscribedUsers:Array<string> = []
const subscribe_input = document.getElementById('subscribe_topic_input') as HTMLInputElement
const subscribe_submit = document.getElementById("subscribe_topic_submit") as HTMLButtonElement

export async function apiGetSubscriptions(x:string) {
    subscribedTopics = []
    subscribedUsers = []
    const response = await fetch('/api/get/user/'+x+"/subscriptions")
    const data = await response.json()

    for (let i=0;i<data.topics.length;i++) {
        if (!subscribedTopics.includes(data.topics[i][0].toLowerCase())) {
            subscribedTopics.push(data.topics[i][0].toLowerCase())
        }
        
    }
    for (let i=0;i<data.users.length;i++) {
        if (!subscribedUsers.includes(data.users[i][0].toLowerCase())) {
            subscribedUsers.push(data.users[i][0].toLowerCase())
        }
    }
    if (window.location.href.includes('/subscriptions')) {
        showSubscriptions()
    }
}

export function isSubscribed(x:string) {
    if (subscribedTopics.indexOf(x) > -1 || subscribedUsers.indexOf(x) > -1) {
        return true
    } else {
        return false
    }

}

export const subscribeTo = async(x:string, type:string) => { // x is the topic or user, type is 'topic' or 'user'
    if (!isUserLoggedIn) {
        window.location.href = '/login/'
    } else {
        const settings = {
            method: 'PUT',
        };
        var fetchResponse:any
        if (!isSubscribed(x)) {
            if (type == "topic") {
                fetchResponse =  await fetch('/api/put/subscribe/'+x, settings);
            } else if (type == "user"){
                fetchResponse = await fetch('/api/put/subscribe_user/'+x, settings);
            }
        } else {
            if (type == "topic") {
                fetchResponse =  await fetch('/api/put/unsubscribe/'+x, settings);
            } else if (type == "user"){
                fetchResponse = await fetch('/api/put/unsubscribe_user/'+x, settings);
            }
        }
    
        const data = await fetchResponse.json()
        if (data.status = 'ok') {
            await apiGetSubscriptions(localStorage.getItem('currentUsername')+"")
            subscriptionToggle()
        }
    }
    
}

function subscriptionToggle() {
    let elems = document.getElementsByClassName('post-subscription-button')

    for (let i=0;i<elems.length;i++) {
        let e = elems[i] as HTMLImageElement
        if (isSubscribed(e.dataset.topic + "")) {
            e.src = "/dist/images/square-minus-solid.svg"
            e.classList.add('filter_purple')
            e.classList.remove('filter_green')
        } else {
            e.src = "/dist/images/square-plus-solid.svg"
            e.classList.add('filter_green')
            e.classList.remove('filter_purple')
        }
    }

}

function showSubscriptions() {
    (document.getElementById("subscriptions_page_container") as HTMLDivElement).innerHTML = ""
    startLoaders()
    //console.log(subscribedTopics, subscribedUsers)
    for (let i=0;i<subscribedTopics.length;i++) {
        let t = Object.create(topicObject)
        t.name = subscribedTopics[i]
        t.isUser = false
        t.display()
    }
    for (let i=0;i<subscribedUsers.length;i++) {
        let t = Object.create(topicObject)
        t.name = subscribedUsers[i]
        t.isUser = true
        t.display()
    }
    stopLoaders()
    
}


const topicObject = {
    name: "",
    isUser:false,

    display() {
        var topicContainer = document.createElement("div")
        topicContainer.setAttribute("id","topicContainer_"+this.name)
        topicContainer.setAttribute("class","topicContainer postContainer")
        topicContainer.classList.add('animated_entry')

        var topicFrame = document.createElement("div")
        topicFrame.setAttribute("id", "topicFrame_"+this.name)
        topicFrame.setAttribute("class", "topicFrame postFrame")

        let href = ""
        if (!this.isUser) {
            href= '/h/'+topicFrame.id.split('_')[1]
        } else if (this.isUser){
            href = '/user/'+topicFrame.id.split('_')[1].split(" ")[0]
        }
        
        topicFrame.innerHTML = "<a href='"+href+"'>"+this.name+"</a>"

        let unsub = document.createElement('img')
        unsub.src = "/dist/images/square-minus-solid.svg"
        unsub.classList.add('filter_purple')
        unsub.classList.remove('filter_green')
        unsub.classList.add('post-subscription-button')
        unsub.dataset.topic = this.name
        unsub.onclick = async function() {

            await subscribeTo(unsub.dataset.topic+"", "topic")
            topicContainer.classList.add('animated_exit')
        }

        topicFrame.append(unsub)
        topicContainer.append(topicFrame);
    
        (document.getElementById("subscriptions_page_container") as HTMLDivElement).append(topicContainer)

        
    }
}

export function subscribe_init() {

    subscribe_submit.addEventListener('click', function() {
        if (subscribe_input.value.length > 0) {
            
            subscribeTo(subscribe_input.value.toLowerCase(), 'topic')
        }
        
        apiGetSubscriptions(localStorage.getItem('currentUsername')+"")
    })
}
