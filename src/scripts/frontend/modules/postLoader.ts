export async function apiGetPostsByTopic(topic:string, search:string) {
    const response = await fetch('/api/get/'+topic+'/q'+search)
    const data = await response.json()
    localStorage.setItem("total_pages", data.total_pages)

    
    return data.data
}

export async function apiGetPostByID(ID:string) {
    const response = await fetch('/api/get/post/'+ID)
    const data = await response.json()

    return data
}