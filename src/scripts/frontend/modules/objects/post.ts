export const postObject = {
    title:"",
    poster_name:"",
    createdAt:"",
    id:"",

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

        var voteUpButton = document.createElement('img')
        var voteDownButton = document.createElement('img')
        voteUpButton.src = "/dist/images/angle-up-solid.svg"
        voteDownButton.src = "/dist/images/angle-down-solid.svg"
        voteUpButton.classList.add('post-vote-button')
        voteDownButton.classList.add('post-vote-button')

        postDetailsContainer.append(title, subtitle)
        voteContainer.append(voteUpButton, voteDownButton)
        container.append(postDetailsContainer, voteContainer)

        document.body.appendChild(container)
    }
}