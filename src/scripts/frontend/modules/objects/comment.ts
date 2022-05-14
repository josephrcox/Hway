import { supportEmail } from "./post.js"
import { newNestedComment } from "../createComment.js"

const postsArray = document.getElementById('postsArray') as HTMLDivElement
export const commentSection = document.getElementById('comments') as HTMLDivElement

export const commentObject = {
    body:"",
    poster_name:"",
    createdAt:"",
    id:"",
    parentid:"",
    posterID:"",
    nested_comments:[],
    totalVotes:undefined,
    is_nested:false,
    nested_comment_parent_id:"",

    currentUserUpvoted:false,
    currentUserDownvoted:false,
    currentUserAdmin:false,

    display() {
        var house = document.createElement('div') as HTMLDivElement
        house.classList.add('comment-house')
        house.classList.add('animated_entry')
        house.dataset.id = this.id
        house.classList.add('nested_under_'+this.nested_comment_parent_id)
        house.style.display = 'block'

        var expand:any = ""
        if (this.nested_comments.length > 0) {
            expand = document.createElement('span')
            expand.innerText = '-'
            expand.classList.add('post-expand')
            expand.dataset.id = this.id
            expand.classList.add('expanded')
            expand.onclick = function() {
                let elems = document.getElementsByClassName('nested_under_'+expand.dataset.id)
                for (let i=0;i<elems.length;i++) {
                    let e = elems[i] as HTMLDivElement
                    if (e.style.display == 'none') {
                        e.style.display = 'block'
                        expand.classList.add('expanded')
                        expand.innerText = '-'
                    } else {
                        e.style.display = 'none'
                        expand.classList.remove('expanded')
                        expand.innerText = '+'
                    }

                }
            }

        }
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('comment-container')
        container.dataset.id = this.id
        container.dataset.postid = this.parentid
        container.dataset.nested = this.is_nested + ""
        container.classList.add('post-comment-nested')


        var comDetailsContainer = document.createElement('div') as HTMLDivElement
        comDetailsContainer.classList.add('comment-details-container')
        
        if (this.is_nested) {
            comDetailsContainer.classList.add('nested')
        }

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
        voteUpButton.dataset.is_nested = this.is_nested + ""

        voteUpButton.onclick = function() {
            voteComment(container.dataset.id, voteUpButton.dataset.parentID, voteUpButton.dataset.is_nested + "", "", voteCount, voteUpButton)
        }


        var replyContainer = document.createElement('div')
        replyContainer.classList.add('post-comment-reply-container')
        replyContainer.style.display = 'none'
        replyContainer.style.flexDirection = 'column'
        replyContainer.dataset.open = 'false'

        var replyInput = document.createElement('textarea')
        replyInput.classList.add('post-comment-reply-input')
        replyInput.rows = 2
        replyInput.cols = 50
        replyInput.classList.add('general_input')

        var replySubmit = document.createElement('div')
        replySubmit.classList.add('button_submit')
        replySubmit.classList.add('post-comment-reply-submit')
        replySubmit.innerText = "Reply"
        replySubmit.dataset.postID = this.parentid
        replySubmit.dataset.id = this.id
        replySubmit.onclick = function() {
            console.log(replyInput)
            newNestedComment(replySubmit.dataset.postID + "", replySubmit.dataset.id + "", replyInput )
        }

        if (!this.is_nested) {
            replyContainer.append(replyInput, replySubmit)
            var replyOpen = document.createElement('a')
            replyOpen.innerText = 'reply'
            replyOpen.classList.add('post-subcomment-element')
            replyOpen.onclick = function() {
                if (replyContainer.dataset.open == 'false') {
                    replyContainer.style.display = 'flex'
                    replyContainer.dataset.open = 'true'
                } else {
                    replyContainer.style.display = 'none'
                    replyContainer.dataset.open = 'false'
                }
            }
        }
        

        var subPostDetails = document.createElement('div')
        subPostDetails.classList.add('post-subpost-details-container')
        var reportButton = document.createElement('a')
        reportButton.classList.add('post-subcomment-element')
        reportButton.innerText = "report"
        reportButton.onclick = function() {
            window.open("mailto:"+supportEmail+"?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:"+container.dataset.postid));
        }
        if (!this.is_nested) {
            subPostDetails.append(replyOpen!)
        }
        subPostDetails.append(reportButton)

        if (this.currentUserAdmin) {
            let d = document.createElement('a')
            d.classList.add('post-subpost-element')
            d.innerText = "delete"
            d.dataset.commentID = this.id
            d.dataset.nested_comment_parent_id = this.nested_comment_parent_id
            if (this.nested_comments.length > 0) {
                d.dataset.nested = "true"
            } else {
                d.dataset.nested = "false"
            }
            d.onclick = function() {
                deleteComment(container.dataset.postid!, container.dataset.id!, house, d, d.dataset.nested+"", d.dataset.commentID, d.dataset.nested_comment_parent_id+"")
            }
            subPostDetails.appendChild(d)
        }

        comDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteCount)
        container.append(expand, comDetailsContainer, voteContainer)
        house.append(container, subPostDetails, replyContainer)

        commentSection.appendChild(house)
        // commentSection.appendChild(subPostDetails)
        // commentSection.appendChild(replyContainer)
    }
}

const voteComment = async (id:any, parentID:any, nested:string, commentParentID:string, voteCountElement:HTMLSpanElement, voteUpImg:HTMLImageElement) => { 
   
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
    }
}

const deleteComment = async(parentID:string, commentID:string, containerElement:HTMLDivElement, deleteSpan:HTMLAnchorElement, nested:string, nestedID:any, nested_comment_parent_id:string) => {
    if (localStorage.getItem("deletecommentconfirmid") == commentID) {
        const settings = {
            method: 'PUT',
        };
        var response, data
        if (nested == "true") {
            response = await fetch('/api/put/comment/delete/'+parentID+"/"+commentID, settings)
            data = await response.json()
        } else {
            response = await fetch('/api/put/comment_nested/delete/'+parentID+"/"+nested_comment_parent_id+"/"+nestedID, settings)
            data = await response.json()
        }
        
        
    
        if (data.status == 'ok') {
            containerElement.innerHTML = ""
            if (nested == "false") {
                let elems = document.getElementsByClassName('nested_under_'+commentID)
                for (let i=0;i<elems.length;i++) {
                    let e = elems[i] as HTMLDivElement
                    e.style.display = 'none'
    
                }
            }

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