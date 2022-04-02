import { supportEmail } from "./post.js"

export const commentObject = {
    body:"",
    poster_name:"",
    createdAt:"",
    id:"",
    totalVotes:0,

    currentUserUpvoted:false,
    currentUserDownvoted:false,
    currentUserAdmin:false,

    display() {
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('comment-container')
        container.dataset.postid = this.id

        var comDetailsContainer = document.createElement('div') as HTMLDivElement
        comDetailsContainer.classList.add('comment-details-container')

        var title = document.createElement('span') as HTMLSpanElement
        title.classList.add('comment-title')
        title.innerText = this.body

        var subtitle = document.createElement('span') as HTMLSpanElement
        subtitle.classList.add('comment-subtitle')
        subtitle.innerHTML = "@"+this.poster_name + " — " + this.createdAt

        var voteContainer = document.createElement('div')
        voteContainer.classList.add('comment-vote-container')

        var voteCountContainer = document.createElement('div')
        voteCountContainer.classList.add('comment-vote-count-container')

        var voteCount = document.createElement('span') as HTMLSpanElement
        voteCount.classList.add('comment-vote-count')
        voteCount.innerText = ""+this.totalVotes

        var voteUpButton = document.createElement('img')
        var voteDownButton = document.createElement('img')
        voteUpButton.src = "/dist/images/angle-up-solid.svg"
        voteDownButton.src = "/dist/images/angle-down-solid.svg"
        voteUpButton.classList.add('comment-vote-button')
        voteDownButton.classList.add('comment-vote-button')

        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted')
        } else if (this.currentUserDownvoted) {
            voteDownButton.classList.add('downvoted')
        }

        // voteUpButton.onclick = function() {
        //     vote(1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        // }
        // voteDownButton.onclick = function() {
        //     vote(-1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        // }

        var subPostDetails = document.createElement('div')
        var reportButton = document.createElement('a')
        reportButton.classList.add('post-subcomment-element')
        reportButton.innerText = "report post"
        reportButton.onclick = function() {
            window.open("mailto:"+supportEmail+"?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:"+container.dataset.postid));
        }
        subPostDetails.appendChild(reportButton)

        // if (this.currentUserAdmin) {
        //     let d = document.createElement('a')
        //     d.classList.add('post-subpost-element')
        //     d.innerText = "delete"
        //     d.onclick = function() {
        //         deletePost(container.dataset.postid+"", container, subPostDetails, this)
        //     }
        //     subPostDetails.appendChild(d)
        // }

        comDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteDownButton)
        voteCountContainer.append(voteCount)
        container.append(comDetailsContainer, voteCountContainer, voteContainer)

        document.body.appendChild(container)
        document.body.appendChild(subPostDetails)
    }
}