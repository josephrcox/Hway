let subscribedTopics:Array<string> = []
let subscribedUsers:Array<string> = []

export async function apiGetSubscriptions(x:string) {
    subscribedTopics = []
    subscribedUsers = []
    const response = await fetch('/api/get/user/'+x+"/subscriptions")
    const data = await response.json()

    console.log(data)
    for (let i=0;i<data.topics.length;i++) {
        subscribedTopics.push(data.topics[i][0].toLowerCase())
    }
    for (let i=0;i<data.users.length;i++) {
        subscribedUsers.push(data.users[i][0].toLowerCase())
    }
}

export function isSubscribed(x:string) {
    if (subscribedTopics.indexOf(x) > -1 || subscribedUsers.indexOf(x) > -1) {
        return true
    } else {
        return false
    }

}

export const subscribeTo = async(x:string, type:string, elemID:string) => { // x is the topic or user, type is 'topic' or 'user'
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