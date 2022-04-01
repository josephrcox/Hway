import { postObject } from "./modules/objects/post.js";
import { apiGetPostsByTopic, apiGetPostByID } from "./modules/postLoader.js";
import { getPageType } from "./modules/pageAnalyzer.js"
import { commentObject } from "./modules/objects/comment.js";


window.onload = function() {
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
        
    }
}



async function getPostsByTopic(topic:string) {
    var posts = await apiGetPostsByTopic(topic)
    console.log(posts)
    for (let i=0;i<posts.length;i++) {
        var post = Object.create(postObject)
        post.title = posts[i].title
        post.display()
    }
}

async function getPostByID(ID:string) {
    var post = await apiGetPostByID(ID)
    console.log(post)
    var p = Object.create(postObject)
    p.title = post.title
    p.display()
    
    for (let i=0;i<post.comments.length;i++) {
        var c = Object.create(commentObject)
        c.body = post.comments[i].body
        c.display()
    }
}