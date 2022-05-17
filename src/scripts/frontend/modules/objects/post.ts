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

        var body = document.createElement('p') as HTMLParagraphElement
        body.classList.add('post-body')
        body.innerText = this.body
        body.style.display = "none"

        var title = document.createElement('h3') as HTMLSpanElement
        title.classList.add('post-title')
        title.dataset.title = this.title
        title.dataset.link = this.link

        if (this.post_type == 1 && this.body.length > 0) {
            title.innerHTML = this.title + " <span style='font-size:8px'> [+]</span>"
            title.onclick = function() {
                if (body.style.display == "none") {
                    body.style.display = "block"
                    title.innerHTML = title.dataset.title + " <span style='font-size:8px'> [-]</span>"
                } else {
                    body.style.display = "none"
                    title.innerHTML = title.dataset.title + " <span style='font-size:8px'> [+]</span>"
                }
            }
        } else if (this.post_type == 2) {
            title.innerHTML = this.title + " <span style='font-size:8px'> [🔗]</span>"
            title.onclick = function() {
                window.open(title.dataset.link)
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
        }



        var subtitle = document.createElement('span') as HTMLSpanElement
        subtitle.classList.add('post-subtitle')
        if (this.nsfw) {
            subtitle.innerHTML = "<span class='nsfw_post_label'>NSFW</span>"
        } 
        subtitle.innerHTML += "<span>"+this.poster_name + "</span> — " + this.createdAt + " — <a href='/h/"+this.topic+"'>" + this.topic + "</a>"

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
            containerE.innerHTML = "<span>The post was permanantly deleted.</span>"
            containerSub.innerHTML = ""
        } else if (data.status == 'error') {
            alert(data.error)
        }
    } else {
        localStorage.setItem("deletepostconfirmid", id)
        deleteSpan.innerText = "Are you sure?"
    }

}

