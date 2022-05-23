console.log("pageNavigator.js loaded");
export var sorting_options = document.getElementsByClassName("sorting_options sort_option");
import { page_queries } from "../modules/pageAnalyzer.js";
export var pageNum;
export function addSortingEvents() {
    var _loop_1 = function (i) {
        sorting_options[i].addEventListener('click', function () {
            console.log(sorting_options[i]);
            var x = sorting_options[i];
            changeSortingOption(x.dataset.option + "");
            refreshSortingOptionStyling();
        });
    };
    for (var i = 0; i < (sorting_options === null || sorting_options === void 0 ? void 0 : sorting_options.length); i++) {
        _loop_1(i);
    }
    refreshSortingOptionStyling();
}
function refreshSortingOptionStyling() {
    var selectedColor = 'blue';
    for (var z = 0; z < sorting_options.length; z++) {
        var y = sorting_options[z];
    }
    if (page_queries.sort == "new") {
        sorting_options[0].style.color = selectedColor;
    }
    else if (page_queries.sort == "hot") {
        sorting_options[1].style.color = selectedColor;
    }
    else if (page_queries.sort == "top") {
        if (page_queries.t == "day") {
            sorting_options[2].style.color = selectedColor;
        }
        else if (page_queries.t == "week") {
            sorting_options[3].style.color = selectedColor;
        }
        else if (page_queries.t == "month") {
            sorting_options[4].style.color = selectedColor;
        }
        else if (page_queries.t == "all") {
            sorting_options[5].style.color = selectedColor;
        }
    }
}
function changeSortingOption(x) {
    page_queries.sort = x;
    if (x.includes("top")) {
        page_queries.t = x.split("_")[1];
        window.location.replace(window.location.origin + window.location.pathname + "?sort=" + x.split("_")[0] + "&t=" + page_queries.t + "&page=" + page_queries.page);
    }
    else {
        window.location.replace(window.location.origin + window.location.pathname + "?sort=" + x + "&t=" + page_queries.t + "&page=" + page_queries.page);
    }
}
export function addPageNavigation() {
    pageNum = document.getElementById("page-number");
    pageNum.innerHTML = "";
    var total_pages = parseInt(localStorage.getItem("total_pages") + "");
    var current_page = parseInt(page_queries.page);
    var futurePage;
    console.log(current_page, total_pages);
    if (total_pages >= current_page) {
        if (current_page > 1) {
            futurePage = current_page - 1;
            var back_href = window.location.origin + window.location.pathname + "?sort=" + page_queries.sort + "&t=" + page_queries.t + "&page=" + futurePage;
            pageNum.innerHTML += "<a href='" + back_href + "'><img class='page_nav_arrow' src='../dist/images/page_backarrow.svg' alt='Previous page'></a>";
        }
        futurePage = current_page + 1;
        var forward_href = window.location.origin + window.location.pathname + "?sort=" + page_queries.sort + "&t=" + page_queries.t + "&page=" + futurePage;
        pageNum.innerHTML += "<span id='page_pageNumber'>Page " + current_page + "/" + total_pages + "</span>";
        if (total_pages != current_page) {
            pageNum.innerHTML += "<a href='" + forward_href + "'><img class='page_nav_arrow rotate180' src='../dist/images/page_backarrow.svg' alt='Next page'></a>";
        }
    }
}
//# sourceMappingURL=pageNavigator.js.map