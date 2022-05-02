let subscribedTopics:Array<string> = []
let subscribedUsers:Array<string> = []

export async function apiGetSubscriptions(x:string) {
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

export const subscribeTo = async(x:string, type:string) => { // x is the topic or user, type is 'topic' or 'user'
    const settings = {
        method: 'PUT',
    };
    var fetchResponse:any
    if (type == "topic") {
        fetchResponse = await fetch('/api/put/subscribe/'+x, settings); 
    } else if (type == "user"){
        fetchResponse = await fetch('/api/put/subscribe_user/'+x, settings); 
    }
    
    const data = await fetchResponse.json()
    if (fetchResponse.status != 200) {
        alert(fetchResponse.status)
    }
    if (window.location.href.indexOf('/subscriptions') != -1) {
        var top = Object.create(topicObject);
        top.name = x;
        if (type == "user") {
            top.name += " (user)"
        }
        
        top.display();
    }
}