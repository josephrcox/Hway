export const postObject = {
    title:"",
    display() {
        var p = document.createElement('div') as HTMLDivElement
        p.innerText = this.title

        document.body.appendChild(p)
    }
}