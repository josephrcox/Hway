const supportEmail = "josephrobertcox@gmail.com"

export const postObject = {
    title:"",
    poster_name:"",
    createdAt:"",
    id:"",
    totalVotes:0,
    commentCount:0,
    topic:"",

    currentUserUpvoted:false,
    currentUserDownvoted:false,
    currentUserAdmin:false,

    display() {
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('post-container')
        container.dataset.postid = this.id

        var postDetailsContainer = document.createElement('div') as HTMLDivElement
        postDetailsContainer.classList.add('post-details-container')

        var title = document.createElement('span') as HTMLSpanElement
        title.classList.add('post-title')
        title.innerText = this.title
        title.onclick = function() {
            window.location.href = '/p/'+container.dataset.postid
        }

        var subtitle = document.createElement('span') as HTMLSpanElement
        subtitle.classList.add('post-subtitle')
        subtitle.innerHTML = "@"+this.poster_name + " — " + this.createdAt + " — <a href='/h/"+this.topic+"'>" + this.topic + "</a>"

        var voteContainer = document.createElement('div')
        voteContainer.classList.add('post-vote-container')

        var voteCountContainer = document.createElement('div')
        voteCountContainer.classList.add('post-vote-count-container')

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
        reportButton.innerText = "report post"
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

        postDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteDownButton)
        voteCountContainer.append(voteCount)
        container.append(postDetailsContainer, voteCountContainer, voteContainer)

        document.body.appendChild(container)
        document.body.appendChild(subPostDetails)
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
    } 

    if (data.error) {
        if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
            window.location.href = '/login'
        }
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

