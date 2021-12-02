user = window.location.href.split("/user/").pop()
userInfo = []

comment_count = []
commentParentPair = []
commentBodies = []

const getUserInfo = async (user) => {
    const response =  await fetch('/api/get/user/'+user+'/none')
    const data = await response.json()
    userInfo = data
    displayInfo()
}

getUserInfo(user)

function displayInfo() {
    console.log(userInfo)

    // NAME DIV
    nameDiv = document.getElementById("page-profile-name")
    nameDiv.innerHTML = userInfo.name

    // INFO DIV
    acd = document.getElementById("page-profile-info-acd")
    score = document.getElementById("page-profile-info-score")
    posts_num = document.getElementById("page-profile-info-posts_num")
    comments_num = document.getElementById("page-profile-info-comments_num")
    
    let datetime = new Date()
    month = datetime.getUTCMonth()+1
    day = datetime.getUTCDate()
    year = datetime.getUTCFullYear()
    hour = datetime.getUTCHours()
    minute = datetime.getUTCMinutes()
    timestamp = Date.now()

    if (hour > 12) {
        ampm = "PM"
        hour -= 12
    } else {
        ampm = "AM"
    }
    if (minute < 10) {
        minute = "0"+minute
    }

    end = new Date(month+"/"+day+"/"+year)
    start = new Date((userInfo.statistics.misc.account_creation_date[0].split(" at")[0]))
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    oneDay = 24 * 60 * 60 * 1000;
    dif = Math.round(Math.abs((end - start) / oneDay));
    acd.innerHTML += months[start.getMonth()]+" "+start.getDate()+", "+start.getFullYear()+"  ("+dif+" days ago)"
    score.innerHTML += userInfo.statistics.score
    posts_num.innerHTML += userInfo.statistics.posts.created_num+" posts"
    comments_num.innerHTML += userInfo.statistics.comments.created_num+" comments"

    // POSTS DIV
    loadPosts(0,"",1)

    // COMMENTS DIV

    loadComments()
}

const commentShortObject = {
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

    parentPostID:"",
    

    display() {
        var fullCommentContainer = document.createElement("div")
        fullCommentContainer.setAttribute("id", "fullCommentContainer_"+this.id)
        document.getElementById("page-profile-comments").appendChild(fullCommentContainer)

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

        bodyRow = comFrame.insertRow(2)
        bodyCell = bodyRow.insertCell(0)

        const link = "<a href='/posts/"+this.parentPostID+"'> here </a>"
        posterCell.innerHTML = "<span style='color:blue'>"+this.poster + "</span> said"+link+": (+)"
        posterCell.setAttribute("id","posterCell_"+this.id)

        bodyCell.innerHTML = this.body
        bodyCell.setAttribute("class", "bodyCell")
        bodyCell.setAttribute("id", "bodyCell_"+this.id)
        
        posterRow.onclick = function() {
            var id = this.id.substring(10)
            var body = document.getElementById("bodyCell_"+id)
            var poster = document.getElementById("posterCell_"+id).innerHTML.split(" said")[0]
            if (body.innerHTML == "") {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> said"+link+": (-)"
                body.innerHTML = commentBodies[comment_count.indexOf(parseInt(id))]
            } else {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> said"+link+": (+)"
                var x = document.getElementById("bodyCell_"+this.id.substring(10))
                document.getElementById("voteDiv_"+this.id.substring(10)).style.height = '20px'
                document.getElementById("voteDiv_"+this.id.substring(10)).style.alignSelf = 'center'
                x.innerHTML = ""
            }
            
        }

        var voteDiv = document.createElement("div")
        voteDiv.setAttribute("id", "voteDiv_"+this.id)
        voteDiv.setAttribute("class", "comVoteDiv")

        var voteCount = document.createElement("div")
        voteCount.setAttribute("id","voteCount_"+this.id)
        voteCount.setAttribute("class","comVoteCount")
        voteCount.innerHTML = this.total_votes

        document.getElementById("comFrame_"+this.id).appendChild(voteDiv)
        
        document.getElementById("voteDiv_"+this.id).appendChild(voteCount)
    }
}

const loadComments = async() => {
    const response =  await fetch('/api/get/user/'+user+'/all_comments')
    const data = await response.json()
    console.log(data)

    for (i=0;i<data.length;i++) {
        let com = Object.create(commentShortObject)
        com.body = data[i].body
        com.id = data[i]._id
        com.total_votes = data[i].total_votes
        com.poster = data[i].poster
        com.posterID = data[i].posterID
        com.date = data[i].date
        com.users_voted = data[i].users_voted
        com.nested_comments = data[i].nested_comments

        com.parentPostID = data[i].parentPostID

        com.current_user_voted = data[i].current_user_voted
        com.display()
        comment_count.push(com.id)
        commentParentPair.push(com.parentID)
        commentBodies.push(com.body)
    }
}

