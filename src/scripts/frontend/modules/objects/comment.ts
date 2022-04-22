import { supportEmail } from "./post.js"

const postsArray = document.getElementById('postsArray') as HTMLDivElement
export const commentSection = document.getElementById('comments') as HTMLDivElement

export const commentObject = {
    body:"",
    poster_name:"",
    createdAt:"",
    id:"",
    parentid:"",
    totalVotes:undefined,

    currentUserUpvoted:false,
    currentUserDownvoted:false,
    currentUserAdmin:false,

    display() {
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('comment-container')
        container.dataset.id = this.id
        container.dataset.postid = this.parentid

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

        var voteCount = document.createElement('span') as HTMLSpanElement
        voteCount.classList.add('comment-vote-count')
        voteCount.innerText = ""+this.totalVotes

        var voteUpButton = document.createElement('img')
        voteUpButton.src = "/dist/images/angle-up-solid.svg"
        voteUpButton.classList.add('comment-vote-button')
        voteUpButton.dataset.parentID = this.parentid

        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted')
        }

        voteUpButton.onclick = function() {
            voteComment(container.dataset.id, voteUpButton.dataset.parentID, false, "", voteCount, voteUpButton)
        }

        var subPostDetails = document.createElement('div')
        subPostDetails.classList.add('post-subpost-details-container')
        var reportButton = document.createElement('a')
        reportButton.classList.add('post-subcomment-element')
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
                deleteComment(container.dataset.postid!, container.dataset.id!, container, d)
            }
            subPostDetails.appendChild(d)
        }

        comDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteCount)
        container.append(comDetailsContainer, voteContainer)

        commentSection.appendChild(container)
        commentSection.appendChild(subPostDetails)
    }
}

const voteComment = async (id:any, parentID:any, nested:boolean, commentParentID:string, voteCountElement:HTMLSpanElement, voteUpImg:HTMLImageElement) => { 
   
    if (commentParentID == null || commentParentID == "") {
        commentParentID = "0"
    }

    const settings = {
        method: 'PUT',
    };

    const fetchResponse = await fetch('/votecomment/'+parentID+'/'+id+'/'+nested+'/'+commentParentID, settings); 
    const data = await fetchResponse.json()

    if (data.status == 'ok') {
        voteCountElement.innerText = data.newcount
        if (data.voted == 'yes') {
            if (nested) {
                //(document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLSpanElement).innerHTML = fa_voteUp_filled
            } else {
                //(document.getElementById('voteComUp_'+id) as HTMLSpanElement).innerHTML = fa_voteUp_filled;
            }
            voteUpImg.classList.add('upvoted')

        } else {
            voteUpImg.classList.remove('upvoted')
        }
    //     if (data.voted == 'no') {
    //         if (nested) {
    //             (document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLImageElement).innerHTML = fa_voteUp;
    //             (document.getElementById('nestedcommentUp_'+id+'_'+commentParentID) as HTMLImageElement).style.color = 'black';
    //         } else {
    //             (document.getElementById('voteComUp_'+id) as HTMLImageElement).innerHTML = fa_voteUp;
                
    //         }
    //     }
    //     if (nested) {
    //         document.getElementById('comnestedVoteCount_'+id).innerHTML = data.newcount
    //     } else {
    //         document.getElementById('voteCount_'+id).innerHTML = data.newcount
    //     }
    // } else {
    //     if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
    //         window.location.href = '/login'
    //     }
    // }
    }
}

const deleteComment = async(parentID:string, commentID:string, containerElement:HTMLDivElement, deleteSpan:HTMLAnchorElement) => {
    if (localStorage.getItem("deletecommentconfirmid") == commentID) {
        const settings = {
            method: 'PUT',
        };
        const response = await fetch('/api/put/comment/delete/'+parentID+"/"+commentID, settings)
        const data = await response.json()
    
        if (data.status == 'ok') {
            containerElement.innerHTML = "This comment has been permanantly deleted"
        }
        if (data.status == 'error') {
            alert(data.error)
        }
    } else {
        localStorage.setItem("deletecommentconfirmid", commentID)
        deleteSpan.innerText = "Are you sure?"
    }

}

export const newCommentInputArea = document.getElementsByClassName('newComContainer')[0] as HTMLDivElement