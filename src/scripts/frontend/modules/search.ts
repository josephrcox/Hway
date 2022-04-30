import { apiGetPostsBySearchQuery } from "../modules/postLoader.js"
import { postsArray } from "../modules/objects/post.js"

const openButton = document.getElementById('search-button') as HTMLSpanElement
const bar = document.getElementById('searchbar') as HTMLDivElement
const submit = document.getElementById("search_submit") as HTMLButtonElement
const phrase = document.getElementById("search_phrase") as HTMLInputElement


export function init() {
    openButton.addEventListener('click', function() {
        if (bar.classList.contains('open')) {
            bar.classList.remove('open')
            bar.style.margin = '0px'
        } else {
            bar.classList.add('open')
            bar.style.margin = ''
        }
    })
}

submit.onclick = async function() {
    postsArray.innerHTML = ""
    apiGetPostsBySearchQuery(phrase.value)
    //window.location.href = '/search/q?query='+phrase.value
    
}
