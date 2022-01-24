let newPost_type = 1;
let uploadedImageUrls = [];
let uploadImageDeleteUrls = [];
let prevPageStr = "<a href='javascript:prevPage()' style='color: white; text-decoration: none;'> ⇐ </a>";
let nextPageStr = "<a href='javascript:nextPage()' style='color: white; text-decoration: none;'> ⇒ </a>";
let comment_count = [];
let commentBodies = [];
let lastClick = 0;
const delay = 400;
let currentTopic = "";
let currentPostID = "";
let isUserLoggedIn = false;
const pagequeries = Object.fromEntries((new URLSearchParams(window.location.search)).entries());
let sorting = pagequeries.sort;
let sorting_duration = pagequeries.t;
let pageNumber = parseInt(pagequeries.page);
let curURL = window.location.toString();
let curSearch = window.location.search;
let baseURL = curURL.replace(curSearch, "");
let queryset = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let newURL = "";
let cPageTypeIndex;
let search_topic = "";
let search_query = "";
const pageTypes = ['user', 'usersheet', 'topic', 'index', 'all', 'post', 'login', 'register', 'search', 'notifications', 'home', 'subscriptions', 'createpost'];
let currentPageCategory = (window.location.href).split('/')[3];
let currentPageType;
let currentUserID;
let topic;
let currentUsername;
let all_topics_array = [];
switch (currentPageCategory) {
    case 'user':
        cPageTypeIndex = 0;
        break;
    case 'users':
        cPageTypeIndex = 1;
        break;
    case ('h'):
        cPageTypeIndex = 2;
        break;
    case '':
        cPageTypeIndex = 3;
        break;
    case 'all':
        cPageTypeIndex = 4;
        break;
    case 'posts':
        cPageTypeIndex = 5;
        break;
    case 'login':
        cPageTypeIndex = 6;
        break;
    case 'register':
        cPageTypeIndex = 7;
        break;
    case 'search':
        cPageTypeIndex = 8;
        break;
    case 'notifications':
        cPageTypeIndex = 9;
        break;
    case 'home':
        cPageTypeIndex = 10;
        break;
    case 'subscriptions':
        cPageTypeIndex = 11;
        break;
    case 'post':
        cPageTypeIndex = 12;
        break;
}
currentPageType = pageTypes[cPageTypeIndex];
if ((["all", "topic"].indexOf(currentPageType) != -1 && ((pageNumber == null || isNaN(pageNumber)) || ['new', 'hot', 'top'].indexOf(sorting) == -1 && (['all', 'topic'].indexOf(currentPageType)) != -1 || (['all', 'day', 'week', 'month'].indexOf(sorting_duration) == -1 && (['all', 'topic'].indexOf(currentPageType)) != -1) || /[a-z]/i.test(pagequeries.page)))) {
    console.error("This URL has been tampered with, or does not fit with the current URL style. Redirecting to home page.");
    window.location.href = '/';
}
if (currentPageType == 'topic') {
    document.getElementById('sorting_options').style.display = 'block';
}
if (currentPageType == 'all') {
    document.getElementById('sorting_options').style.display = 'block';
}
if (currentPageType == 'post') {
    document.getElementById('sorting_options').style.display = 'none';
    document.getElementById('page-number').style.display = 'none';
    document.getElementById('post-button').style.display = 'none';
}
if (currentPageType == 'notifications') {
    document.getElementById('sorting_options').style.display = 'none';
    document.getElementById('page-number').style.display = 'none';
    document.getElementById('post-button').style.display = 'none';
}
if (currentPageType == 'search') {
    document.getElementById('sorting_options').style.display = 'none';
    document.getElementById('page-number').style.display = 'none';
    let url = window.location.href;
    if (url.indexOf('?topic=') == -1) {
        search_query = url.split('?query=')[1];
    }
    else {
        let indexOfQuery = url.indexOf('?query=');
        search_query = url.substring(indexOfQuery + 7);
        search_topic = (url.split('?topic=')[1]).split('?')[0];
    }
}
if (currentPageType == 'home') {
    topic = 'home';
}
if (currentPageType == 'login' || currentPageType == 'register') {
    document.getElementById('header-buttons').style.display = 'none';
}
else {
    document.getElementById('header-buttons').style.display = 'flex';
}
switch (sorting) {
    case "top":
        switch (sorting_duration) {
            case "day":
                document.getElementById('sorting_options_top_today').style.color = '#0066ff';
                document.getElementById('sorting_options_top_today').style.fontWeight = '700';
                break;
            case "week":
                document.getElementById('sorting_options_top_week').style.color = '#0066ff';
                document.getElementById('sorting_options_top_week').style.fontWeight = '700';
                break;
            case "month":
                document.getElementById('sorting_options_top_month').style.color = '#0066ff';
                document.getElementById('sorting_options_top_month').style.fontWeight = '700';
                break;
            case "all":
                document.getElementById('sorting_options_top_all').style.color = '#0066ff';
                document.getElementById('sorting_options_top_all').style.fontWeight = '700';
                break;
        }
        break;
    case "new":
        document.getElementById('sorting_options_new').style.color = '#0066ff';
        document.getElementById('sorting_options_new').style.fontWeight = '700';
        break;
    case "hot":
        document.getElementById('sorting_options_hot').style.color = '#0066ff';
        document.getElementById('sorting_options_hot').style.fontWeight = '700';
        break;
}
curURL = window.location.href;
curSearch = window.location.search;
baseURL = curURL.replace(curSearch, "");
let sortingOptions;
let newPageQueries;
document.getElementById('sorting_options_top_today').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "top";
    sorting_duration = "day";
    document.getElementById('sorting_options_top_today').style.color = '#0066ff';
    document.getElementById('sorting_options_top_today').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
document.getElementById('sorting_options_top_week').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "top";
    sorting_duration = "week";
    document.getElementById('sorting_options_top_week').style.color = '#0066ff';
    document.getElementById('sorting_options_top_week').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
document.getElementById('sorting_options_top_month').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "top";
    sorting_duration = "month";
    document.getElementById('sorting_options_top_month').style.color = '#0066ff';
    document.getElementById('sorting_options_top_month').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
document.getElementById('sorting_options_top_all').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "top";
    sorting_duration = "all";
    document.getElementById('sorting_options_top_all').style.color = '#0066ff';
    document.getElementById('sorting_options_top_all').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
document.getElementById('sorting_options_new').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "new";
    sorting_duration = "all";
    document.getElementById('sorting_options_new').style.color = '#0066ff';
    document.getElementById('sorting_options_new').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
document.getElementById('sorting_options_hot').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options');
    for (let i = 0; i < sortingOptions.length; i++) {
        sortingOptions[i].style.color = 'white';
        sortingOptions[i].style.fontWeight = '300';
    }
    sorting = "hot";
    sorting_duration = "all";
    document.getElementById('sorting_options_new').style.color = '#0066ff';
    document.getElementById('sorting_options_new').style.fontWeight = '700';
    newPageQueries = "?sort=" + sorting + "&t=" + sorting_duration + "&page=" + pageNumber;
    window.location.href = baseURL + newPageQueries;
});
async function randomizer(x) {
    let bodyJSON;
    alert("This will likely break a LOT! ");
    for (let t = 0; t < x; t++) {
        const response = await fetch('https://www.reddit.com/r/all/.json');
        const data = await response.json();
        var posts = data.data.children;
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].data.post_hint == "link") {
                bodyJSON = {
                    "title": posts[i].data.title,
                    "topic": posts[i].data.subreddit,
                    "type": 2,
                    "link": posts[i].data.url
                };
            }
            else if (posts[i].data.post_hint == "image") {
                bodyJSON = {
                    "title": posts[i].data.title,
                    "topic": posts[i].data.subreddit,
                    "type": 3,
                    "link": posts[i].data.url
                };
            }
            else if (posts[i].data.is_self == true) {
                bodyJSON = {
                    "title": posts[i].data.title,
                    "topic": posts[i].data.subreddit,
                    "type": 1,
                    "body": posts[i].selftext
                };
            }
            else {
                bodyJSON = null;
            }
            if (bodyJSON == null) {
            }
            else {
                const fetchResponse = await fetch('/api/post/post', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(bodyJSON)
                });
            }
        }
    }
}
const getUser = async () => {
    const response = await fetch('/api/get/currentuser/');
    const data = await response.json();
    if (data.code == 400) {
        isUserLoggedIn = false;
        document.getElementById("newPost_div").style.display = 'none';
        document.getElementById("currentUser").innerText = "Login / Register";
        document.getElementById("logout_button").style.display = 'none';
        document.getElementById("login_button").style.display = 'block';
        document.getElementById("reg_button").style.display = 'block';
        document.getElementById("post-button").style.display = 'none';
        document.getElementById('header-notifs').style.display = 'none';
    }
    else {
        currentUserID = data.id;
        currentUsername = data.name;
        isUserLoggedIn = true;
        await getSubscriptions();
        document.getElementById("currentUser").innerText = data.name;
        document.getElementById("logout_button").style.display = 'block';
        document.getElementById("login_button").style.display = 'none';
        document.getElementById("reg_button").style.display = 'none';
        if (['user', 'notifications', 'post'].indexOf(window.location.pathname) != -1) {
            document.getElementById("post-button").style.display = 'block';
        }
        const response = await fetch('/api/get/user/' + data.name + '/show_nsfw');
        const data2 = await response.json();
        let filter_nsfw = document.getElementById('filter_nsfw');
        if (data2.show_nsfw == true) {
            filter_nsfw.checked = true;
        }
        else {
            filter_nsfw.checked = false;
        }
    }
    changeCommentSectionVisibility();
    loadPosts("");
};
getUser();
function changeCommentSectionVisibility() {
    if (currentPageType == 'post') {
        if (isUserLoggedIn) {
            document.getElementById('commentSection_login_button').style.display = 'none';
            document.getElementById('newCom_body').style.display = 'block';
            document.getElementById('newCom_submit').style.display = 'block';
        }
        else {
            document.getElementById('commentSection_login_button').style.display = 'block';
            document.getElementById('newCom_body').style.display = 'none';
            document.getElementById('newCom_submit').style.display = 'none';
        }
    }
    else {
        if (document.getElementById('commentSection')) {
            document.getElementById('commentSection').style.display = 'none';
        }
    }
}
const postObject = {
    type: "",
    title: "",
    body: "",
    descDisplayed: "",
    total_votes: "",
    upvotes: "",
    downvotes: "",
    id: "",
    poster: "",
    date: "",
    link: "",
    topic: "",
    current_user_upvoted: "",
    current_user_downvoted: "",
    current_user_admin: "",
    comments: [],
    comment_count: '',
    poster_avatar_src: "",
    special_attributes: [],
    special_nsfw: "",
    display() {
        this.comments.sort((a, b) => b.total_votes - a.total_votes);
        var postContainer = document.createElement("div");
        postContainer.setAttribute("class", "postContainer");
        postContainer.setAttribute("id", "postContainer_" + this.id);
        postContainer.dataset.postId = this.id;
        var postFrame = document.createElement("table");
        postFrame.setAttribute("id", "postFrame_" + this.id);
        postFrame.setAttribute("class", "postFrame");
        postFrame.dataset.postId = this.id;
        var voteFrame = document.createElement("table");
        voteFrame.setAttribute("class", "voteFrame");
        var voteDiv = document.createElement("div");
        voteDiv.setAttribute("id", "voteDiv_" + this.id);
        voteDiv.setAttribute("class", "voteDiv");
        voteDiv.dataset.postId = this.id;
        var openPostButton = document.createElement("img");
        openPostButton.setAttribute("id", "openPostButton_" + this.id);
        openPostButton.setAttribute("class", "openPostButton");
        openPostButton.dataset.postId = this.id;
        openPostButton.src = '/assets/speech_bubble.png';
        openPostButton.addEventListener('click', function () {
            window.location.href = '/posts/' + openPostButton.dataset.postId;
        }, false);
        openPostButton.style.width = 'auto';
        let commentCountIncludingNested = 0;
        for (let i = 0; i < this.comments.length; i++) {
            commentCountIncludingNested++;
            commentCountIncludingNested += this.comments[i].nested_comments.length;
        }
        var commentCount = document.createElement("div");
        commentCount.innerHTML = "(" + commentCountIncludingNested + ")";
        commentCount.setAttribute("class", "commentCount");
        var voteCount = document.createElement("div");
        voteCount.setAttribute("id", "voteCount_" + this.id);
        voteCount.setAttribute("class", "voteCount");
        voteCount.dataset.postId = this.id;
        voteCount.innerHTML = this.total_votes;
        var voteUpButton = document.createElement("img");
        voteUpButton.setAttribute("id", "voteUpButton_" + this.id);
        voteUpButton.setAttribute("class", "voteUpButton");
        voteUpButton.dataset.postId = this.id;
        voteUpButton.src = '/assets/up.gif';
        if (this.current_user_upvoted) {
            voteUpButton.src = '/assets/up_selected.gif';
        }
        voteUpButton.style.width = 'auto';
        voteUpButton.addEventListener('click', function () {
            console.log(voteUpButton.dataset.postId);
            vote(1, voteUpButton.dataset.postId);
        }, false);
        var voteDownButton = document.createElement("img");
        voteDownButton.setAttribute("id", "voteDoButton_" + this.id);
        voteDownButton.setAttribute("class", "voteDoButton");
        voteDownButton.dataset.postId = this.id;
        voteDownButton.src = '/assets/down.gif';
        if (this.current_user_downvoted) {
            voteDownButton.src = '/assets/down_selected.gif';
        }
        voteDownButton.style.width = 'auto';
        voteDownButton.addEventListener('click', function () {
            vote(-1, voteDownButton.dataset.postId);
        }, false);
        var title = postFrame.insertRow(0);
        var info = postFrame.insertRow(1);
        var titleCell = title.insertCell(0);
        var infoCell = info.insertCell(0);
        titleCell.setAttribute("id", "titleCell_" + this.id);
        titleCell.setAttribute("class", "titleCell");
        infoCell.setAttribute("id", "info_" + this.id);
        infoCell.setAttribute("class", "infoCell");
        titleCell.dataset.postId = this.id;
        infoCell.dataset.postId = this.id;
        let href = this.topic.replace(/^"(.*)"$/, '$1');
        infoCell.innerHTML = "Submitted by " + "<a href='/user/" + this.poster + "'><img src='" + this.poster_avatar_src + "' class='avatarimg'>  <span style='color:blue'>" + this.poster + "</span> </a>in " + "<span style='color:blue; font-weight: 900;'><a href='/h/" + href + "'>" + this.topic + "</a></span>";
        if (isUserLoggedIn == false) {
        }
        else if (subscriptions.includes(this.topic)) {
            infoCell.innerHTML += '<i class="far fa-minus-square subscribe_inline_button" style="margin-left:0px;color:red;" id="unsubscribeInlineButton_' + this.topic + '"></i>';
        }
        else {
            infoCell.innerHTML += '<i class="fas fa-plus-square subscribe_inline_button" style="margin-left:0px;color:green;" id="subscribeInlineButton_' + this.topic + '"></i>';
        }
        infoCell.innerHTML += "  on <span style='font-style:italic;'>" + this.date + "</span>";
        var desc = postFrame.insertRow(2);
        var descCell = desc.insertCell(0);
        descCell.setAttribute("id", "descCell_" + this.id);
        descCell.setAttribute("class", "descCell");
        titleCell.innerHTML = this.title;
        if (this.type == "3") {
            var imgThumbDiv = document.createElement('div');
            imgThumbDiv.setAttribute("class", "postImgThumbDiv");
            imgThumbDiv.setAttribute("id", "postImgThumbDiv_" + this.id);
            var imgThumb = document.createElement('img');
            imgThumb.setAttribute("class", "postImgThumb");
            imgThumb.setAttribute("id", "postImgThumb_" + this.id);
            imgThumb.src = this.link;
            if (this.special_nsfw == "true") {
                imgThumb.style.filter = "blur(3px)";
            }
            descCell.innerHTML = "<img src='" + this.link + "' class='" + "postPhoto' id='postPhoto_" + this.id + "' width='100%'>";
            descCell.style.width = '99%';
            descCell.style.display = 'none';
            titleCell.innerHTML = this.title + "<span style='font-size:12px'>        (+)</span>";
        }
        if (this.body != "(empty)") {
            descCell.innerHTML = this.body;
            descCell.style.display = 'none';
            titleCell.innerHTML = this.title + "<span style='font-size:12px'>        (+)</span>";
        }
        if (this.type == "2") {
            let domain = (new URL(this.link));
            let domainstring = (domain.hostname.replace('www.', ''));
            titleCell.innerHTML = "<a href='" + this.link + "'>" + this.title + "</a> <span style='font-size: 10px'>(" + domainstring + "...)</span>";
        }
        titleCell.onclick = function () {
            if (titleCell.innerHTML != "(empty)") {
                expandDesc(titleCell.id.split("_")[1]);
            }
        };
        if (this.type == "3") {
            imgThumbDiv.onclick = function () {
                if (imgThumbDiv.innerHTML != "(empty)") {
                    expandDesc(imgThumbDiv.id.split("_")[1]);
                }
            };
        }
        if (this.current_user_admin) {
            var del = document.createElement("img");
            del.setAttribute("class", "deletePostButton");
            del.setAttribute("id", "deletePostButton_" + this.id);
            del.src = "/assets/trash.png";
            del.style.height = '20px';
            del.style.width = 'auto';
            let delPostConfirmation = false;
            let delPostConfirmationId;
            del.onclick = function () {
                if (delPostConfirmation) {
                    if (delPostConfirmationId == del.id.split("_")[1]) {
                        deletePost(del.id.split("_")[1]);
                    }
                    else {
                        del.src = "/assets/trash_confirm.png";
                        delPostConfirmation = true;
                        delPostConfirmationId = del.id.split("_")[1];
                    }
                }
                else {
                    del.src = "/assets/trash_confirm.png";
                    delPostConfirmation = true;
                    delPostConfirmationId = del.id.split("_")[1];
                }
            };
        }
        if (currentPageType == 'user') {
            document.getElementById("page-profile-posts").appendChild(postContainer);
        }
        else {
            document.getElementById("postsArray").appendChild(postContainer);
        }
        document.getElementById("postContainer_" + this.id).appendChild(postFrame);
        if (this.type == "3") {
            document.getElementById("postFrame_" + this.id).appendChild(imgThumbDiv);
            document.getElementById("postImgThumbDiv_" + this.id).appendChild(imgThumb);
        }
        document.getElementById("postContainer_" + this.id).appendChild(voteDiv);
        document.getElementById("voteDiv_" + this.id).appendChild(voteCount);
        document.getElementById("voteDiv_" + this.id).appendChild(voteUpButton);
        document.getElementById("voteDiv_" + this.id).appendChild(voteDownButton);
        document.getElementById("voteDiv_" + this.id).appendChild(openPostButton);
        document.getElementById("voteDiv_" + this.id).appendChild(commentCount);
        if (this.current_user_admin) {
            document.getElementById("voteDiv_" + this.id).appendChild(del);
        }
        var specialBox = document.createElement("div");
        specialBox.setAttribute("class", "specialBox");
        specialBox.setAttribute("id", "specialBox_" + this.id);
        document.getElementById("voteDiv_" + this.id).append(specialBox);
        if (this.special_nsfw == "true") {
            var nsfwLabel = document.createElement("img");
            nsfwLabel.setAttribute("id", "nsfwLabel_" + this.id);
            nsfwLabel.setAttribute("class", "nsfwLabel");
            nsfwLabel.src = "/assets/NSFW.png";
            nsfwLabel.style.width = 'auto';
            nsfwLabel.style.height = '20px';
            nsfwLabel.style.marginTop = '5px';
            document.getElementById("specialBox_" + this.id).append(nsfwLabel);
        }
    }
};
const topicObject = {
    name: "",
    post_count: "",
    display() {
        if (this.name == "") {
            return null;
        }
        var topicContainer = document.createElement("div");
        topicContainer.setAttribute("id", "topicContainer_" + this.name);
        topicContainer.setAttribute("class", "topicContainer postContainer");
        var topicFrame = document.createElement("div");
        topicFrame.setAttribute("id", "topicFrame_" + this.name);
        topicFrame.setAttribute("class", "topicFrame postFrame");
        topicFrame.onclick = function () {
            window.location.href = '/h/' + topicFrame.id.split('_')[1];
        };
        if (this.post_count != "") {
            topicFrame.innerHTML = this.name + " | Posts: " + this.post_count;
            topicContainer.append(topicFrame);
            document.getElementById("recommended_topics").append(topicContainer);
        }
        else if (window.location.href.indexOf('/subscriptions') != -1) {
            topicFrame.innerHTML = this.name;
            var topicUnsub = document.createElement('div');
            topicUnsub.innerHTML = '<i class="far fa-minus-square subscribe_inline_button" style="margin-left:0px;color:red;" id="unsubscribeInlineButton_' + this.name + '"></i>';
            topicUnsub.style.marginTop = '20px';
            topicUnsub.setAttribute("id", "topicUnsub_" + this.name);
            topicUnsub.onclick = function () {
                unsubscribe(topicUnsub.id.split('_')[1], "topic");
                topicContainer.outerHTML = "";
            };
            topicContainer.append(topicFrame);
            topicContainer.append(topicUnsub);
            document.getElementById("subscriptions_page_container").appendChild(topicContainer);
        }
    }
};
const commentObject = {
    body: "",
    id: "",
    nested_comments: [],
    parentID: "",
    total_votes: "",
    users_voted: [],
    poster: "",
    posterID: "",
    date: "",
    current_user_voted: "",
    current_user_admin: "",
    reply_button_shown: false,
    display() {
        var fullCommentContainer = document.createElement("div");
        fullCommentContainer.setAttribute("id", "fullCommentContainer_" + this.id);
        if (currentPageType != 'user') {
            document.getElementById("comments").appendChild(fullCommentContainer);
        }
        else {
            document.getElementById("page-profile-comments").appendChild(fullCommentContainer);
        }
        var comFrame = document.createElement("table");
        comFrame.setAttribute("class", "comFrame");
        comFrame.setAttribute("id", "comFrame_" + this.id);
        document.getElementById("fullCommentContainer_" + this.id).appendChild(comFrame);
        let posterRow = comFrame.insertRow(0);
        posterRow.setAttribute("id", "posterRow_" + this.id);
        posterRow.setAttribute("class", "posterRow");
        let posterCell = posterRow.insertCell(0);
        let infoRow = comFrame.insertRow(1);
        let infoCell = infoRow.insertCell(0);
        infoCell.innerHTML = this.date;
        infoCell.setAttribute("class", "comInfoCell");
        infoCell.setAttribute("id", "comInfoCell_" + this.id);
        if (this.current_user_admin) {
            var del = document.createElement("img");
            del.setAttribute("class", "deletePostButton");
            del.setAttribute("id", "deletePostButton_" + this.id);
            del.src = "/assets/trash.png";
            del.style.height = '20px';
            del.style.width = 'auto';
            del.style.paddingLeft = '10px';
            del.style.marginBottom = '-5px';
            let delPostConfirmation = false;
            let delPostConfirmationId;
            del.onclick = function () {
                if (delPostConfirmation) {
                    if (delPostConfirmationId == del.id.split("_")[1]) {
                        deleteComment(del.id.split("_")[1]);
                    }
                    else {
                        del.src = "/assets/trash_confirm.png";
                        delPostConfirmation = true;
                        delPostConfirmationId = del.id.split("_")[1];
                    }
                }
                else {
                    del.src = "/assets/trash_confirm.png";
                    delPostConfirmation = true;
                    delPostConfirmationId = del.id.split("_")[1];
                }
            };
        }
        if (this.current_user_admin) {
            document.getElementById("comInfoCell_" + this.id).appendChild(del);
        }
        let bodyRow = comFrame.insertRow(2);
        let bodyCell = bodyRow.insertCell(0);
        posterCell.innerHTML = "<span style='color:blue'>" + this.poster + "</span> says: (-)";
        posterCell.setAttribute("id", "posterCell_" + this.id);
        bodyCell.innerHTML = this.body;
        bodyCell.setAttribute("class", "bodyCell");
        bodyCell.setAttribute("id", "bodyCell_" + this.id);
        var ncDiv = document.createElement("div");
        ncDiv.setAttribute("class", "ncDiv");
        ncDiv.setAttribute("id", "ncDiv_" + this.id);
        var ncContainer = document.createElement("div");
        ncContainer.setAttribute("class", "ncContainer");
        ncContainer.setAttribute("id", "ncContainer_" + this.id);
        document.getElementById("fullCommentContainer_" + this.id).appendChild(ncContainer);
        for (let i = 0; i < this.nested_comments.length; i++) {
            var ncFrame = document.createElement("div");
            ncFrame.setAttribute("class", "ncDiv");
            ncFrame.setAttribute("id", "ncFrame_" + this.nested_comments[i].id);
            var ncTable = document.createElement("table");
            ncTable.setAttribute("class", "ncTable");
            ncTable.setAttribute("id", "ncTable_" + this.nested_comments[i].id);
            let ncTopRow = ncTable.insertRow(0);
            ncTopRow.setAttribute("id", "ncTopRow_" + this.id);
            ncTopRow.setAttribute("class", "ncTopRow");
            let ncPoster = ncTopRow.insertCell(0);
            ncPoster.innerHTML = "<span style='color:blue'>" + this.nested_comments[i].poster + "</span> says:";
            let ncInfoRow = ncTable.insertRow(1);
            let ncInfoCell = ncInfoRow.insertCell(0);
            ncInfoCell.innerHTML = "<span style='font-size:15px; font-style:italic;'>" + this.nested_comments[i].date + "</span>";
            ncInfoCell.setAttribute("class", "ncInfoCell");
            ncInfoCell.setAttribute("id", "ncInfoCell_" + this.nested_comments[i].id);
            let ncBottomRow = ncTable.insertRow(2);
            let ncContent = ncBottomRow.insertCell(0);
            ncContent.innerHTML = this.nested_comments[i].body;
            var ncVoteDiv = document.createElement("div");
            ncVoteDiv.setAttribute("class", "ncVoteDiv");
            ncVoteDiv.setAttribute("id", "ncVoteDiv_" + this.nested_comments[i].id);
            var voteCount = document.createElement("div");
            voteCount.setAttribute("id", "comnestedVoteCount_" + this.nested_comments[i].id);
            voteCount.setAttribute("class", "comnestedVoteCount");
            voteCount.innerHTML = this.nested_comments[i].total_votes;
            var voteUp = document.createElement("img");
            voteUp.setAttribute("id", "nestedcommentUp_" + this.nested_comments[i].id + "_" + this.id);
            voteUp.setAttribute("class", "nestedcommentUp");
            if (this.nested_comments[i].current_user_voted) {
                voteUp.src = '/assets/up_selected.gif';
            }
            else {
                voteUp.src = '/assets/up.gif';
            }
            voteUp.style.width = 'auto';
            let self = this;
            voteUp.onclick = function () {
                voteCom(self.nested_comments[i].id, currentPostID, true, self.id);
            };
            if (this.nested_comments[i].posterid == currentUserID) {
                var delnc = document.createElement("img");
                delnc.setAttribute("class", "deletePostButton");
                delnc.setAttribute("id", "deletePostButton_" + this.nested_comments[i].id + "_" + this.id);
                delnc.style.marginTop = '-15px';
                delnc.style.marginRight = '10px';
                delnc.src = "/assets/trash.png";
                delnc.style.height = '20px';
                delnc.style.width = 'auto';
                delnc.style.paddingLeft = '10px';
                delnc.style.marginBottom = '-5px';
                let delPostConfirmation = false;
                let delPostConfirmationId;
                let self = delnc;
                delnc.onclick = function () {
                    if (delPostConfirmation) {
                        if (delPostConfirmationId == self.id.split('_')[1]) {
                            deleteNestedComment(window.location.href.split('/posts/')[1], self.id.split('_')[2], self.id.split('_')[1]);
                        }
                        else {
                            self.src = "/assets/trash_confirm.png";
                            delPostConfirmation = true;
                            delPostConfirmationId = self.id.split('_')[1];
                        }
                    }
                    else {
                        self.src = "/assets/trash_confirm.png";
                        delPostConfirmation = true;
                        delPostConfirmationId = self.id.split('_')[1];
                    }
                };
                ncInfoCell.appendChild(delnc);
            }
            ncFrame.append(ncTable);
            ncFrame.append(ncVoteDiv);
            ncContainer.appendChild(ncFrame);
            document.getElementById("ncVoteDiv_" + this.nested_comments[i].id).appendChild(voteCount);
            document.getElementById("ncVoteDiv_" + this.nested_comments[i].id).appendChild(voteUp);
        }
        posterRow.onclick = function () {
            var id = posterRow.id.substring(10);
            var body = document.getElementById("bodyCell_" + id);
            var poster = document.getElementById("posterCell_" + id).innerHTML.split(" says")[0];
            let replyDiv = document.getElementById('comreplyDiv_' + posterRow.id.substring(10));
            if (body.innerHTML == "") {
                document.getElementById("posterCell_" + id).innerHTML = "<span style='color:blue'>" + poster + "</span> says: (-)";
                body.innerHTML = commentBodies[comment_count.indexOf(parseInt(id))];
                if (isUserLoggedIn) {
                    replyDiv.style.display = 'flex';
                }
                ncContainer.style.display = 'block';
                replyButton.style.visibility = 'visible';
            }
            else {
                document.getElementById("posterCell_" + id).innerHTML = "<span style='color:blue'>" + poster + "</span> says: (+)";
                var x = document.getElementById("bodyCell_" + posterRow.id.substring(10));
                x.innerHTML = "";
                ncContainer.style.display = 'none';
                if (isUserLoggedIn) {
                    replyDiv.style.display = 'none';
                    replyButton.style.visibility = 'hidden';
                }
            }
        };
        if (this.nested_comments.length == 0) {
            ncContainer.style.display = 'none';
        }
        if (isUserLoggedIn) {
            var replyDiv = document.createElement("div");
            replyDiv.setAttribute("class", "comreplyDiv");
            replyDiv.setAttribute("id", "comreplyDiv_" + this.id);
            replyDiv.style.display = 'flex';
            var replyBox = document.createElement("textarea");
            replyBox.setAttribute("class", "comreplybox");
            replyBox.setAttribute("id", "comreplybox_" + this.id);
            replyBox.setAttribute("rows", "1");
            var replySubmit = document.createElement("button");
            replySubmit.setAttribute("class", "comreplySubmit");
            replySubmit.setAttribute("id", "comreplySubmit_" + this.id);
            replySubmit.innerText = "Reply";
            replySubmit.onclick = function () {
                let parentID = window.location.href.split('/posts/')[1];
                let reply = document.getElementById('comreplybox_' + replySubmit.id.split('_')[1]);
                comment_nested(parentID, reply.value, replySubmit.id.split('_')[1]);
                reply.value = "";
            };
            var replyButton = document.createElement('img');
            replyButton.setAttribute("class", "comreplybutton");
            replyButton.setAttribute("id", "comreplyButton_" + this.id);
            replyButton.src = '/assets/speech_bubble.png';
            infoRow.appendChild(replyButton);
            replyButton.onclick = function () {
                document.getElementById("comreplyDiv_" + replyButton.id.split('_')[1]).scrollIntoView();
            };
            document.getElementById("comments").appendChild(replyDiv);
            document.getElementById("comreplyDiv_" + this.id).appendChild(replyBox);
            document.getElementById("comreplyDiv_" + this.id).appendChild(replySubmit);
        }
        var voteDiv = document.createElement("div");
        voteDiv.setAttribute("id", "voteDiv_" + this.id);
        voteDiv.setAttribute("class", "comVoteDiv");
        var voteCount = document.createElement("div");
        voteCount.setAttribute("id", "voteCount_" + this.id);
        voteCount.setAttribute("class", "comVoteCount");
        voteCount.innerHTML = this.total_votes;
        var voteUp = document.createElement("img");
        voteUp.setAttribute("id", "voteComUp_" + this.id);
        voteUp.setAttribute("class", "voteUpButton");
        if (this.current_user_voted == true) {
            voteUp.src = '/assets/up_selected.gif';
        }
        else {
            voteUp.src = '/assets/up.gif';
        }
        voteUp.style.width = 'auto';
        voteUp.onclick = function () {
            voteCom(voteUp.id.substring(10), currentPostID, false, 0);
        };
        document.getElementById("comFrame_" + this.id).appendChild(voteDiv);
        document.getElementById("voteDiv_" + this.id).appendChild(voteCount);
        document.getElementById("voteDiv_" + this.id).appendChild(voteUp);
    }
};
const deletePost = async (x) => {
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/post/delete/' + x, settings);
    const data = await response.json();
    if (data.status == 'ok') {
        document.getElementById("postContainer_" + x).innerHTML = "<span style='color:white'>The post was permanantly deleted.</span>";
    }
    if (data.status == 'error') {
        alert(data.error);
    }
};
const deleteComment = async (x) => {
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/comment/delete/' + window.location.href.split('/posts/')[1] + '/' + x, settings);
    const data = await response.json();
    if (data.status == 'ok') {
        document.getElementById("fullCommentContainer_" + x).innerHTML = "<span style='color:white'>The comment was permanantly deleted.</span>";
        document.getElementById("comreplyDiv_" + x).outerHTML = "";
    }
    if (data.status == 'error') {
        alert(data.error);
    }
};
const deleteNestedComment = async (postID, commentID, nestedCommentID) => {
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/comment_nested/delete/' + window.location.href.split('/posts/')[1] + '/' + commentID + '/' + nestedCommentID, settings);
    const data = await response.json();
    if (data.status == 'ok') {
        document.getElementById("ncFrame_" + nestedCommentID).style.display = 'none';
    }
    if (data.status == 'error') {
        alert(data.error);
    }
};
const subscribe = async (x, type) => {
    if (type == 'topic') {
        const settings = {
            method: 'PUT',
        };
        const fetchResponse = await fetch('/api/put/subscribe/' + x, settings);
        const data = await fetchResponse.json();
        if (fetchResponse.status != 200) {
            alert(fetchResponse.status);
        }
        if (window.location.href.indexOf('/subscriptions') != -1) {
            var top = Object.create(topicObject);
            top.name = x;
            top.display();
        }
    }
};
const unsubscribe = async (x, type) => {
    if (type == 'topic') {
        const settings = {
            method: 'PUT',
        };
        const fetchResponse = await fetch('/api/put/unsubscribe/' + x, settings);
        const data = await fetchResponse.json();
        console.log(fetchResponse);
        if (fetchResponse.status != 200) {
            alert(fetchResponse.status);
        }
    }
};
const loadPosts = async (topic) => {
    if (currentPageType == 'user') {
        let user = window.location.href.split('/').pop();
        return loadUserPage(user);
    }
    if (['notifications', 'subscriptions', 'createpost'].indexOf(currentPageType) != -1) {
        return;
    }
    if (topic == null || topic == "") {
        topic = "all";
    }
    if (currentPageType == 'topic') {
        currentPageCategory = window.location.href;
        topic = currentPageCategory.split('/')[4];
    }
    if (currentPageType == 'home') {
        topic = 'home';
    }
    let options = "?sort=" + sorting + "&t=" + sorting_duration + "&nsfw=" + document.getElementById("filter_nsfw").checked + "";
    if (currentPageType == 'post') {
        let url = window.location.href;
        let postid = url.split('/posts/')[1];
        const response = await fetch('/api/get/posts/' + postid);
        const data = await response.json();
        document.getElementById("postsArray").innerHTML = "";
        if (data.length == 0 || data.status == 'error') {
            document.getElementById("postsArray").innerHTML = "<span style='color:white'>" + data.data + " </span>";
            document.getElementById("commentSection").style.display = 'none';
        }
        else {
            let post = Object.create(postObject);
            post.title = data.title;
            post.body = data.body;
            if (post.body == "" || post.body == undefined || post.body == null) {
                post.body = "(empty)";
            }
            post.total_votes = data.total_votes;
            post.upvotes = data.upvotes;
            post.downvotes = data.downvotes;
            post.id = data._id;
            post.poster = data.poster;
            post.poster_avatar_src = data.posterAvatarSrc;
            post.date = data.date;
            post.descDisplayed = false;
            post.link = data.link;
            post.type = data.type;
            post.topic = data.topic;
            post.comment_count = data.comments.length;
            post.comments = data.comments;
            try {
                post.special_attributes = data.special_attributes[0];
                if (post.special_attributes.nsfw == true) {
                    post.special_nsfw = true;
                }
            }
            catch (err) {
            }
            post.current_user_upvoted = data.current_user_upvoted;
            post.current_user_downvoted = data.current_user_downvoted;
            post.current_user_admin = data.current_user_admin;
            post.display();
            expandDesc(post.id);
            currentPostID = post.id;
            for (let i = 0; i < data.comments.length; i++) {
                let com = Object.create(commentObject);
                com.body = data.comments[i].body;
                com.id = data.comments[i]._id;
                com.total_votes = data.comments[i].total_votes;
                com.poster = data.comments[i].poster;
                com.posterID = data.comments[i].posterID;
                com.date = data.comments[i].date;
                com.users_voted = data.comments[i].users_voted;
                com.parentID = currentPostID;
                com.nested_comments = data.comments[i].nested_comments;
                com.current_user_voted = data.comments[i].current_user_voted;
                com.current_user_admin = data.comments[i].current_user_admin;
                com.display();
                comment_count.push(com.id);
                commentBodies.push(com.body);
            }
            document.getElementById('commentSection').style.display = 'inline';
            topFunction();
        }
    }
    else {
        let request = '/api/get/' + topic + '/q' + window.location.search;
        if (['home', 'topic'].indexOf(currentPageType) != -1) {
            document.getElementById("postsArray").innerHTML = "";
        }
        if (currentPageType == 'search') {
            if (search_topic != "" && search_topic != null) {
                request = '/api/get/search?topic=' + search_topic + '&query=' + search_query;
            }
            else {
                request = '/api/get/search?query=' + search_query;
            }
        }
        const response = await fetch(request);
        const data = await response.json();
        let search_query_array = search_query.split('+');
        let search_similar_topics = 0;
        for (let x = 0; x < search_query_array.length; x++) {
            for (let i = 0; i < all_topics_array.length; i++) {
                if (all_topics_array[i][0].toLowerCase().indexOf(search_query_array[x]) != -1 && window.location.href.indexOf('/search/') != -1) {
                    console.log("Query match for " + all_topics_array[i][0]);
                    var topObj = Object.create(topicObject);
                    topObj.name = all_topics_array[i][0];
                    topObj.post_count = all_topics_array[i][1];
                    topObj.display();
                    search_similar_topics++;
                }
            }
        }
        if (data.length == 0) {
            if (search_similar_topics > 0) {
                document.getElementById("recommended_topics").style.display = 'flex';
            }
            else {
                document.getElementById("postsArray").innerHTML = "<span style='color:white'>No posts... yet!</span>";
                document.getElementById("recommended_topics").style.display = 'none';
            }
            if (currentPageType == 'home' && subscriptions[0] == "") {
                document.getElementById("postsArray").innerHTML = "<div style='text-align:center;padding-bottom:20px;'><span style='color:white'>You are not subscribed to any topics. <br/><br/>Press the logo shown below next to a topic to subscribe (or visit the topic page).</span></div>";
                document.getElementById("postsArray").innerHTML += '<div style="text-align:center;"><i class="fas fa-plus-square subscribe_inline_button" style="margin-left:0px;color:green;" id="subscribeInlineButton_home"></i></div>';
                document.getElementById('sorting_options').style.display = 'none';
                document.getElementById('page-number').style.display = 'none';
            }
        }
        else {
            data.sort((a, b) => b.total_votes - a.total_votes);
        }
        for (let i = 0; i < data.length; i++) {
            let post = Object.create(postObject);
            post.title = data[i].title;
            post.body = data[i].body;
            if (post.body == "" || post.body == undefined || post.body == null) {
                post.body = "(empty)";
            }
            post.total_votes = data[i].total_votes;
            post.upvotes = data[i].upvotes;
            post.downvotes = data[i].downvotes;
            post.id = data[i]._id;
            post.poster = data[i].poster;
            post.poster_avatar_src = data[i].posterAvatarSrc;
            post.date = data[i].date;
            post.descDisplayed = false;
            post.link = data[i].link;
            post.type = data[i].type;
            post.topic = data[i].topic;
            post.comment_count = data[i].comments.length;
            post.comments = data[i].comments;
            try {
                post.special_attributes = data[i].special_attributes[0];
                if (post.special_attributes.nsfw == true) {
                    post.special_nsfw = true;
                }
            }
            catch (err) {
            }
            post.current_user_upvoted = data[i].current_user_upvoted;
            post.current_user_downvoted = data[i].current_user_downvoted;
            post.current_user_admin = data[i].current_user_admin;
            post.display();
        }
        topFunction();
    }
    addInlineSubscribeEventListeners();
    currentTopic = topic;
};
const loadUserPage = async (user) => {
    const response = await fetch('/api/get/posts/user/' + user);
    const data = await response.json();
    document.getElementById("page-profile-posts").innerHTML = "";
    if (data.length == 0) {
        document.getElementById("page-profile-posts").innerHTML = "<div style='color:white'>No posts... yet!</div>";
    }
    for (let i = 0; i < data.length; i++) {
        let post = Object.create(postObject);
        post.title = data[i].title;
        post.body = data[i].body;
        if (post.body == "" || post.body == undefined || post.body == null) {
            post.body = "(empty)";
        }
        post.total_votes = data[i].total_votes;
        post.upvotes = data[i].upvotes;
        post.downvotes = data[i].downvotes;
        post.id = data[i]._id;
        post.poster = data[i].poster;
        post.date = data[i].date;
        post.descDisplayed = false;
        post.link = data[i].link;
        post.type = data[i].type;
        post.topic = data[i].topic;
        post.comment_count = data[i].comments.length;
        post.comments = data[i].comments;
        post.poster_avatar_src = data[i].posterAvatarSrc;
        try {
            post.special_attributes = data[i].special_attributes[0];
            if (post.special_attributes.nsfw == true) {
                post.special_nsfw = true;
            }
        }
        catch (err) {
        }
        post.current_user_upvoted = data[i].current_user_upvoted;
        post.current_user_downvoted = data[i].current_user_downvoted;
        post.current_user_admin = data[i].current_user_admin;
        post.display();
    }
    topFunction();
};
function expandDesc(x) {
    let y = "descCell_" + x;
    let mediaPost = false;
    if (document.getElementById('postImgThumb_' + x)) {
        if (document.getElementById('postImgThumb_' + x).src != null) {
            mediaPost = true;
        }
    }
    let title = document.getElementById("titleCell_" + x).innerHTML.replace('<span style="font-size:12px">        (+)</span>', '').replace('<span style="font-size:12px">        (-)</span>', '');
    if (document.getElementById(y).innerHTML != "" && document.getElementById(y).innerHTML != null) {
        if (document.getElementById(y).style.display == 'block') {
            document.getElementById(y).style.display = 'none';
            document.getElementById("titleCell_" + x).innerHTML = title + "<span style='font-size:12px'>        (+)</span>";
            if (mediaPost) {
                document.getElementById('postImgThumb_' + x).style.display = 'block';
            }
        }
        else {
            document.getElementById(y).style.display = 'block';
            document.getElementById("titleCell_" + x).innerHTML = title + "<span style='font-size:12px'>        (-)</span>";
            if (mediaPost) {
                document.getElementById('postImgThumb_' + x).style.display = 'none';
            }
        }
    }
}
const storeAndDisplayTopics = async () => {
    const response = await fetch('/api/get/topics/');
    var data = await response.json();
    all_topics_array = data;
};
storeAndDisplayTopics();
const vote = async (change, id) => {
    console.log(change, id);
    if (lastClick >= (Date.now() - delay)) {
        return;
    }
    lastClick = Date.now();
    const settings = {
        method: 'PUT',
    };
    const fetchResponse = await fetch('/vote/' + id + '/' + change, settings);
    const data = await fetchResponse.json();
    if (data.status == 'ok') {
        document.getElementById('voteCount_' + id).innerHTML = data.newtotal;
        let voteUpButtonwithID = document.getElementById('voteUpButton_' + id);
        let voteDoButtonwithID = document.getElementById('voteDoButton_' + id);
        if (data.gif == 'none') {
            voteUpButtonwithID.src = '/assets/up.gif';
            voteDoButtonwithID.src = '/assets/down.gif';
        }
        if (data.gif == 'up') {
            voteUpButtonwithID.src = '/assets/up_selected.gif';
            voteDoButtonwithID.src = '/assets/down.gif';
        }
        if (data.gif == 'down') {
            voteUpButtonwithID.src = '/assets/up.gif';
            voteDoButtonwithID.src = '/assets/down_selected.gif';
        }
    }
    if (data.error) {
        if (data.error.name == 'JsonWebTokenError') {
            window.location.href = '/login';
        }
    }
};
const voteCom = async (id, parentID, nested, commentParentID) => {
    if (commentParentID == null || "") {
        commentParentID = "0";
    }
    const settings = {
        method: 'PUT',
    };
    const fetchResponse = await fetch('/votecomment/' + parentID + '/' + id + '/' + nested + '/' + commentParentID, settings);
    const data = await fetchResponse.json();
    if (data.status == 'ok') {
        if (data.voted == 'yes') {
            if (nested) {
                document.getElementById('nestedcommentUp_' + id + '_' + commentParentID).src = '/assets/up_selected.gif';
            }
            else {
                document.getElementById('voteComUp_' + id).src = '/assets/up_selected.gif';
            }
        }
        if (data.voted == 'no') {
            if (nested) {
                document.getElementById('nestedcommentUp_' + id + '_' + commentParentID).src = '/assets/up.gif';
            }
            else {
                document.getElementById('voteComUp_' + id).src = '/assets/up.gif';
            }
        }
        if (nested) {
            document.getElementById('comnestedVoteCount_' + id).innerHTML = data.newcount;
        }
        else {
            document.getElementById('voteCount_' + id).innerHTML = data.newcount;
        }
    }
    else {
        if (data.error.name == 'JsonWebTokenError') {
            window.location.href = '/login';
        }
    }
};
const comment = async () => {
    let body = document.getElementById("newCom_body").value;
    if (body != null && body != "") {
        let bodyJSON = {
            "id": window.location.href.split("/posts/")[1],
            "body": body,
        };
        const fetchResponse = await fetch('/api/post/comment/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        });
        var data = await fetchResponse.json();
        let com = Object.create(commentObject);
        com.body = data.body;
        com.id = data._id;
        com.total_votes = data.total_votes;
        com.poster = data.poster;
        com.posterID = data.posterID;
        com.date = data.date;
        com.current_user_admin = true;
        com.display();
        comment_count.push(com.id);
        commentBodies.push(com.body);
    }
};
const comment_nested = async (postid, body, commentparentID) => {
    if (body != null && body != "") {
        let bodyJSON = {
            "id": postid,
            "body": body,
            "parentID": commentparentID
        };
        const fetchResponse = await fetch('/api/post/comment_nested/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        });
        var data = await fetchResponse.json();
        let upcomment = document.getElementById('fullCommentContainer_' + commentparentID);
        document.getElementById('comreplybox_' + commentparentID).outerHTML = "";
        document.getElementById('comreplySubmit_' + commentparentID).outerHTML = "";
        const comResponse = await fetch('/api/get/comment/' + postid + '/' + commentparentID);
        const comData = await comResponse.json();
        let com = Object.create(commentObject);
        com.body = comData.body;
        com.id = comData._id;
        com.total_votes = comData.total_votes;
        com.poster = comData.poster;
        com.posterID = comData.posterID;
        com.date = comData.date;
        com.users_voted = comData.users_voted;
        com.parentID = postid;
        com.nested_comments = comData.nested_comments;
        com.current_user_voted = comData.current_user_voted;
        com.current_user_admin = comData.current_user_admin;
        upcomment.innerHTML = "";
        com.display();
        window.scrollBy(0, 125);
    }
};
function ui_newPost() {
    if (window.innerWidth > 743 || window.location.pathname == '/post') {
        if (document.getElementById("newPost_div").style.display == 'block') {
            document.getElementById("newPost_div").style.display = 'none';
            document.getElementById("post-button").innerHTML = "Post";
            document.getElementById("newPost_logs").innerHTML = "";
            document.getElementById("newPost_topic").value = currentTopic;
        }
        else {
            document.getElementById("newPost_div").style.display = 'block';
            document.getElementById("searchbar").style.display = 'none';
            document.getElementById("post-button").innerHTML = "Collapse new post";
            document.getElementById("newPost_topic").value = currentTopic;
        }
    }
    else {
        window.location.href = '/post';
    }
}
if (['user', 'notifications', 'subscriptions', 'createpost'].indexOf(currentPageType) == -1) {
    document.getElementById("newPost_logs").innerHTML = "";
    document.getElementById("page-number").innerHTML = prevPageStr + "Page " + pageNumber + nextPageStr;
}
if (['search', 'subscriptions', 'home', 'post'].indexOf(currentPageType) != -1) {
    console.log("hiding");
    document.getElementById("newPost_div").style.display = 'none';
    document.getElementById("post-button").style.display = 'none';
}
if (['user', 'notifications', 'subscriptions'].indexOf(currentPageType) == -1) {
    document.getElementById("newPost_submit_button").onclick = function () {
        let postTitle = document.getElementById("newPost_name").value;
        if ((document.getElementById("newPost_topic").value).replace(" ", "") == "" || (document.getElementById("newPost_topic").value).replace(" ", "") == null || (document.getElementById("newPost_topic").value).replace(" ", "") == undefined) {
            topic = "all";
        }
        var myRegEx = /[^a-z\d]/i;
        topic = document.getElementById("newPost_topic").value;
        if ((myRegEx.test(topic))) {
            return document.getElementById("newPost_logs").innerHTML = "Please enter valid topic. No spaces or characters allowed.";
        }
        switch (newPost_type) {
            case 1:
                if (postTitle == "" || postTitle == null || !postTitle.replace(/\s/g, '').length) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title.";
                }
                else {
                    createNewPost(1);
                }
                break;
            case 2:
                if (postTitle == "" || postTitle == null) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title.";
                }
                else {
                    if (document.getElementById("newPost_link").value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) {
                        createNewPost(2);
                    }
                    else {
                        document.getElementById("newPost_logs").innerHTML = "Please enter valid URL.";
                    }
                }
                break;
            case 3:
                if (postTitle == "" || postTitle == null) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title.";
                }
                else {
                    createNewPost(3);
                }
                break;
        }
    };
    document.getElementById("newPost_type_text").onclick = function () {
        newPost_type = 1;
        document.getElementById("newPost_type_text").style.backgroundColor = "#070731";
        document.getElementById("newPost_type_text").style.color = "white";
        document.getElementById("newPost_type_link").style.backgroundColor = "";
        document.getElementById("newPost_type_media").style.backgroundColor = "";
        document.getElementById("newPost_desc").style.display = "block";
        document.getElementById("newPost_desc_label").style.display = "block";
        document.getElementById("newPost_link").style.display = "none";
        document.getElementById("newPost_link_label").style.display = "none";
        document.getElementById("newPost_file").style.display = "none";
        document.getElementById("newPost_file_label").style.display = "none";
        document.getElementById("newPost_submit_button").style.display = "block";
        document.getElementById("newPost_type_link").style.color = "black";
        document.getElementById("newPost_type_media").style.color = "black";
    };
    document.getElementById("newPost_type_link").onclick = function () {
        newPost_type = 2;
        document.getElementById("newPost_type_text").style.backgroundColor = "";
        document.getElementById("newPost_type_link").style.backgroundColor = "#070731";
        document.getElementById("newPost_type_link").style.color = "white";
        document.getElementById("newPost_type_media").style.backgroundColor = "";
        document.getElementById("newPost_link").style.display = "block";
        document.getElementById("newPost_link_label").style.display = "block";
        document.getElementById("newPost_desc").style.display = "none";
        document.getElementById("newPost_desc_label").style.display = "none";
        document.getElementById("newPost_file").style.display = "none";
        document.getElementById("newPost_file_label").style.display = "none";
        document.getElementById("newPost_submit_button").style.display = "block";
        document.getElementById("newPost_type_text").style.color = "black";
        document.getElementById("newPost_type_media").style.color = "black";
    };
    document.getElementById("newPost_type_media").onclick = function () {
        newPost_type = 3;
        document.getElementById("newPost_type_text").style.backgroundColor = "";
        document.getElementById("newPost_type_link").style.backgroundColor = "";
        document.getElementById("newPost_type_media").style.backgroundColor = "#070731";
        document.getElementById("newPost_type_media").style.color = "white";
        document.getElementById("newPost_desc").style.display = "none";
        document.getElementById("newPost_desc_label").style.display = "none";
        document.getElementById("newPost_link").style.display = "none";
        document.getElementById("newPost_link_label").style.display = "none";
        document.getElementById("newPost_file").style.display = "block";
        document.getElementById("newPost_file_label").style.display = "block";
        document.getElementById("newPost_submit_button").style.display = "none";
        document.getElementById("newPost_type_text").style.color = "black";
        document.getElementById("newPost_type_link").style.color = "black";
    };
    document.getElementById('newPost_file').addEventListener("change", ev => {
        const formdata = new FormData();
        formdata.append("image", ev.target.files[0]);
        uploadImage(formdata);
    });
}
if (currentPageType == 'post') {
    document.getElementById("newCom_submit").onclick = function () {
        comment();
        document.getElementById("newCom_body").value = "";
    };
}
const createNewPost = async (posttype) => {
    let title = document.getElementById("newPost_name").value;
    let body = document.getElementById("newPost_desc").value;
    let nsfw = document.getElementById("newPost_nsfw").checked;
    var myRegEx = /[^a-z\d]/i;
    let topic = document.getElementById("newPost_topic").value;
    let link = document.getElementById("newPost_link").value;
    let bodyJSON;
    if ((myRegEx.test(topic))) {
        return document.getElementById("newPost_logs").innerHTML = "Please enter valid topic. No spaces or characters allowed.";
    }
    if (topic == "" || topic == null) {
        topic = "all";
    }
    if (posttype == 1) {
        bodyJSON = {
            "title": title,
            "body": body,
            "topic": topic,
            "type": posttype,
            "nsfw": nsfw
        };
    }
    if (posttype == 2) {
        bodyJSON = {
            "title": title,
            "link": link,
            "topic": topic,
            "type": posttype,
            "nsfw": nsfw
        };
    }
    if (posttype == 3) {
        bodyJSON = {
            "title": title,
            "link": uploadedImageUrls.pop(),
            "delete_photo_link": uploadImageDeleteUrls.pop(),
            "topic": topic,
            "type": posttype,
            "nsfw": nsfw
        };
    }
    const fetchResponse = await fetch('/api/post/post', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(bodyJSON)
    });
    const data = await fetchResponse.json();
    if (data.code != 200) {
        document.getElementById('newPost_logs').innerHTML = data.error;
    }
    document.getElementById("newPost_name").innerHTML = "";
    document.getElementById("newPost_desc").innerHTML = "";
    document.getElementById("newPost_topic").innerHTML = "";
    document.getElementById("newPost_link").innerHTML = "";
    if (data.code == 200) {
        window.location.href = '/h/' + topic;
    }
};
const uploadImage = async (x) => {
    document.getElementById("newPost_logs").innerHTML = "Uploading...";
    const fetchResponse = await fetch('https://api.imgbb.com/1/upload?key=e23bc3a1c5f2ec99cc1aa7676dc0f3fb', {
        method: 'POST',
        body: x
    });
    const data = await fetchResponse.json();
    const url = (JSON.stringify(data.data.image.url)).replace(/["]+/g, '');
    uploadedImageUrls.push(url);
    document.getElementById("newPost_submit_button").style.display = "block";
    document.getElementById("newPost_logs").innerHTML = "";
};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    }
    else {
        mybutton.style.display = "none";
    }
}
var mybutton = document.getElementById("button_sendtotop");
window.onscroll = function () { scrollFunction(); };
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function prevPage() {
    curURL = window.location.href;
    curSearch = window.location.search;
    baseURL = curURL.replace(curSearch, "");
    if (pageNumber == 1) {
        return;
    }
    pageNumber -= 1;
    if (currentPageType != 'topic') {
        window.location.href = baseURL + "?sort=" + pagequeries.sort + "&t=" + pagequeries.t + "&page=" + pageNumber;
    }
    if (currentPageType == 'topic') {
        window.location.href = baseURL + "?sort=" + pagequeries.sort + "&t=" + pagequeries.t + "&page=" + pageNumber;
    }
    document.getElementById("page-number").innerHTML = prevPageStr + "Page " + pageNumber + nextPageStr;
}
function nextPage() {
    let curURL = window.location.href;
    let curSearch = window.location.search;
    let baseURL = curURL.replace(curSearch, "");
    pageNumber = pageNumber + 1;
    if (currentPageType != 'topic') {
        window.location.href = baseURL + "?sort=" + pagequeries.sort + "&t=" + pagequeries.t + "&page=" + pageNumber;
    }
    if (currentPageType == 'topic') {
        window.location.href = baseURL + "?sort=" + pagequeries.sort + "&t=" + pagequeries.t + "&page=" + pageNumber;
    }
    document.getElementById("page-number").innerHTML = prevPageStr + "Page " + pageNumber + nextPageStr;
}
const filter_nsfw = async () => {
    if (!isUserLoggedIn) {
        window.location.href = '/login';
    }
    let show = document.getElementById('filter_nsfw').checked;
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/filter_nsfw/' + show, settings);
    const data = await response.json();
    if (data.status == 'ok') {
        loadPosts("");
    }
    if (data.status == 'error') {
        alert(data.error);
    }
};
function search() {
    let query = document.getElementById("search_phrase").innerHTML;
    let topic = document.getElementById("search_topic").innerHTML;
}
document.getElementById("search_phrase").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("search_submit").click();
    }
});
document.getElementById("search_submit").onclick = function () {
    let query = document.getElementById("search_phrase").value;
    let topic = document.getElementById("search_topic").value;
    query.split(" ").join("+");
    query = (query.split(" ")).join("+");
    if (topic) {
        window.location.href = "/search/?topic=" + topic + "?query=" + query;
    }
    else {
        window.location.href = "/search/?query=" + query;
    }
};
