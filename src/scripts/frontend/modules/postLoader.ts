import { loadPostOrPostObjects } from "../main.js"

export async function apiGetPostsByTopic(topic:string, search:string, nsfw:boolean) {
    const response = await fetch('/api/get/'+topic+'/q'+search+"&nsfw="+nsfw)
    const data = await response.json()
    localStorage.setItem("total_pages", data.total_pages)

    
    return data.data
}

export async function apiGetPostByID(ID:string) {
    const response = await fetch('/api/get/post/'+ID)
    const data = await response.json()

    return data
}

export async function apiGetPostsBySearchQuery(query:string, topic:string) {
    window.history.replaceState("Search", "Search HWay", '/search/?query='+query+"&topic="+topic )
    const response = await fetch('/api/get/search/q?query='+query+"&topic="+topic)
    const data = await response.json()
    console.log(data)

    loadPostOrPostObjects(data.data)
}


