export const postObject = {
    title:"",
    display() {
        var container = document.createElement('div') as HTMLDivElement
        container.classList.add('post-container')

        var title = document.createElement('span') as HTMLSpanElement
        title.innerText = this.title

        var subtitle = document.createElement('span') as HTMLSpanElement
        subtitle.innerText = this.poster_name + " - " + this.

        container.appendChild(title)
        document.body.appendChild(container)
    }
}