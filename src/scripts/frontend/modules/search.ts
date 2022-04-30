import { apiGetPostsBySearchQuery } from "../modules/postLoader.js"
import { postsArray } from "../modules/objects/post.js"
import { loadMain, subheader, startLoaders, stopLoaders } from "../main.js"

const openButton = document.getElementById('search-button') as HTMLSpanElement
export const bar = document.getElementById('searchbar') as HTMLDivElement
const submit = document.getElementById("search_submit") as HTMLButtonElement
export const phrase = document.getElementById("search_phrase") as HTMLInputElement
export const topic = document.getElementById("search_topic") as HTMLInputElement

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
    subheader.style.display = 'none';


    startLoaders()
    await apiGetPostsBySearchQuery(phrase.value+"", topic.value+"")
    stopLoaders()
}
