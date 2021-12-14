let newPost_type = 1 // By default, creating a new post creates a text post, 1=text, 2=link, 3=media
let uploadedImageUrls = [] // This is used to store the URLs of recently uploaded images
let prevPageStr = "<a href='javascript:prevPage()' style='color: white; text-decoration: none;'> ⇐ </a>" // These two are used for quickly inserting the next-page and prev-page text
let nextPageStr = "<a href='javascript:nextPage()' style='color: white; text-decoration: none;'> ⇒ </a>"
let comment_count = [] // Used to track how many comments are being displayed on a page (maybe remove later)
let commentBodies = [] // used to remember comment bodies that are removed when a post is temporarily collapsed by the user
let lastClick = 0; // These two are used to prevent vote-mashing of posts and comments by placing a delay of Xms
var delay = 400;
let pageNumber = 1 // Tracking what page number the user is on
let currentTopic = "" // Current topic the user is on, i.e. 'bicycling'
let currentPostID = "" // Current post ID that is loaded, only when on a user page such as http://localhost:3000/posts/61ab8741f6fadead68120454
let isUserLoggedIn = false // Checks if a user is logged in or not. Not required for access unless enabled in backend
let sorting = window.location.href.split('/')[4]
let sorting_duration = window.location.href.split('/')[5]
console.log(sorting, sorting_duration)

const pageTypes = [ 'user', 'usersheet', 'topic', 'index', 'all', 'post', 'login', 'register',] // This is used to track what page type we are on

let currentPageCategory = (window.location.href).split('/')[3] // Used to find the category where we are, i.e. 'localhost:3000/user' -> 'user'
switch (currentPageCategory) {
    case 'user':
        cPageTypeIndex = 0
        break;
    case 'users':
        cPageTypeIndex = 1
        break;
    case ('h'):
        cPageTypeIndex = 2
        break;
    case '':
        cPageTypeIndex = 3
        break;
    case 'all':
        cPageTypeIndex = 4
        break;
    case 'posts':
        cPageTypeIndex = 5
        break;
    case 'login':
        cPageTypeIndex = 6
        break;
    case 'register':
        cPageTypeIndex = 7
        break;
}

let currentPageType = pageTypes[cPageTypeIndex]

if (currentPageType == 'user') { 
    
}
if (currentPageType == 'usersheet') { 
    
}
if (currentPageType == 'topic') { 
    pageNumber = parseInt(window.location.href.split('/')[7])
    sorting = window.location.href.split('/')[5]
    sorting_duration = window.location.href.split('/')[6]
}
if (currentPageType == 'index') { 
    
}
if (currentPageType == 'all') {    
    pageNumber = parseInt(window.location.href.split('/')[6])
}
if (currentPageType == 'post') { 
    pageNumber = 1
}
if (currentPageType == 'login') { 
    
}
if (currentPageType == 'register') { 
    
}

if (currentPageType == 'login' || currentPageType == 'register') { // If the user is on certain pages, hide the header-buttons bar as it's unneeded on that page or may cause issues
    document.getElementById('header-buttons').style.display = 'none'
} else {
    document.getElementById('header-buttons').style.display = 'flex'
}

switch (sorting) {
    case "top":
        switch (sorting_duration) {
            case "day":
                document.getElementById('sorting_options_top_today').style.color = '#0066ff'
                document.getElementById('sorting_options_top_today').style.fontWeight = '700'
                break;
            case "week":
                document.getElementById('sorting_options_top_week').style.color = '#0066ff'
                document.getElementById('sorting_options_top_week').style.fontWeight = '700'
                break;
            case "all":
                document.getElementById('sorting_options_top_all').style.color = '#0066ff'
                document.getElementById('sorting_options_top_all').style.fontWeight = '700'
                break;
        }
        break;
    case "new": 
        document.getElementById('sorting_options_new').style.color = '#0066ff'
        document.getElementById('sorting_options_new').style.fontWeight = '700'
        break;
}

document.getElementById('sorting_options_top_today').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options')
    for (let i=0;i<sortingOptions.length;i++) {
        sortingOptions[i].style.color = 'white'
        sortingOptions[i].style.fontWeight = '300'
    }
    sorting = "top"
    sorting_duration = "day"
    document.getElementById('sorting_options_top_today').style.color = '#0066ff'
    document.getElementById('sorting_options_top_today').style.fontWeight = '700'
    if (currentPageType == "topic") {
        window.location.href = '/'+window.location.href.split('/')[3]+'/'+window.location.href.split('/')[4]+'/top/day/1'
    } else {
        window.location.href = '/'+window.location.href.split('/')[3]+'/top/day/1'
    }
    
});
document.getElementById('sorting_options_top_week').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options')
    for (let i=0;i<sortingOptions.length;i++) {
        sortingOptions[i].style.color = 'white'
        sortingOptions[i].style.fontWeight = '300'
    }
    sorting = "top"
    sorting_duration = "week"
    document.getElementById('sorting_options_top_week').style.color = '#0066ff'
    document.getElementById('sorting_options_top_week').style.fontWeight = '700'
    if (currentPageType == "topic") {
        window.location.href = '/'+window.location.href.split('/')[3]+'/'+window.location.href.split('/')[4]+'/top/week/1'
    } else {
        window.location.href = '/'+window.location.href.split('/')[3]+'/top/week/1'
    }
    
});

document.getElementById('sorting_options_top_month').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options')
    for (let i=0;i<sortingOptions.length;i++) {
        sortingOptions[i].style.color = 'white'
        sortingOptions[i].style.fontWeight = '300'
    }
    sorting = "top"
    sorting_duration = "month"
    document.getElementById('sorting_options_top_month').style.color = '#0066ff'
    document.getElementById('sorting_options_top_month').style.fontWeight = '700'
    if (currentPageType == "topic") {
        window.location.href = '/'+window.location.href.split('/')[3]+'/'+window.location.href.split('/')[4]+'/top/week/1'
    } else {
        window.location.href = '/'+window.location.href.split('/')[3]+'/top/month/1'
    }  
});
document.getElementById('sorting_options_top_all').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options')
    for (let i=0;i<sortingOptions.length;i++) {
        sortingOptions[i].style.color = 'white'
        sortingOptions[i].style.fontWeight = '300'
    }
    sorting = "top"
    sorting_duration = "all"
    document.getElementById('sorting_options_top_all').style.color = '#0066ff'
    document.getElementById('sorting_options_top_all').style.fontWeight = '700'
    if (currentPageType == "topic") {
        window.location.href = '/'+window.location.href.split('/')[3]+'/'+window.location.href.split('/')[4]+'/top/all/1'
    } else {
        window.location.href = '/'+window.location.href.split('/')[3]+'/top/all/1'
    }
    
});
document.getElementById('sorting_options_new').addEventListener('click', function (event) {
    sortingOptions = document.getElementsByClassName('sorting_options')
    for (let i=0;i<sortingOptions.length;i++) {
        sortingOptions[i].style.color = 'white'
        sortingOptions[i].style.fontWeight = '300'
    }
    sorting = "new"
    sorting_duration = "all"
    document.getElementById('sorting_options_new').style.color = '#0066ff'
    document.getElementById('sorting_options_new').style.fontWeight = '700'
    if (currentPageType == "topic") {
        window.location.href = '/'+window.location.href.split('/')[3]+'/'+window.location.href.split('/')[4]+'/new/all/1'
    } else {
        window.location.href = '/'+window.location.href.split('/')[3]+'/new/all/1'
    }
});

// The randomize function is for creating bulk posts, takes a value (x) which is the quantity of posts to be created, no limit
async function randomizer(x) {
    for(let i=0;i<x;i++) {
        title = "test "+i
        body = "mpwknd199999999" // This string is really only for tracking which posts are test posts. Can be changed but must be changed on BE too
        if (i % 2 == 0) {
            topic = "testinggrounds"
        } else {
            topic = "all"
        }
        
        posttype = 1
        bodyJSON = {
            "title":title,
            "body":body,
            "topic":topic,
            "type":posttype
        }
        
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

// This getUser function is for getting the current user and displaying relevant buttons and the users name
const getUser = async () => {
    //document.getElementById("currentUser").innerHTML = "..."
    const response = await fetch('/api/get/currentuser/')
    const data = await response.json()
    
    if (data.code == 400) { // Error code for 'no user logged in' or 'invalid JWT token'
        isUserLoggedIn = false
        document.getElementById("currentUser").innerHTML = "Account"
        document.getElementById("logout_button").style.display = 'none'
        document.getElementById("login_button").style.display = 'block'
        document.getElementById("reg_button").style.display = 'block'
        document.getElementById("post-button").style.display = 'none'
    } else {
        currentUserID = data.id
        isUserLoggedIn = true
        document.getElementById("currentUser").innerHTML = data.name
        document.getElementById("logout_button").style.display = 'block'
        document.getElementById("login_button").style.display = 'none'
        document.getElementById("reg_button").style.display = 'none'
        if (currentPageType != 'user' && currentPageType != 'usersheet' ) {
            console.log(currentPageType)
            document.getElementById("post-button").style.display = 'block'
        }
        
    }
    
    changeCommentSectionVisibility()
}

getUser()

// This changeCommentSectionVisibility function is for changing whether or not the commentSection div should be visible, which is only on posts.
// ... it should also be displayed differently if the user is logged in or not as they may not be able to write a comment
function changeCommentSectionVisibility() {
    if (currentPageType == 'post') {
        document.getElementById('commentSection').style.display = 'inline'
        if (isUserLoggedIn) {
            document.getElementById('commentSection_login_button').style.display = 'none'
            document.getElementById('newCom_body').style.display = 'block'
            document.getElementById('newCom_submit').style.display = 'block'
        } else {
            document.getElementById('commentSection_login_button').style.display = 'block'
            document.getElementById('newCom_body').style.display = 'none'
            document.getElementById('newCom_submit').style.display = 'none'
        }
    } else {
        if (document.getElementById('commentSection')) {
            document.getElementById('commentSection').style.display = 'none'
        }
    }
}

const postObject = {
    type: "",
    title: "",
    body: "",
    descDisplayed: "", // Whether or not the description of the post is currently displayed, for collapsing and expanding
    total_votes: "", // Upvotes - Downvotes
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
    comment_count: "",
    poster_avatar_src: "",

    display() {
        var postContainer = document.createElement("div")
        postContainer.setAttribute("class","postContainer")
        postContainer.setAttribute("id","postContainer_"+this.id)

        var postFrame = document.createElement("table")
        postFrame.setAttribute("id", "postFrame_"+this.id)
        postFrame.setAttribute("class", "postFrame")

        var voteFrame = document.createElement("table")
        voteFrame.setAttribute("class", "voteFrame")

        var voteDiv = document.createElement("div")
        voteDiv.setAttribute("id", "voteDiv_"+this.id)
        voteDiv.setAttribute("class", "voteDiv")

        var openPostButton = document.createElement("img")
        openPostButton.setAttribute("id", "openPostButton_"+this.id)
        openPostButton.setAttribute("class", "openPostButton")
        openPostButton.innerHTML = "<a href='/posts/"+this.id+"'></a>"
        openPostButton.src = '/assets/speech_bubble.png'
        openPostButton.onclick = function() {
            window.location.href = '/posts/'+this.id.substring(15)
        }   
        openPostButton.style.width = 'auto'

        commentCountIncludingNested = 0
        for (let i=0;i<this.comments.length;i++) {
            commentCountIncludingNested++
            commentCountIncludingNested += this.comments[i].nested_comments.length
        }

        var commentCount = document.createElement("div")
        commentCount.innerHTML = "("+commentCountIncludingNested+")"
        commentCount.setAttribute("class", "commentCount")

        var voteCount = document.createElement("div")
        voteCount.setAttribute("id","voteCount_"+this.id)
        voteCount.setAttribute("class","voteCount")
        voteCount.innerHTML = this.total_votes

        var voteUpButton = document.createElement("img")
        voteUpButton.setAttribute("id","voteUpButton_"+this.id)
        voteUpButton.setAttribute("class","voteUpButton")
        voteUpButton.src = '/assets/up.gif'
        if (this.current_user_upvoted) {
            voteUpButton.src = '/assets/up_selected.gif'
        } 
        
        voteUpButton.style.width = 'auto'
        voteUpButton.onclick = function() {
            vote(1, this.id)
        }

        var voteDownButton = document.createElement("img")
        voteDownButton.setAttribute("id","voteDoButton_"+this.id)
        voteDownButton.setAttribute("class","voteDoButton")
        voteDownButton.src = '/assets/down.gif'
        if (this.current_user_downvoted) {
            voteDownButton.src = '/assets/down_selected.gif'
        }
        voteDownButton.style.width = 'auto'
        voteDownButton.onclick = function() {
            vote(-1, this.id)
        }
         
        var title = postFrame.insertRow(0)
        var info = postFrame.insertRow(1)
        
        var titleCell = title.insertCell(0)
        var infoCell = info.insertCell(0)

        titleCell.setAttribute("id","titleCell_"+this.id)
        titleCell.setAttribute("class","titleCell")
        infoCell.setAttribute("id", "info_"+this.id)
        infoCell.setAttribute("class", "infoCell")

        href = this.topic.replace(/^"(.*)"$/, '$1');
        
        infoCell.innerHTML = "Submitted by "+"<a href='/user/"+this.poster+"'><img src='"+this.poster_avatar_src+"' class='avatarimg'>  <span style='color:blue'>"+this.poster+"</span> </a>in "+"<span style='color:blue; font-weight: 900;'><a href='/h/"+href+"'>"+this.topic+"</a></span>  on " +this.date

        var desc = postFrame.insertRow(2)
        var descCell = desc.insertCell(0)
        descCell.setAttribute("id","descCell_"+this.id)
        descCell.setAttribute("class", "descCell")

        titleCell.innerHTML = this.title

        if (this.type == "3") {
            var imgThumbDiv = document.createElement('div')
            imgThumbDiv.setAttribute("class", "postImgThumbDiv")
            imgThumbDiv.setAttribute("id", "postImgThumbDiv_"+this.id)
            var imgThumb = document.createElement('img')
            imgThumb.setAttribute("class", "postImgThumb")
            imgThumb.setAttribute("id", "postImgThumb_"+this.id)
            imgThumb.src = this.link
            descCell.innerHTML = "<img src='"+this.link+"' class='"+"postPhoto' id='postPhoto_"+this.id+"' width='100%'>"
            descCell.style.width = '99%'
            descCell.style.display = 'none'
            titleCell.innerHTML = "🖼        "+this.title+"<span style='font-size:12px'>        (+)</span>"
        }

        if (this.body != "(empty)") {
            descCell.innerHTML = this.body
            descCell.style.display = 'none'
            titleCell.innerHTML = this.title+"<span style='font-size:12px'>        (+)</span>"  
        } 

        if (this.type == "2") {
            let domain = (new URL(this.link));
            domain = domain.hostname.replace('www.','');
            titleCell.innerHTML = "🔗       <a href='" + this.link +"'>"+this.title+"</a> <span style='font-size: 10px'>("+domain+"...)</span>"
        }
        
        titleCell.onclick = function() {
            if (this.body != "(empty)") {
                expandDesc(this.id.split("_")[1])
            } 
        }
        if (this.type == "3") {
            imgThumbDiv.onclick = function() {
                if (this.body != "(empty)") {
                    expandDesc(this.id.split("_")[1])
                } 
            }
        }
    
        if (this.current_user_admin) {
            var del = document.createElement("img")
            del.setAttribute("class", "deletePostButton")
            del.setAttribute("id", "deletePostButton_"+this.id)
            del.src = "/assets/trash.png"
            del.style.height = '20px'
            del.style.width = 'auto'
            delPostConfirmation = false
            
            
            del.onclick = function() {
                if (delPostConfirmation) {
                    if (delPostConfirmationId == this.id.split("_")[1]) {
                        deletePost(this.id.split("_")[1])
                    } else {
                        this.src = "/assets/trash_confirm.png"
                        delPostConfirmation = true
                        delPostConfirmationId = this.id.split("_")[1]
                    }
                    
                } else {
                    this.src = "/assets/trash_confirm.png"
                    delPostConfirmation = true
                    delPostConfirmationId = this.id.split("_")[1]
                }
                
            }
        }

        if (currentPageType == 'user') {
            document.getElementById("page-profile-posts").appendChild(postContainer)
        } else {
            document.getElementById("postsArray").appendChild(postContainer)
        }
        
        document.getElementById("postContainer_"+this.id).appendChild(postFrame)
        
        if (this.type == "3") {
            document.getElementById("postFrame_"+this.id).appendChild(imgThumbDiv)
            document.getElementById("postImgThumbDiv_"+this.id).appendChild(imgThumb)
        }
        document.getElementById("postContainer_"+this.id).appendChild(voteDiv)
        document.getElementById("voteDiv_"+this.id).appendChild(voteCount)
        document.getElementById("voteDiv_"+this.id).appendChild(voteUpButton)
        document.getElementById("voteDiv_"+this.id).appendChild(voteDownButton)
        document.getElementById("voteDiv_"+this.id).appendChild(openPostButton)
        document.getElementById("voteDiv_"+this.id).appendChild(commentCount)
        if (this.current_user_admin) {
            document.getElementById("voteDiv_"+this.id).appendChild(del)
        }
    }
}

const commentObject = {
    body: "",
    id: "",
    nested_comments: [],
    parentID:"",
    total_votes: "",
    users_voted:[],
    poster: "",
    posterID: "",
    date: "",
    current_user_voted: "",
    current_user_admin: "",
    reply_button_shown: false,
    
    display() {
        
        var fullCommentContainer = document.createElement("div")
        fullCommentContainer.setAttribute("id", "fullCommentContainer_"+this.id)
        if (currentPageType != 'user') { // not on a user profile page
            console.log("creating cmt sec")
            document.getElementById("comments").appendChild(fullCommentContainer)
        } else {
            document.getElementById("page-profile-comments").appendChild(fullCommentContainer)
        }
        
        var comFrame = document.createElement("table")
        comFrame.setAttribute("class", "comFrame")
        comFrame.setAttribute("id", "comFrame_"+this.id)
        document.getElementById("fullCommentContainer_"+this.id).appendChild(comFrame)
        

        posterRow = comFrame.insertRow(0)
        posterRow.setAttribute("id", "posterRow_"+this.id)
        posterRow.setAttribute("class", "posterRow")
        posterCell = posterRow.insertCell(0)
   
        infoRow = comFrame.insertRow(1)
        infoCell = infoRow.insertCell(0)
        infoCell.innerHTML = this.date
        infoCell.setAttribute("class","comInfoCell")
        infoCell.setAttribute("id", "comInfoCell_"+this.id)

        if (this.current_user_admin) {
            var del = document.createElement("img")
            del.setAttribute("class", "deletePostButton")
            del.setAttribute("id", "deletePostButton_"+this.id)
            del.src = "/assets/trash.png"
            del.style.height = '20px'
            del.style.width = 'auto'
            del.style.paddingLeft = '10px'
            del.style.marginBottom = '-5px'
            delPostConfirmation = false
            
            del.onclick = function() {
                if (delPostConfirmation) {
                    if (delPostConfirmationId == this.id.split("_")[1]) {
                        //deletePost(this.id.split("_")[1])
                        deleteComment(this.id.split("_")[1])
                    } else {
                        this.src = "/assets/trash_confirm.png"
                        delPostConfirmation = true
                        delPostConfirmationId = this.id.split("_")[1]
                    }
                    
                } else {
                    this.src = "/assets/trash_confirm.png"
                    delPostConfirmation = true
                    delPostConfirmationId = this.id.split("_")[1]
                }
                
            }
        }
        if (this.current_user_admin) {
            document.getElementById("comInfoCell_"+this.id).appendChild(del)
        }

        bodyRow = comFrame.insertRow(2)
        bodyCell = bodyRow.insertCell(0)

        posterCell.innerHTML = "<span style='color:blue'>"+this.poster + "</span> says: (-)"
        posterCell.setAttribute("id","posterCell_"+this.id)
        

        bodyCell.innerHTML = this.body
        bodyCell.setAttribute("class", "bodyCell")
        bodyCell.setAttribute("id", "bodyCell_"+this.id)

        var ncDiv = document.createElement("div")
        ncDiv.setAttribute("class", "ncDiv")
        ncDiv.setAttribute("id", "ncDiv_"+this.id)
        
        var ncContainer = document.createElement("div")
        ncContainer.setAttribute("class", "ncContainer")
        ncContainer.setAttribute("id", "ncContainer_"+this.id)
        document.getElementById("fullCommentContainer_"+this.id).appendChild(ncContainer)

        for (let i=0;i<this.nested_comments.length;i++) {
            var ncDiv = document.createElement("div")
            ncDiv.setAttribute("class", "ncDiv")
            ncDiv.setAttribute("id", "ncDiv_"+this.nested_comments[i].id)
            var ncCommentDiv = document.createElement("div")
            ncCommentDiv.setAttribute("class", "ncCommentDiv")
            ncCommentDiv.setAttribute("id", "ncCommentDiv_"+this.nested_comments[i].id)
            ncCommentDiv.innerHTML += "<span style='color:blue'>"+this.nested_comments[i].poster + "</span>: "+this.nested_comments[i].body+"<br/>"+"<span style='font-size:10px'>"+this.nested_comments[i].date+"</span>"

            // var ncDate = document.createElement("div")
            // ncDate.innerHTML = this.nested_comments[i].date
            // ncDate.setAttribute("class", "ncInfoCell")
            
            var ncVoteDiv = document.createElement("div")
            ncVoteDiv.setAttribute("class", "ncVoteDiv")
            ncVoteDiv.setAttribute("id", "ncVoteDiv_"+this.nested_comments[i].id)
    
            var voteCount = document.createElement("div")
            voteCount.setAttribute("id","comnestedVoteCount_"+this.nested_comments[i].id)
            voteCount.setAttribute("class","comnestedVoteCount")
            voteCount.innerHTML = this.nested_comments[i].total_votes
    
            var voteUp = document.createElement("img")
            voteUp.setAttribute("id","nestedcommentUp_"+this.nested_comments[i].id+"_"+this.id)
            voteUp.setAttribute("class","nestedcommentUp")
            if (this.nested_comments[i].current_user_voted) {
                voteUp.src = '/assets/up_selected.gif'
            } else {
                voteUp.src = '/assets/up.gif'
            }
            
            voteUp.style.width = 'auto'
            voteUp.onclick = function() {
                voteCom(this.id.split("_")[1], currentPostID, true, this.id.split("_")[2])
            }

            

            
            document.getElementById("ncContainer_"+this.id).appendChild(ncDiv)
            // document.getElementById("ncContainer_"+this.id).appendChild(ncDate)
            document.getElementById("ncDiv_"+this.nested_comments[i].id).appendChild(ncCommentDiv)
            document.getElementById("ncDiv_"+this.nested_comments[i].id).appendChild(ncVoteDiv)
            document.getElementById("ncVoteDiv_"+this.nested_comments[i].id).appendChild(voteCount)
            document.getElementById("ncVoteDiv_"+this.nested_comments[i].id).appendChild(voteUp)
        }




        posterRow.onclick = function() {
            var id = this.id.substring(10)
            var body = document.getElementById("bodyCell_"+id)
            var poster = document.getElementById("posterCell_"+id).innerHTML.split(" says")[0]
            if (body.innerHTML == "") {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> says: (-)"
                body.innerHTML = commentBodies[comment_count.indexOf(parseInt(id))]
                // if (!document.getElementById('ncDiv_'+id).innerHTML == "") {
                //     ncDiv.style.display = 'block'
                // }
                ncContainer.style.display = 'block'


                
            } else {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> says: (+)"
                var x = document.getElementById("bodyCell_"+this.id.substring(10))
                x.innerHTML = ""
                ncContainer.style.display = 'none'
            }
            
        }
        if (this.nested_comments.length == 0) {
            ncContainer.style.display = 'none'
        }

        var replyDiv = document.createElement("div")
        replyDiv.setAttribute("class", "comreplyDiv")
        replyDiv.setAttribute("id", "comreplyDiv_"+this.id)
        replyDiv.style.display = 'none'
        var replyBox = document.createElement("textarea")
        replyBox.setAttribute("class", "comreplybox")
        replyBox.setAttribute("id", "comreplybox_"+this.id)
        replyBox.setAttribute("rows", "2")
        replyBox.style.width = '75%'
        replyBox.style.maxWidth = '500px'
        var replySubmit = document.createElement("button")
        replySubmit.setAttribute("class", "comreplySubmit")
        replySubmit.setAttribute("id", "comreplySubmit_"+this.id)
        replySubmit.innerText = "Submit reply"
        replySubmit.onclick = function(parentID) {
            parentID = window.location.href.split('/posts/')[1]
            body = document.getElementById('comreplybox_'+this.id.split('_')[1]).value
            comment_nested(parentID, document.getElementById('comreplybox_'+this.id.split('_')[1]).value, this.id.split('_')[1])
            document.getElementById('comreplybox_'+this.id.split('_')[1]).value = ""
            document.getElementById("comreplyDiv_"+this.id.split("_")[1]).style.display = 'none'
        }
        
        var replyButton = document.createElement('img')
        replyButton.setAttribute("class","comreplybutton")
        replyButton.setAttribute("id", "comreplyButton_"+this.id)
        replyButton.src = '/assets/speech_bubble.png'
        infoRow.appendChild(replyButton)
        
        replyButton.onclick = function() {
            if (this.reply_button_shown) {
                document.getElementById("comreplyDiv_"+this.id.split("_")[1]).style.display = 'none'
                this.reply_button_shown = false
            } else {
                document.getElementById("comreplyDiv_"+this.id.split("_")[1]).style.display = 'flex'
                document.getElementById("comreplyDiv_"+this.id.split("_")[1]).style.flexDirection = 'row'
                this.reply_button_shown = true
            }
        }

        var voteDiv = document.createElement("div")
        voteDiv.setAttribute("id", "voteDiv_"+this.id)
        voteDiv.setAttribute("class", "comVoteDiv")

        var voteCount = document.createElement("div")
        voteCount.setAttribute("id","voteCount_"+this.id)
        voteCount.setAttribute("class","comVoteCount")
        voteCount.innerHTML = this.total_votes

        var voteUp = document.createElement("img")
        voteUp.setAttribute("id","voteComUp_"+this.id)
        voteUp.setAttribute("class","voteUpButton")
        if (this.current_user_voted == true) {
            voteUp.src = '/assets/up_selected.gif'
        } else {
            voteUp.src = '/assets/up.gif'
        }
        
        voteUp.style.width = 'auto'
        voteUp.onclick = function() {
            voteCom(this.id.substring(10), currentPostID, false, 0)
        }

        

        document.getElementById("comFrame_"+this.id).appendChild(voteDiv)
        document.getElementById("comments").appendChild(replyDiv)
        
        
        document.getElementById("comreplyDiv_"+this.id).appendChild(replyBox)
        document.getElementById("comreplyDiv_"+this.id).appendChild(replySubmit)
        document.getElementById("voteDiv_"+this.id).appendChild(voteCount)
        document.getElementById("voteDiv_"+this.id).appendChild(voteUp)

        
    }
}

const deletePost = async(x) => {
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/post/delete/'+x, settings)
    const data = await response.json()

    if (data.status == 'ok') {
        document.getElementById("postContainer_"+x).innerHTML = "<span style='color:white'>The post was permanantly deleted.</span>"
    }
    if (data.status == 'error') {
        alert(data.error)
    }
}

const deleteComment = async(x) => {
    const settings = {
        method: 'PUT',
    };
    const response = await fetch('/api/put/comment/delete/'+window.location.href.split('/posts/')[1]+'/'+x, settings)
    const data = await response.json()

    if (data.status == 'ok') {
        document.getElementById("fullCommentContainer_"+x).innerHTML = "<span style='color:white'>The comment was permanantly deleted.</span>"
    }
    if (data.status == 'error') {
        alert(data.error)
    }

}

const loadPosts = async (topic) => {
    if (currentPageType == 'user') {
        user = window.location.href.split('/').pop()
        return loadUserPage(user)
    }
    getUser()
    
    if (topic == null || topic == "") {
        topic = "all"
    }

    if (currentPageType == 'topic') {
        currentPageCategory = window.location.href
        topic = currentPageCategory.split('/')[4]
    }

    if (currentPageType == 'post') { // on a specific post page, load only that one post & comments
        url = window.location.href
        postid = url.split('/posts/')[1]
        const response = await fetch('/api/get/posts/'+postid)
        const data = await response.json()
        if (data.status != "ok") {
            if (data.status == "error") {
                window.location.href = '/login'
            }
        }
        document.getElementById("postsArray").innerHTML = ""
        if (data.length == 0 || data.error == 'No post found') {
            document.getElementById("postsArray").innerHTML = "<span style='color:white'>No post found. It may have been deleted. </span>"
        } else {
            let post = Object.create(postObject)
            post.title = data.title
            post.body = data.body
            if (post.body == "" || post.body == undefined || post.body == null) {
                post.body = "(empty)"
            }
            post.total_votes = data.total_votes
            post.upvotes = data.upvotes
            post.downvotes = data.downvotes
            post.id = data._id
            post.poster = data.poster
            post.poster_avatar_src = data.posterAvatarSrc
            post.date = data.date
            post.descDisplayed = false
            post.link = data.link
            post.type = data.type // 1=text, 2=link, 3=media
            post.topic = data.topic
            post.comment_count = data.comments.length
            post.comments = data.comments

            post.current_user_upvoted = data.current_user_upvoted
            post.current_user_downvoted = data.current_user_downvoted
            post.current_user_admin = data.current_user_admin

            post.display()
            expandDesc(post.id)
            currentPostID = post.id
            for (let i=0;i<data.comments.length;i++) {
                let com = Object.create(commentObject)
                com.body = data.comments[i].body
                com.id = data.comments[i]._id
                com.total_votes = data.comments[i].total_votes
                com.poster = data.comments[i].poster
                com.posterID = data.comments[i].posterID
                com.date = data.comments[i].date
                com.users_voted = data.comments[i].users_voted
                com.parentID = currentPostID
                com.nested_comments = data.comments[i].nested_comments

                com.current_user_voted = data.comments[i].current_user_voted
                com.current_user_admin = data.comments[i].current_user_admin
                com.display()
                
                comment_count.push(com.id)
                commentBodies.push(com.body)
            }
            
            topFunction()
            storeAndDisplayTopics()

        }
    } else {
        request = '/api/get/'+topic+'/'+sorting +'/'+ sorting_duration+'/'+ pageNumber

        if (currentPageType == 'all') {
            request = '/api/get/'+topic+'/'+sorting +'/'+ sorting_duration+'/'+pageNumber
        }
        if (currentPageType == 'topic') {
            request = '/api/get/'+topic+'/'+sorting +'/'+ sorting_duration+'/'+pageNumber
        }
        const response = await fetch(request)
        const data = await response.json()

        document.getElementById("postsArray").innerHTML = ""
        if (data.length == 0) {
            document.getElementById("postsArray").innerHTML = "<span style='color:white'>No posts... yet!</span>"
        }

        for(let i=0; i < data.length;i++) {
            let post = Object.create(postObject)
            post.title = data[i].title
            post.body = data[i].body
            if (post.body == "" || post.body == undefined || post.body == null) {
                post.body = "(empty)"
            }
            post.total_votes = data[i].total_votes
            post.upvotes = data[i].upvotes
            post.downvotes = data[i].downvotes
            post.id = data[i]._id
            post.poster = data[i].poster
            post.poster_avatar_src = data[i].posterAvatarSrc
            post.date = data[i].date
            post.descDisplayed = false
            post.link = data[i].link
            post.type = data[i].type // 1=text, 2=link, 3=media
            post.topic = data[i].topic
            post.comment_count = data[i].comments.length
            post.comments = data[i].comments
            

            post.current_user_upvoted = data[i].current_user_upvoted
            post.current_user_downvoted = data[i].current_user_downvoted
            post.current_user_admin = data[i].current_user_admin

            post.display()
        }
        
        topFunction()
        storeAndDisplayTopics()
    }

    currentTopic = topic
}

const loadUserPage = async(user) => {
    const response = await fetch('/api/get/posts/user/'+user)
    const data = await response.json()

    document.getElementById("page-profile-posts").innerHTML = ""
    if (data.length == 0) {
        document.getElementById("page-profile-posts").innerHTML = "<div style='color:white'>No posts... yet!</div>"
    }
    for (let i=0; i<data.length ; i++) {
        let post = Object.create(postObject)
        post.title = data[i].title
        post.body = data[i].body
        if (post.body == "" || post.body == undefined || post.body == null) {
            post.body = "(empty)"
        }
        post.total_votes = data[i].total_votes
        post.upvotes = data[i].upvotes
        post.downvotes = data[i].downvotes
        post.id = data[i]._id
        post.poster = data[i].poster
        post.date = data[i].date
        post.descDisplayed = false
        post.link = data[i].link
        post.type = data[i].type // 1=text, 2=link, 3=media
        post.topic = data[i].topic
        post.comment_count = data[i].comments.length
        post.comments = data[i].comments
        post.poster_avatar_src = data[i].posterAvatarSrc

        post.current_user_upvoted = data[i].current_user_upvoted
        post.current_user_downvoted = data[i].current_user_downvoted
        post.current_user_admin = data[i].current_user_admin

        post.display()
    }
    topFunction()
    storeAndDisplayTopics()
}

function expandDesc(x) {
    y = "descCell_"+x
    mediaPost = false
    if (document.getElementById('postImgThumb_'+x)){
        if (document.getElementById('postImgThumb_'+x).src != null) {
            console.log(document.getElementById('postImgThumb_'+x).src)
            mediaPost = true
        }
    }
        
    
    title = document.getElementById("titleCell_"+x).innerHTML.replace('<span style="font-size:12px">        (+)</span>', '').replace('<span style="font-size:12px">        (-)</span>','')
    if (document.getElementById(y).innerHTML != "" && document.getElementById(y).innerHTML != null) {
        if (document.getElementById(y).style.display == 'block') {
            document.getElementById(y).style.display = 'none'
            document.getElementById("titleCell_"+x).innerHTML = title + "<span style='font-size:12px'>        (+)</span>"
            if (mediaPost) {
                document.getElementById('postImgThumb_'+x).style.display = 'block'
            }
        } else {
            document.getElementById(y).style.display = 'block'
            document.getElementById("titleCell_"+x).innerHTML = title + "<span style='font-size:12px'>        (-)</span>"
            if (mediaPost) {
                document.getElementById('postImgThumb_'+x).style.display = 'none'
            }
        }
    }
}

const storeAndDisplayTopics = async () => {
    document.getElementById("topic-dropdown").innerHTML = ""
    const response = await fetch('/api/get/topics/')
    var data = await response.json()

    if (data.length <= 1) {
        document.getElementById('topic-dropdown-div').style.display = 'none'
        document.getElementById('topic-dropdown-div').style.borderRight = '0px solid black'
    } else {
        document.getElementById('topic-dropdown-div').style.display = 'block'
        document.getElementById('topic-dropdown-button').style.display = 'block'
        if (data.length > 10) {
            topics = 10
        } else {
            topics = data.length
        }
        for (j=0;j<topics;j++) {
            var newTopic = document.createElement('a')
            href = data[j][0].replace(/^"(.*)"$/, '$1');
            newTopic.innerHTML = "<a href='/h/"+href+"'>"+data[j][0]+"("+data[j][1]+")</a>"
            document.getElementById("topic-dropdown").appendChild(newTopic)
        }
    }

    
}

const vote = async (change, id) => { 
    if (lastClick >= (Date.now() - delay)) {
        return;
    }
    lastClick = Date.now();

    const settings = {
        method: 'PUT',
    };

    const fetchResponse = await fetch('/vote/'+id+'/'+change, settings); 
    const data = await fetchResponse.json()

    if (data.status == 'ok') {
        document.getElementById('voteCount_'+id.substring(13)).innerHTML = data.newtotal
        if (data.gif == 'none') {
            document.getElementById('voteUpButton_'+id.substring(13)).src = '/assets/up.gif'
            document.getElementById('voteDoButton_'+id.substring(13)).src = '/assets/down.gif'
        }
        if (data.gif == 'up') {
            document.getElementById('voteUpButton_'+id.substring(13)).src = '/assets/up_selected.gif'
            document.getElementById('voteDoButton_'+id.substring(13)).src = '/assets/down.gif'
        }
        if (data.gif == 'down') {
            document.getElementById('voteUpButton_'+id.substring(13)).src = '/assets/up.gif'
            document.getElementById('voteDoButton_'+id.substring(13)).src = '/assets/down_selected.gif'
        }
    } 

    if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
        window.location.href = '/login'
    }
}

const voteCom = async (id, parentID, nested, commentParentID) => { 
    if (commentParentID == null || "") {
        commentParentID = "0"
    }

    const settings = {
        method: 'PUT',
    };

    const fetchResponse = await fetch('/votecomment/'+parentID+'/'+id+'/'+nested+'/'+commentParentID, settings); 
    const data = await fetchResponse.json()

    if (data.status == 'ok') {
        if (data.voted == 'yes') {
            if (nested) {
                document.getElementById('nestedcommentUp_'+id+'_'+commentParentID).src = '/assets/up_selected.gif'
            } else {
                document.getElementById('voteComUp_'+id).src = '/assets/up_selected.gif'
            }
            
        }
        if (data.voted == 'no') {
            if (nested) {
                document.getElementById('nestedcommentUp_'+id+'_'+commentParentID).src = '/assets/up.gif'
            } else {
                document.getElementById('voteComUp_'+id).src = '/assets/up.gif'
            }
            
        }
        if (nested) {
            document.getElementById('comnestedVoteCount_'+id).innerHTML = data.newcount
        } else {
            document.getElementById('voteCount_'+id).innerHTML = data.newcount
        }
    } else {
        if (data.error.name == 'JsonWebTokenError') { // no user is detected, redirect to login page
            window.location.href = '/login'
        }
    }
    
}

const comment = async () => { 
    body = document.getElementById("newCom_body").value
    if (body != null && body != "") {
        bodyJSON = {
            "id":window.location.href.split("/posts/")[1],
            "body":body,
        }
    
        const fetchResponse = await fetch('/api/post/comment/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        }); 
        var data = await fetchResponse.json()

        let com = Object.create(commentObject)
        com.body = data.body
        com.id = data._id
        com.total_votes = data.total_votes
        com.poster = data.poster
        com.posterID = data.posterID
        com.date = data.date
        com.current_user_admin = true
        com.display()
        
        comment_count.push(com.id)
        commentBodies.push(com.body)
    }
    
}

const comment_nested = async (postid, body, commentparentID) => { 
    
    if (body != null && body != "") {
        bodyJSON = {
            "id":postid,
            "body":body,
            "parentID":commentparentID
        }
    
        const fetchResponse = await fetch('/api/post/comment_nested/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        }); 
        var data = await fetchResponse.json()
        

        var ncDiv = document.createElement("div")
        ncDiv.setAttribute("class", "ncDiv")
        ncDiv.setAttribute("id", "ncDiv_"+data.id)
        var ncCommentDiv = document.createElement("div")
        ncCommentDiv.setAttribute("class", "ncCommentDiv")
        ncCommentDiv.setAttribute("id", "ncCommentDiv_"+data.id)
        ncCommentDiv.innerHTML += "<span style='color:blue'>"+data.poster + "</span>: "+data.body+"<br/>"
        
        var ncVoteDiv = document.createElement("div")
        ncVoteDiv.setAttribute("class", "ncVoteDiv")
        ncVoteDiv.setAttribute("id", "ncVoteDiv_"+data.id)

        var voteCount = document.createElement("div")
        voteCount.setAttribute("id","comnestedVoteCount_"+data.id)
        voteCount.setAttribute("class","comnestedVoteCount")
        voteCount.innerHTML = data.total_votes

        var voteUp = document.createElement("img")
        voteUp.setAttribute("id","nestedcommentUp_"+data.id+"_"+commentparentID)
        voteUp.setAttribute("class","nestedcommentUp")
        voteUp.src = '/assets/up.gif'
        
        voteUp.style.width = 'auto'
        voteUp.onclick = function() {
            voteCom(data.id, currentPostID, true, commentparentID)
        }

        document.getElementById("ncContainer_"+commentparentID).style.display = 'block'
        document.getElementById("ncContainer_"+commentparentID).appendChild(ncDiv)
        document.getElementById("ncDiv_"+data.id).appendChild(ncCommentDiv)
        document.getElementById("ncDiv_"+data.id).appendChild(ncVoteDiv)
        document.getElementById("ncVoteDiv_"+data.id).appendChild(voteCount)
        document.getElementById("ncVoteDiv_"+data.id).appendChild(voteUp)
    }
    
}

function ui_newPost() {
    if (document.getElementById("newPost_div").style.display == 'block') {
        document.getElementById("newPost_div").style.display = 'none'
        document.getElementById("post-button").innerHTML = "New post"
        document.getElementById("newPost_logs").innerHTML = ""
        document.getElementById("newPost_topic").value = currentTopic
    } else {
        document.getElementById("newPost_div").style.display = 'block'
        document.getElementById("post-button").innerHTML = "Collapse"
        document.getElementById("newPost_topic").value = currentTopic
    }
}

function launch() { 
    document.getElementById("newPost_div").style.display = 'none'
    document.getElementById("newPost_logs").innerHTML = ""
    document.getElementById("page-number").innerHTML = prevPageStr+"Page "+ pageNumber + nextPageStr
    loadPosts("")
}

if (currentPageType != 'user') {
    document.getElementById("newPost_submit_button").onclick = function() {
        postTitle = document.getElementById("newPost_name").value
        if ((document.getElementById("newPost_topic").value).replace(" ","") == "" || (document.getElementById("newPost_topic").value).replace(" ","") == null || (document.getElementById("newPost_topic").value).replace(" ","") == undefined) {
            topic = "all"
        }
    
        switch (newPost_type) {
            case 1: // Text
                if (postTitle == "" || postTitle == null || !postTitle.replace(/\s/g, '').length) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title"
                } else {
                    createNewPost(1)
                }
                break;
            case 2: // Link
                if (postTitle == "" || postTitle == null) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title"
                } else {
                    if (document.getElementById("newPost_link").value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) {
                        createNewPost(2)
                    } else {
                        document.getElementById("newPost_logs").innerHTML = "Please enter valid URL"
                    }
                }
                break;
            case 3: // Media
                if (postTitle == "" || postTitle == null) {
                    document.getElementById("newPost_logs").innerHTML = "Please enter title"
                } else {
                   createNewPost(3)
                }
                break;
    
        }
        
    }
        
    document.getElementById("newPost_type_text").onclick = function() {
        newPost_type = 1;
        document.getElementById("newPost_type_text").style.backgroundColor = "lightgreen"
        document.getElementById("newPost_type_link").style.backgroundColor = ""
        document.getElementById("newPost_type_media").style.backgroundColor = ""

        document.getElementById("newPost_desc").style.display = "block"
        document.getElementById("newPost_desc_label").style.display = "block"
        document.getElementById("newPost_link").style.display = "none"
        document.getElementById("newPost_link_label").style.display = "none"
        document.getElementById("newPost_file").style.display = "none"
        document.getElementById("newPost_file_label").style.display = "none"
        document.getElementById("newPost_submit_button").style.display = "block"
    }

    document.getElementById("newPost_type_link").onclick = function() {
        newPost_type = 2;
        document.getElementById("newPost_type_text").style.backgroundColor = ""
        document.getElementById("newPost_type_link").style.backgroundColor = "lightgreen"
        document.getElementById("newPost_type_media").style.backgroundColor = ""

        document.getElementById("newPost_link").style.display = "block"
        document.getElementById("newPost_link_label").style.display = "block"
        document.getElementById("newPost_desc").style.display = "none"
        document.getElementById("newPost_desc_label").style.display = "none"
        document.getElementById("newPost_file").style.display = "none"
        document.getElementById("newPost_file_label").style.display = "none"
        document.getElementById("newPost_submit_button").style.display = "block"
    }

    document.getElementById("newPost_type_media").onclick = function() {
        newPost_type = 3;
        document.getElementById("newPost_type_text").style.backgroundColor = ""
        document.getElementById("newPost_type_link").style.backgroundColor = ""
        document.getElementById("newPost_type_media").style.backgroundColor = "lightgreen"

        document.getElementById("newPost_desc").style.display = "none"
        document.getElementById("newPost_desc_label").style.display = "none"
        document.getElementById("newPost_link").style.display = "none"
        document.getElementById("newPost_link_label").style.display = "none"
        document.getElementById("newPost_file").style.display = "block"
        document.getElementById("newPost_file_label").style.display = "block"
        document.getElementById("newPost_submit_button").style.display = "none"
    }

    document.getElementById('newPost_file').addEventListener("change", ev => {
        const formdata = new FormData()
        formdata.append("image", ev.target.files[0])
        uploadImage(formdata)
    })
}



if (currentPageType == 'post') {
    document.getElementById("newCom_submit").onclick = function() {
        comment()
        document.getElementById("newCom_body").value = ""
    }
}


const createNewPost = async(posttype) => { 
    title = document.getElementById("newPost_name").value
    body = document.getElementById("newPost_desc").value
    topic = document.getElementById("newPost_topic").value
    link = document.getElementById("newPost_link").value

    if (topic == "" || topic == null) {
        topic = "all"
    }

    if (posttype == 1) { // text
        bodyJSON = {
            "title":title,
            "body":body,
            "topic":topic,
            "type":posttype
        }
    }
    if (posttype == 2) { // link
        bodyJSON = {
            "title":title,
            "link":link,
            "topic":topic,
            "type":posttype
        }
    }
    if (posttype == 3) { // media
        bodyJSON = {
            "title":title,
            "link":uploadedImageUrls.pop(),
            "topic":topic,
            "type":posttype
        }
    }

    const fetchResponse = await fetch('/api/post/post', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'POST',
        body: JSON.stringify(bodyJSON)
    }); 
    const data = await fetchResponse.json()

    document.getElementById("newPost_name").innerHTML = ""
    document.getElementById("newPost_desc").innerHTML = ""
    document.getElementById("newPost_topic").innerHTML = ""
    document.getElementById("newPost_link").innerHTML = ""
    if (data.code == 200) {
        window.location.reload()
    }
    
}



const uploadImage = async (x) => { 
    document.getElementById("newPost_logs").innerHTML = "Uploading..."
    const fetchResponse = await fetch('https://api.imgbb.com/1/upload?key=e23bc3a1c5f2ec99cc1aa7676dc0f3fb', {
        method: 'POST',
        body: x
    })
    const data = await fetchResponse.json();
    const currentPageCategory = (JSON.stringify(data.data.image.currentPageCategory)).replace(/["]+/g, '')

    uploadedImageUrls.push(currentPageCategory)
    
    document.getElementById("newPost_submit_button").style.display = "block"
    document.getElementById("newPost_logs").innerHTML = ""
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
    window.scrollTo({top: 0, behavior: 'smooth'});  
}

function prevPage() {
    if (pageNumber == 1) {
        return 
    }
    pageNumber -= 1
    if (currentPageType != 'topic') {
        window.location.href = '/'+currentTopic+'/'+sorting+'/'+sorting_duration+'/'+ pageNumber
    }
    if (currentPageType == 'topic') {
        window.location.href = '/h/'+currentTopic+'/'+sorting+'/'+sorting_duration+'/'+ pageNumber
    }
    loadPosts(currentTopic)

    document.getElementById("page-number").innerHTML = prevPageStr+"Page "+ pageNumber +nextPageStr
}

function nextPage() {
    pageNumber += 1
    if (currentPageType != 'topic') {
        window.location.href = '/'+currentTopic+'/'+sorting+'/'+sorting_duration+'/'+pageNumber
    }
    if (currentPageType == 'topic') {
        window.location.href = '/h/'+currentTopic+'/'+sorting+'/'+sorting_duration+'/'+pageNumber
    }

    
    document.getElementById("page-number").innerHTML = prevPageStr+"Page "+pageNumber+nextPageStr

    
}

document.getElementById("users-page-button").onclick = function() { 
    window.location.href = '/users'
}
