import { postObject } from "./modules/objects/post.js";
import { apiGetPostsByTopic, apiGetPostByID } from "./modules/postLoader.js";
import { getPageType } from "./modules/pageAnalyzer.js"
import { commentObject, newCommentInputArea, commentSection } from "./modules/objects/comment.js";
import { newComment } from "./modules/createComment.js";
import { getUser, currentUserID, isUserLoggedIn } from "./modules/auth.js"

window.onload = async function() {
    localStorage.setItem("deletepostconfirmid","")
    localStorage.setItem("deletecommentconfirmid","")
    let x:Array<string> = getPageType() || []
    await getUser()

    switch(x[0]) {
        case "all":
            await getPostsByTopic("all")
            subheader.style.display = 'block'
            break;
        case "topic":
            await getPostsByTopic(x[1])
            subheader.style.display = 'block'
            break;
        case "post":
            await getPostByID(x[1])
            
            subheader.style.display = 'none'
            const submit_new_comment = document.getElementById("newCom_submit") as HTMLButtonElement
            submit_new_comment.onclick = function() {
                newComment(x[1])
            }
            break;
        case "createnewpost":
            
            break;
        
    }
}

async function getPostsByTopic(topic:string) {
    var posts = await apiGetPostsByTopic(topic)
    
    loadPostOrPostObjects(posts)
    
}

const new_comment_login = document.getElementById("commentSection_login_button") as HTMLAnchorElement
const new_comment_textarea = document.getElementById("newCom_body") as HTMLTextAreaElement
const new_comment_submit = document.getElementById("newCom_submit") as HTMLInputElement
const subheader = document.getElementById("sub_header_options") as HTMLDivElement
const loaders = document.getElementsByClassName("loader")

async function getPostByID(ID:string) {
    var post = []
    post[0] = await apiGetPostByID(ID)
    console.log(post)
    
    loadPostOrPostObjects(post)

    if (isUserLoggedIn) {
        new_comment_login.style.display = 'none'
        new_comment_textarea.style.display = 'flex'
        new_comment_submit.style.display = 'flex'
    }  else {
        new_comment_login.style.display = 'block'
        new_comment_textarea.style.display = 'none'
        new_comment_submit.style.display = 'none'
    }
    
    //sorts comments by most votes to least votes
    post[0].comments.sort((a:any, b:any) => (a.total_votes < b.total_votes) ? 1 : -1)
    //

    for (let i=0;i<post[0].comments.length;i++) {
        var c = Object.create(commentObject)
        c.body = post[0].comments[i].body
        c.poster_name = post[0].comments[i].poster
        var d = new Date(post[0].comments[i].createdAt)
        c.createdAt = d.toLocaleDateString() + " at " + d.toLocaleTimeString()
        c.id = post[0].comments[i]._id
        c.totalVotes = post[0].comments[i].total_votes
        if (post[0].comments[i].users_voted.includes(currentUserID)) {
            c.currentUserUpvoted = true
        } else {
            c.currentUserUpvoted = false
        }
        c.currentUserAdmin = post[0].comments[i].current_user_admin
        c.parentid = post[0]._id
        c.display()
    }
    stopLoaders()

    newCommentInputArea.style.display = 'flex'
    commentSection!.style.display = 'flex'

    

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
        post.post_type = posts[i].type
        post.link = posts[i].link
        
        post.display()
    }
    stopLoaders()
    
    
}

function stopLoaders() {
    for (let i=0;i<loaders.length;i++) {
        let l = loaders[i] as HTMLDivElement
        l.style.display = 'none'
    }
}