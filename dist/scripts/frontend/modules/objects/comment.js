import { supportEmail } from "./post.js";
export var commentObject = {
    body: "",
    poster_name: "",
    createdAt: "",
    id: "",
    totalVotes: 0,
    currentUserUpvoted: false,
    currentUserDownvoted: false,
    currentUserAdmin: false,
    display: function () {
        var container = document.createElement('div');
        container.classList.add('comment-container');
        container.dataset.postid = this.id;
        var comDetailsContainer = document.createElement('div');
        comDetailsContainer.classList.add('comment-details-container');
        var title = document.createElement('span');
        title.classList.add('comment-title');
        title.innerText = this.body;
        var subtitle = document.createElement('span');
        subtitle.classList.add('comment-subtitle');
        subtitle.innerHTML = "@" + this.poster_name + " — " + this.createdAt;
        var voteContainer = document.createElement('div');
        voteContainer.classList.add('comment-vote-container');
        var voteCountContainer = document.createElement('div');
        voteCountContainer.classList.add('comment-vote-count-container');
        var voteCount = document.createElement('span');
        voteCount.classList.add('comment-vote-count');
        voteCount.innerText = "" + this.totalVotes;
        var voteUpButton = document.createElement('img');
        voteUpButton.src = "/dist/images/angle-up-solid.svg";
        voteUpButton.classList.add('comment-vote-button');
        if (this.currentUserUpvoted) {
            voteUpButton.classList.add('upvoted');
        }
        // voteUpButton.onclick = function() {
        //     vote(1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        // }
        // voteDownButton.onclick = function() {
        //     vote(-1, container.dataset.postid+"", voteCount, voteUpButton, voteDownButton)
        // }
        var subPostDetails = document.createElement('div');
        subPostDetails.classList.add('post-subpost-details-container');
        var reportButton = document.createElement('a');
        reportButton.classList.add('post-subcomment-element');
        reportButton.innerText = "report";
        reportButton.onclick = function () {
            window.open("mailto:" + supportEmail + "?Subject=" + encodeURIComponent("Report a post on HWay") + "&body=" + encodeURIComponent("Post ID:" + container.dataset.postid));
        };
        subPostDetails.appendChild(reportButton);
        // if (this.currentUserAdmin) {
        //     let d = document.createElement('a')
        //     d.classList.add('post-subpost-element')
        //     d.innerText = "delete"
        //     d.onclick = function() {
        //         deletePost(container.dataset.postid+"", container, subPostDetails, this)
        //     }
        //     subPostDetails.appendChild(d)
        // }
        comDetailsContainer.append(title, subtitle);
        voteContainer.append(voteUpButton);
        voteCountContainer.append(voteCount);
        container.append(comDetailsContainer, voteCountContainer, voteContainer);
        document.body.appendChild(container);
        document.body.appendChild(subPostDetails);
    }
};
//# sourceMappingURL=comment.js.map