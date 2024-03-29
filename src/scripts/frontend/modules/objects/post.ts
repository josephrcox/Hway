import { timeStamp } from "console"
import { loadMain } from "../../main.js"
import { isUserLoggedIn } from "../auth.js"
import { isSubscribed, subscribeTo } from "../subscriptions.js"

export const supportEmail = "josephrobertcox@gmail.com"

export const postsArray = document.getElementById('postsArray') as HTMLDivElement

export const postObject = {
    title:"",
    body:"",
    link:"",
    post_type:0,
    poster_name:"",
    createdAt:"",
    id:"",
    totalVotes:0,
    commentCount:0,
    topic:"",
    nsfw:"",
    poll_options:[],
    poll_voted:-1,
    poll_total_votes:-1,

    currentUserUpvoted:false,
    currentUserDownvoted:false,
    currentUserAdmin:false,

    display() {
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('post-container')
        container.classList.add('menu_shadow')
        container.dataset.postid = this.id

        var postDetailsContainer = document.createElement('div') as HTMLDivElement
        postDetailsContainer.classList.add('post-details-container')

        let nm = localStorage.getItem('nm')
        if (nm == "true") {
            postDetailsContainer.classList.add('element-nm')
        }

        var body = document.createElement('p') as HTMLParagraphElement
        body.classList.add('post-body')
        if (nm == "true" && this.post_type != 4) {
            body.classList.add('element-nm')
        }
        body.innerText = this.body
        body.style.display = "none"
        if (this.post_type == 4) {
            body.dataset.poll = "true"
            body.style.color = "black"
        }

        if (this.post_type == 4) {
            let pollOps:any
            pollOps = this.poll_options
            //console.log(pollOps)
            body.innerHTML = ""
            let pollTotalVotes = 0

            for (let i=0;i<pollOps.length;i++) {
                let d = document.createElement('div')
                d.innerHTML = pollOps[i].title
                d.style.padding = '5px'
                d.style.border = '1px solid black'
                d.dataset.postid = this.id
                d.dataset.index = i+""

                d.onclick = function() {
                    if (isUserLoggedIn) {
                        voteOnPoll(d.dataset.postid+"", d.dataset.index+"", body)
                    } else {
                        window.location.href='/login/?ref=/p/'+d.dataset.postid
                    }
                }

                if (this.poll_voted != -1) {

                    d.innerHTML += "("+pollOps[i].votes+" votes)"
                    d.style.background = 'linear-gradient(to right, #9595ff '+(Math.floor((parseInt(pollOps[i].votes) / this.poll_total_votes) * 100))+'%, lightgray 0%)'
                    if (this.poll_voted == i) {
                        d.innerHTML += "✔️"
                    }

                }
            


                body.append(d)

            }

        }

        var title = document.createElement('h3') as HTMLSpanElement
        title.classList.add('post-title')
        title.dataset.title = this.title
        title.dataset.link = this.link

        if (this.post_type == 1 && this.body.length > 0) {
            let text_text = "<span style='color:red;'>TEXT</span>"
            title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'> [+] </span>"+this.title
            title.onclick = function() {
                if (body.style.display == "none") {
                    body.style.display = "block"
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>[-] </span>"+title.dataset.title
                } else {
                    body.style.display = "none"
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>[+] </span>"+title.dataset.title
                }
            }
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block'
            }
        } else if (this.post_type == 2) {
            title.innerHTML = "<span style='font-size:10px;padding-right:5px'>🔗 </span>"+title.dataset.title
            title.onclick = function() {
                window.open(title.dataset.link)
            }
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block'
            }
        } else if (this.post_type == 3) {
            title.innerHTML = "<img src='"+title.dataset.link+"' class='post-img-thumb' alt='Post thumbnail'> "+this.title
            title.onclick = function() {
                if (body.style.display == "none") {
                    body.style.display = "block"
                    body.innerHTML = "<img class='post-img' src='"+title.dataset.link+"' alt='Post media'>"
                } else {
                    body.style.display = "none"
                    body.innerHTML = ""
                }
                
            }
        } else if (this.post_type == 1) {
            title.innerText = this.title
            title.style.cursor = 'auto'
        } else if (this.post_type == 4) {
            let poll_text = "<span style='color:red;'>POLL</span> "
            title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>"+poll_text+" [+] </span>"+this.title
            title.onclick = function() {
                if (body.style.display == "none") {
                    body.style.display = "block"
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>"+poll_text+" [-] </span>"+title.dataset.title
                } else {
                    body.style.display = "none"
                    title.innerHTML = "<span style='font-size:10px;padding-right:5px;word-wrap:break-word;'>"+poll_text+" [+] </span>"+title.dataset.title
                }
            }
            if (window.location.pathname.includes('/p/')) {
                body.style.display = 'block'
            }
        }



        var subtitle = document.createElement('span') as HTMLSpanElement
        subtitle.classList.add('post-subtitle')
        if (this.nsfw) {
            subtitle.innerHTML = "<span class='nsfw_post_label'>NSFW</span>"
        } 
        var subscriptionButton = document.createElement('img')
        subscriptionButton.dataset.topic = this.topic.toLowerCase()
        subscriptionButton.setAttribute('id','post-subscribe-button_'+this.id)
        if (isSubscribed(this.topic.toLowerCase())) {
            subscriptionButton.src = "/dist/images/square-minus-solid.svg"
            subscriptionButton.classList.add('filter_purple')
        } else {
            subscriptionButton.src = "/dist/images/square-plus-solid.svg"
            subscriptionButton.classList.add('filter_green')
        }
        subscriptionButton.onclick = function() {
            subscribeTo(subscriptionButton.dataset.topic+"", "topic")
        }
        subscriptionButton.classList.add('post-subscription-button')
        subtitle.append(subscriptionButton)
        subtitle.innerHTML += "<span><a href='/h/"+this.topic+"'>" + this.topic + "</a> ∙ "+this.createdAt + "  ∙  "+"<a href='/user/"+this.poster_name+"'>" + this.poster_name + "</a> </span> "

        var voteContainer = document.createElement('div')
        voteContainer.classList.add('post-vote-container')

        var voteCount = document.createElement('span') as HTMLSpanElement
        voteCount.classList.add('post-vote-count')
        voteCount.innerText = ""+this.totalVotes

        var voteUpButton = document.createElement('img')
        var voteDownButton = document.createElement('img')
        voteUpButton.src = "/dist/images/angle-up-solid.svg"
        voteDownButton.src = "/dist/images/angle-down-solid.svg"
        voteUpButton.classList.add('post-vote-button')
        voteDownButton.classList.add('post-vote-button')

        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted')
        } else if (this.currentUserDownvoted) {
            voteDownButton.classList.add('downvoted')
        }

        voteUpButton.onclick = function() {
            vote(1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        }
        voteDownButton.onclick = function() {
            vote(-1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        }

        var subPostDetails = document.createElement('div')
        subPostDetails.classList.add("post-subpost-details-container")
        var viewComments = document.createElement('a')
        viewComments.classList.add('post-subpost-element')
        viewComments.innerText = "comments ("+this.commentCount+")"
        viewComments.onclick = function() {
            window.location.href = '/p/'+container.dataset.postid
        }
        subPostDetails.appendChild(viewComments)
        
        var shareButton = document.createElement('a')
        shareButton.classList.add('post-subpost-element')
        shareButton.innerText = "copy link"
        shareButton.onclick = function() {
            let link = window.location.origin + '/p/'+container.dataset.postid
            navigator.clipboard.writeText(link);
            shareButton.innerText = "copied"
            setTimeout(function(){ shareButton.innerText = "copy link" }, 3000);
        }
        subPostDetails.appendChild(shareButton)

        var reportButton = document.createElement('a')
        reportButton.classList.add('post-subpost-element')
        reportButton.innerText = "report"
        reportButton.onclick = function() {
            window.open("mailto:"+supportEmail+"?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:"+container.dataset.postid));
        }
        subPostDetails.appendChild(reportButton)

        if (this.currentUserAdmin) {
            let d = document.createElement('a')
            d.classList.add('post-subpost-element')
            d.innerText = "delete"
            d.onclick = function() {
                deletePost(container.dataset.postid+"", container, subPostDetails, this)
            }
            subPostDetails.appendChild(d)
        }

        container.classList.add('animated_entry')
        subPostDetails.classList.add('animated_entry')

        postDetailsContainer.append(title, body, subtitle)
        voteContainer.append(voteUpButton,voteCount,voteDownButton)
        container.append(postDetailsContainer, voteContainer)

        postsArray.appendChild(container)
        postsArray.appendChild(subPostDetails)
    }
}

var lastClick:number = 0; // These two are used to prevent vote-mashing of posts and comments by placing a delay of Xms
const delay:number = 400;

const vote = async (change:number, id:string, voteCountElement:HTMLSpanElement, up:HTMLImageElement, down:HTMLImageElement) => { 
    if (lastClick >= (Date.now() - delay)) {
        return;
    }
    lastClick = Date.now();

    const settings = {
        method: 'PUT',
    };

    const fetchResponse = await fetch('/vote/'+id+'/'+change, settings); 
    const data = await fetchResponse.json()

    if (data.status == 'ok') {
        voteCountElement.innerText = data.newtotal
        if (data.gif == "up") {
            up.classList.add('upvoted')
            down.classList.remove('downvoted')
        } else if (data.gif == "none") {
            up.classList.remove('upvoted')
            down.classList.remove('downvoted')
        } else if (data.gif == "down") {
            up.classList.remove('upvoted')
            down.classList.add('downvoted')
        }
    } else {
        window.location.href = '/login/?ref=/p/'+id
    }

}

const deletePost = async(id:string, containerE:HTMLDivElement, containerSub:HTMLDivElement, deleteSpan:any) => {
    if (localStorage.getItem("deletepostconfirmid") == id) {
        const settings = {
            method: 'PUT',
        };
        const response = await fetch('/api/put/post/delete/'+id, settings)
        const data = await response.json()
    
        if (data.status == 'ok') {
            setInterval(function() {
                containerE.innerHTML = ""
            }, 2000)
            containerE.innerHTML = "<span class='text_white'>The post was permanantly deleted.</span>"
            containerSub.innerHTML = ""
        } else if (data.status == 'error') {
            alert(data.error)
        }
    } else {
        localStorage.setItem("deletepostconfirmid", id)
        deleteSpan.innerText = "Are you sure?"
    }

}


async function voteOnPoll(postid:string, answer:string, postelem:any) {
    // answer is the index, so 0 is the first option
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/poll/'+postid+'/'+answer, settings)
    const data = await response.json()

    if (data.status == 'ok') {
        postelem.innerHTML = "<a href='/p/"+postid+"'>View results</a>"
        postelem.style.color = 'blue'

    } else {
        alert(data)
    }
}
