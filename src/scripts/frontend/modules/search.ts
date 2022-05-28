import { apiGetPostsBySearchQuery } from "../modules/postLoader.js"
import { postsArray } from "../modules/objects/post.js"
import { loadMain, startLoaders, stopLoaders } from "../main.js"

const openButton = document.getElementById('search-button') as HTMLSpanElement
export const bar = document.getElementById('searchbar') as HTMLDivElement
const submit = document.getElementById("search_submit") as HTMLButtonElement
export const phrase = document.getElementById("search_phrase") as HTMLInputElement
export const topic = document.getElementById("search_topic") as HTMLInputElement

export function init() {
    openButton.addEventListener('click', function() {
        if (bar.style.height == 'unset') {
            bar.style.height = '0px'
            bar.style.maxHeight = '0px'
        } else {
            bar.style.height = 'unset'
            bar.style.maxHeight = '500px'
        }
    })
}

// if (header_dd.style.height == 'unset') {
//     header_dd.style.height = '0px'
//         header_dd.style.maxHeight = '0px'
// } else {
//     header_dd.style.height = 'unset'
//     header_dd.style.maxHeight = '500px'
// }

submit.onclick = async function() {
    postsArray.innerHTML = ""

    startLoaders()
    await apiGetPostsBySearchQuery(phrase.value+"", topic.value+"")
    stopLoaders()
}

phrase.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        submit.click()
    }
})

topic.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        submit.click()
    }
})