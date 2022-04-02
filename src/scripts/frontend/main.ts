import { postObject } from "./modules/objects/post.js";
import { apiGetPostsByTopic, apiGetPostByID } from "./modules/postLoader.js";
import { getPageType } from "./modules/pageAnalyzer.js"
import { commentObject } from "./modules/objects/comment.js";
import { newPost } from "./modules/createPost.js"

window.onload = function() {
    localStorage.setItem("deletepostconfirmid","")
    let x:Array<string> = getPageType() || []

    switch(x[0]) {
        case "all":
            getPostsByTopic("all")
            break;
        case "topic":
            getPostsByTopic(x[1])
            break;
        case "post":
            getPostByID(x[1])
            break;
        case "createnewpost":
            const submit_new_post = document.getElementById("newPost_submit_button") as HTMLButtonElement
            submit_new_post.onclick = function() {
                newPost()
            }
            break;
        
    }
}

async function getPostsByTopic(topic:string) {
    var posts = await apiGetPostsByTopic(topic)
    console.log(posts)
    loadPostOrPostObjects(posts)
}

async function getPostByID(ID:string) {
    var post = []
    post[0] = await apiGetPostByID(ID)
    console.log(post)
    
    loadPostOrPostObjects(post)
    
    for (let i=0;i<post[0].comments.length;i++) {
        var c = Object.create(commentObject)
        c.body = post[0].comments[i].body
        c.poster_name = post[0].comments[i].poster
        var d = new Date(post[0].comments[i].createdAt)
        c.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString()
        c.id = post[0].comments[i]._id
        c.total_votes = post[0].comments[i].total_votes
        c.currentUserUpvoted = post[0].comments[i].current_user_upvoted
        c.currentUserAdmin = post[0].comments[i].current_user_admin
        c.display()
    }
}

function loadPostOrPostObjects(posts:any) {
    for (let i=0;i<posts.length;i++) {
        var post = Object.create(postObject)
        post.title = posts[i].title
        post.body = posts[i].body
        post.poster_name = posts[i].poster
        var d = new Date(posts[i].createdAt)
        post.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString()
        post.id = posts[i]._id
        post.currentUserUpvoted = posts[i].current_user_upvoted
        post.currentUserDownvoted = posts[i].current_user_downvoted
        post.currentUserAdmin = posts[i].current_user_admin
        post.totalVotes = posts[i].total_votes
        post.commentCount = 0 + posts[i].comments.length
        post.topic = posts[i].topic
        post.display()
    }
}

