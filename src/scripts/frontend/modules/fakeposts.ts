async function createFakePosts(count:number) {
    for (let i=0;i<count;i++) {
        const response = await fetch('/api/post/fakeposts') 
        const data = await response.json()
        //console.log(data)
    }

}