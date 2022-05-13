console.log("pageNavigator.js loaded")

export const sorting_options = document.getElementsByClassName("sorting_options sort_option")
import { page_queries  } from "../modules/pageAnalyzer.js"
export let pageNum:any

export function addSortingEvents() {
    for (let i=0;i<sorting_options?.length;i++) {
        sorting_options[i].addEventListener('click', function() {
            console.log(sorting_options[i])
            let x = sorting_options[i] as HTMLAnchorElement
            changeSortingOption(x.dataset.option + "")
            refreshSortingOptionStyling()
        })
    }
    refreshSortingOptionStyling()
}

function refreshSortingOptionStyling() {
    let selectedColor = 'blue'
    for (let z=0;z<sorting_options.length;z++) {
        let y = sorting_options[z] as HTMLDivElement
    }
    if (page_queries.sort == "new") {
        (sorting_options[0] as HTMLDivElement).style.color = selectedColor
    } else if (page_queries.sort == "hot") {
        (sorting_options[1] as HTMLDivElement).style.color = selectedColor
    } else if (page_queries.sort == "top") {
        if (page_queries.t == "day") {
            (sorting_options[2] as HTMLDivElement).style.color = selectedColor
        } else if (page_queries.t == "week") {
            (sorting_options[3] as HTMLDivElement).style.color = selectedColor
        } else if (page_queries.t == "month") {
            (sorting_options[4] as HTMLDivElement).style.color = selectedColor
        } else if (page_queries.t == "all") {
            (sorting_options[5] as HTMLDivElement).style.color = selectedColor
        }
    } 

}

function changeSortingOption(x:string) {
    page_queries.sort = x
    if (x.includes("top")) {
        page_queries.t = x.split("_")[1]
        window.location.replace(window.location.origin + window.location.pathname + "?sort="+x.split("_")[0]+"&t="+page_queries.t+"&page="+page_queries.page)
    } else {
        window.location.replace(window.location.origin + window.location.pathname + "?sort="+x+"&t="+page_queries.t+"&page="+page_queries.page)
    }
}

export function addPageNavigation() {
    pageNum = document.getElementById("page-number") as HTMLDivElement
    pageNum.innerHTML = ""
    let total_pages = parseInt(localStorage.getItem("total_pages")+"")
    let current_page = parseInt(page_queries.page)
    let futurePage:number
    console.log(current_page, total_pages)

    if (total_pages >= current_page) {
        if (current_page > 1) {
            futurePage = current_page - 1
            let back_href = window.location.origin + window.location.pathname + "?sort="+page_queries.sort+"&t="+page_queries.t+"&page="+futurePage
            pageNum.innerHTML += "<a href='"+back_href+"'><img class='page_nav_arrow' src='../dist/images/page_backarrow.svg'></a>"
        } 

        futurePage = current_page + 1
        let forward_href = window.location.origin + window.location.pathname + "?sort="+page_queries.sort+"&t="+page_queries.t+"&page="+futurePage
        pageNum.innerHTML += "<span id='page_pageNumber'>Page "+current_page+"/"+total_pages+"</span>"
        
        if (total_pages != current_page) {
            pageNum.innerHTML += "<a href='"+forward_href+"'><img class='page_nav_arrow rotate180' src='../dist/images/page_backarrow.svg'></a>"
        }
    }
}