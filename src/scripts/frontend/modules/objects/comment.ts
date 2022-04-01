export const commentObject = {
    body:"",
    display() {
        var p = document.createElement('div') as HTMLDivElement
        p.innerText = this.body

        document.body.appendChild(p)
    }
}