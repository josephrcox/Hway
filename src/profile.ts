interface keyobject {
    [key: string]: any
}
var user = window.location.href.split("/user/").pop()
var userInfo:keyobject = []
var admin = false

comment_count = []
let commentParentPair = []
commentBodies = []

const getUserInfo = async (user) => {
    const response =  await fetch('/api/get/user/'+user+'/none')
    const data = await response.json()
    userInfo = data
    isThisUserAdmin()
    
}

const isThisUserAdmin = async() => {
    const response =  await fetch('/api/get/currentuser/')
    const data = await response.json()
   

    if (data.name == user) {
       
        admin = true
    } else {
       
    }
    displayInfo()
}

getUserInfo(user)

function displayInfo() {
   

    // HEADING DIV
    let avatar = document.getElementById("page-profile-avatar") as HTMLImageElement
    if (userInfo.avatar == "" || userInfo.avatar == null) {
        avatar.src = '/assets/defaultavatar.png'
    } else {
        avatar.src = userInfo.avatar
    }
    if (admin) {
        document.getElementById("page-profile-avatar-change").style.display = 'block'
        avatar.onclick = function() {
           
        }
    }
    
    let nameDiv = document.getElementById("page-profile-name")
    nameDiv.innerHTML = userInfo.name

    // INFO DIV
    let acd = document.getElementById("page-profile-info-acd")
    let score = document.getElementById("page-profile-info-score")
    let posts_num = document.getElementById("page-profile-info-posts_num")
    let comments_num = document.getElementById("page-profile-info-comments_num")
    
    let datetime = new Date()
    let month = datetime.getUTCMonth()+1
    let day = datetime.getUTCDate()
    let year = datetime.getUTCFullYear()

    let end:any = (new Date(month+"/"+day+"/"+year))
    let start:any = new Date((userInfo.statistics.misc.account_creation_date[0].split(" at")[0]))
   
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let oneDay = 24 * 60 * 60 * 1000;
    let dif = Math.round(Math.abs((end - start) / oneDay));
    acd.innerHTML += months[start.getMonth()]+" "+start.getDate()+", "+start.getFullYear()+"  ("+dif+" days ago)"
    score.innerHTML += userInfo.statistics.score
    posts_num.innerHTML += userInfo.statistics.posts.created_num+" posts"
    comments_num.innerHTML += userInfo.statistics.comments.created_num+" comments"

    loadPosts("")
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

        let posterRow = comFrame.insertRow(0)
        posterRow.setAttribute("id", "posterRow_"+this.id)
        posterRow.setAttribute("class", "posterRow")
        let posterCell = posterRow.insertCell(0)
        
        let infoRow = comFrame.insertRow(1)
        let infoCell = infoRow.insertCell(0)
        infoCell.innerHTML = this.date
        infoCell.setAttribute("class","comInfoCell")

        let bodyRow = comFrame.insertRow(2)
        let bodyCell = bodyRow.insertCell(0)

        const link = "<a href='/posts/"+this.parentPostID+"'> here </a>"
        posterCell.innerHTML = "<span style='color:blue'>"+this.poster + "</span> said"+link+": (+)"
        posterCell.setAttribute("id","posterCell_"+this.id)

        bodyCell.innerHTML = this.body
        bodyCell.setAttribute("class", "bodyCell")
        bodyCell.setAttribute("id", "bodyCell_"+this.id)
        
        posterRow.onclick = function() {
            var id = posterRow.id.substring(10)
            var body = document.getElementById("bodyCell_"+id)
            var poster = document.getElementById("posterCell_"+id).innerHTML.split(" said")[0]
            if (body.innerHTML == "") {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> said"+link+": (-)"
                body.innerHTML = commentBodies[comment_count.indexOf(parseInt(id))]
            } else {
                document.getElementById("posterCell_"+id).innerHTML = "<span style='color:blue'>"+poster + "</span> said"+link+": (+)"
                var x = document.getElementById("bodyCell_"+posterRow.id.substring(10))
                document.getElementById("voteDiv_"+posterRow.id.substring(10)).style.height = '20px'
                document.getElementById("voteDiv_"+posterRow.id.substring(10)).style.alignSelf = 'center'
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
   

    for (let i=0;i<data.length;i++) {
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

(document.getElementById('avatar_file')).addEventListener("change", ev => {
    const formdata = new FormData()
    formdata.append("image", (ev.target as HTMLInputElement).files[0])
    uploadAvatar(formdata)
})

const uploadAvatar = async (x) => { 
    document.getElementById("page-profile-avatar-change-logs").innerHTML = "Uploading..."
    const fetchResponse = await fetch('https://api.imgbb.com/1/upload?key=e23bc3a1c5f2ec99cc1aa7676dc0f3fb', {
        method: 'POST',
        body: x
    })
    const data = await fetchResponse.json();
    const url = (JSON.stringify(data.data.image.url)).replace(/["]+/g, '')

    changeAvatar(url)
    document.getElementById("page-profile-avatar-change-logs").innerHTML = ""

}

const changeAvatar = async(url) => {
    const bodyJSON = {
        "src":url,
    }
    const response = await fetch('/api/put/user/'+user+'/avatar/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'PUT',
        body: JSON.stringify(bodyJSON)
    }); 
    const data = await response.json()

    if (data.status == 'ok') {
        document.getElementById("avatar_file_label").innerHTML = "Change Avatar";
        (document.getElementById("page-profile-avatar") as HTMLImageElement).src = url
    }
    if (data.status == 'error') {
        alert(data.error)
    }

}

function collapse(x) {
    let z = document.getElementById('page-profile-'+x)
    let heading = document.getElementById('page-profile-'+x+'-header')
    if (z.style.display == 'none') {
        z.style.display = 'block'
        heading.innerHTML = x+' (-)'
    } else {
        z.style.display = 'none'
        heading.innerHTML = x+' (+)'
    }
}