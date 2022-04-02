export async function apiGetPostsByTopic(topic:string) {
    let query:string = window.location.search
    const response = await fetch('/api/get/'+topic+'/q'+query)
    const data = await response.json()

    return data.data
}

export async function apiGetPostByID(ID:string) {
    const response = await fetch('/api/get/post/'+ID)
    const data = await response.json()

    return data
}