export const postObject = {
    title:"",
    poster_name:"",
    createdAt:"",
    id:"",
    totalVotes:0,

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
        subtitle.innerText = "@"+this.poster_name + " — " + this.createdAt

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

        postDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteDownButton)
        voteCountContainer.append(voteCount)
        container.append(postDetailsContainer, voteCountContainer, voteContainer)

        document.body.appendChild(container)
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