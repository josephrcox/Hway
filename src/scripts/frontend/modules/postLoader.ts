export async function apiGetPostsByTopic(topic:string) {
    const response = await fetch('/api/get/'+topic+'/q?sort=hot&t=all&page=1')
    const data = await response.json()

    return data.data
}

export async function apiGetPostByID(ID:string) {
    const response = await fetch('/api/get/post/'+ID)
    const data = await response.json()

    return data
}