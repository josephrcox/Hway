import { commentObject } from "./objects/comment.js";



export const newComment = async (postid:string) => { 
    let body = (document.getElementById("newCom_body") as HTMLInputElement).value

    if (body != null && body != "") {
        let bodyJSON = {
            "id":postid,
            "body":body,
        }
    
        const fetchResponse = await fetch('/api/post/comment/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        }); 
        var data = await fetchResponse.json()

        var c = Object.create(commentObject)
        c.body = data.body
        c.poster_name = data.poster
        var d = new Date(data.createdAt)
        c.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString()
        c.id = data._id
        c.totalVotes = 0
        c.currentUserUpvoted = data.current_user_upvoted
        c.currentUserAdmin = true
        c.parentid = postid
        console.log(c)
        c.display()
    }
    
}