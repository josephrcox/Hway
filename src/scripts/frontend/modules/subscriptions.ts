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
    console.log(subscribedTopics.indexOf(x) +" <<<"+x)
    

    if (subscribedTopics.indexOf(x) > -1 || subscribedUsers.indexOf(x) > -1) {

        return true
    } else {
        return false
    }

}