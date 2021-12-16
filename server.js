if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const cors = require('cors')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { response } = require('express');
const path = require('path');
const fs = require('fs');

app.use(cookieParser())

var users = []
IDs = []
topicArray = []
topicCount = []
postsonpage = []
postsPerPage = 30;
let ms_in_day = 86400000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(cors());
app.use(express.json())
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL, {
	useUnifiedTopology: true
})
const connection = mongoose.connection;

connection.once("open", function(res) {
  ////console.log"MongoDB database connection established successfully");
});


const User = require('./models/user')
const Post = require('./models/post')
const Guest = require('./models/guest')
const DeletedComment = require('./models/comments_deleted')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

var allowUsersToBrowseAsGuests = true
var geoip = require('geoip-lite');

async function get_all_avatars() {
	users = []
	tempUsers = await User.find({})
	for (let i=0;i<tempUsers.length;i++) {
		users.push([tempUsers[i].id, tempUsers[i].name, tempUsers[i].avatar])
	}
	console.log("RECHECKING USERS..."+users)
}

get_all_avatars()


app.get('/', async(req, res) => {
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	try {
		Guest.findOne({ip_address:ip}, function(err, docs) {
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

			fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"
			if (docs != null) {
				docs.visited_num += 1
				if (!docs.visited_datetime_array.includes(fulldatetime)) {
					docs.visited_datetime_array.push(fulldatetime)
				}
				docs.save()
			} else {
				var geo = geoip.lookup(ip);
				try {
					Guest.create({
						ip_address: ip,
						approximate_location: geo,
						visited_datetime_array: [fulldatetime]
					})
				} catch(err) {
					console.log(err)
				}
			}
		})

		
	} catch(err) {
		console.log(err)
	}
	
    res.redirect('/all')
	
})

app.get('/logout', (req, res) => {
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		
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

		fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"

		User.findById(userID, function(err, docs) {
			docs.statistics.misc.logout_num += 1
			docs.statistics.misc.logout_array.push([fulldatetime, Date.now()])
			docs.save()
		})
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}
	res.cookie('token', '', { maxAge: 1 })
	res.render('index.ejs', {topic:""})
})

app.get('/api/get/currentuser', function (req, res) {
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
			if (ip.includes("ffff")) {
				console.log("Local IP detected.")
			} else {
				User.findById(verified.id, function(err, docs) {
					if (docs != null) {
						var geo = geoip.lookup(ip);
						try {
							if (!docs.statistics.misc.ip_address.includes(ip)) {
								docs.statistics.misc.ip_address.push(ip)
							}
							if (!docs.statistics.misc.approximate_location.includes(geo)) {
								docs.statistics.misc.approximate_location.push(geo)
							}
							docs.save()
						} catch(err) {
							console.log(err)
						}
					}
					
				})
			}
			
		res.json(verified)

	} catch (err) {
		try {
			var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
			Guest.findOne({ip_address:ip}, function(err, docs) {
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

				fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"
				if (docs != null) {
					docs.visited_num += 1
					if (!docs.visited_datetime_array.includes(fulldatetime)) {
						docs.visited_datetime_array.push(fulldatetime)
					}
					docs.save()
				} else {
					var geo = geoip.lookup(ip);
					try {
						Guest.create({
							ip_address: ip,
							approximate_location: geo,
							visited_datetime_array: [fulldatetime]
						})
					} catch(err) {
						console.log(err)
					}
				}
			})
		} catch(err) {
			console.log(err)
		}
		return res.json({ status:"error", code:400, error: err})
	}

})

app.get('/login', (req, res) => {
    res.render('login.ejs', {topic:"- login"})
})

app.get('/users', (req, res) => {
    res.render('users.ejs', {topic:"- users"})
})

app.get('/user/:user', (req, res) => {
    res.render('profile.ejs', {topic:""})
})

app.get('/register', (req, res) => {
    res.render('register.ejs', {topic:"- register"})
})

app.get('/all/:sorting/:duration/:page', async(req, res) => {
	valid = true
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid || allowUsersToBrowseAsGuests) {
		res.render('home.ejs', {topic: "- all"})
	} else {
		res.render('login.ejs', {topic:"- login"})
	}
})

app.get('/all', async(req,res) => {
	res.redirect('/all/hot/all/1')
})

app.get('/h/:topic/:sorting/:duration/:page', async(req,res) => {
	res.render('home.ejs', {topic:"- "+req.params.topic})
})

app.get('/h/:topic/', async(req,res) => {
	res.redirect('/h/'+req.params.topic+'/hot/all/1')
})

app.get('/posts/:postid', async(req,res) => {	
	res.render('home.ejs', {topic:""})
})

app.get('/api/get/all_users/:sorting', async(req, res) =>{
	// Post.find({}).sort({total_votes: -1}).exec(function(err, posts){
	User.find({}, function(err, users) {
		if (req.params.sorting == '0') {
			users.sort(function(a, b){return a.statistics.score - b.statistics.score}); 
		}
		if (req.params.sorting == '1') {
			users.sort(function(a, b){return b.statistics.score - a.statistics.score}); 
		}
		
		usersArr = []
		locationArr = ""
		for (i=0;i<users.length;i++) {
			try {
				locationArr = users[i].statistics.misc.approximate_location[0]
				location = locationArr.city
			} catch(err) {
				console.log(err)
				location = "unknown"
			}
			
			
			usersArr.push({
				'Name':users[i].name, 
				'Score':users[i].statistics.score,
				'Account_creation_date':users[i].statistics.misc.account_creation_date[0],
				'Location':location
			})
		}

		usersArr.sort()
		res.send(usersArr)
	})
})

app.get('/api/get/user/:user/:options', async(req, res) =>{
	comments = []
	if (req.params.options == "all_comments") {
		Post.find({}, function(err, posts) {
			for (i=0;i<posts.length;i++) {
				for (x=0;x<posts[i].comments.length;x++) {
					if (posts[i].comments[x].poster == req.params.user) {
						posts[i].comments[x].parentPostID = posts[i].id
						comments.push(posts[i].comments[x])
					}
				}
			}
			res.json(comments)
		})
	} else {
		User.findOne({name:req.params.user}, function(err, user) {
			user.password = null
			user._id = null
			user.statistics.posts.viewed_array = null
			user.statistics.posts.viewed_num = null
			user.statistics.posts.votedOn_array = null
			user.statistics.posts.votedOn_num = null

			user.statistics.topics.visited_array = null
			
			user.statistics.comments.votedOn_array = null
			user.statistics.comments.votedOn_num = null

			user.statistics.misc.login_num = null
			user.statistics.misc.login_array = null
			user.statistics.misc.logout_num = null
			user.statistics.misc.logout_array = null

			user.statistics.misc.ip_address = null
			user.statistics.misc.approximate_location = null

			
			res.send(user)
		})
	}
	
})

app.put('/api/put/user/:user/:change/', async(req, res) => {
	user = req.params.user
	change = req.params.change
	url = req.body.src

	if (change == "avatar") {
		if (url != null) {
			User.findOne({name:user}, async function(err, docs) {
				docs.avatar = url
				docs.save()
				await get_all_avatars()
				res.json({status:'ok', src:url})
			})
		} else {
			res.json({status:'error', error:'No URL provided to backend'})
		}
	}
})

app.get('/api/get/posts/:postid', async(req,res) => {
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		
	} catch (err) {
		////console.logerr)
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	postModified = []
	Post.findById(req.params.postid, function (err, post) {
		if (post == null) {
			res.send({error:'No post found'})
		} else {
			if (post.posterID == userID) {
				postModified = post
				postModified.current_user_admin = true
			} else {
				postModified = post
				postModified.current_user_admin = false
			}
			if (post.users_upvoted.includes(userID)) {
				postModified.current_user_upvoted = true
				postModified.current_user_downvoted = false
			}
			if (post.users_downvoted.includes(userID)) {
				postModified.current_user_upvoted = false
				postModified.current_user_downvoted = true
			}
			
			for (i=0;i<post.comments.length;i++) {
				com = post.comments[i]
				if (com.status == 'active') {
					if (com.users_voted.includes(userID)) {
						postModified.comments[i].current_user_voted = true
					}
				}
				
			}
			try {
				User.findById(userID, function(err, docs) {
					if (docs != null) {
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
		
						fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"
		
						viewed_num = docs.statistics.posts.viewed_num
						viewed_array = docs.statistics.posts.viewed_array
						viewed_array.push([post.title, post.topic, post.id, fulldatetime ])
						docs.statistics.posts.viewed_num = (viewed_num+1)
						docs.statistics.posts.viewed_array = viewed_array
						docs.save()	

						
					}
					
				})
			} catch (err) {
				console.log(err)
			}
			for (let i=0;i<post.comments.length;i++) {
				if (post.comments[i].status == 'active') {
					if (post.comments[i].nested_comments.length != 0) {
						for (x=0;x<post.comments[i].nested_comments.length;x++) {
							if (post.comments[i].nested_comments[x].posterid = userID) {
								postModified.comments[i].nested_comments[x].current_user_admin = true
							}
							if (post.comments[i].nested_comments[x].users_voted.includes(userID)) {
								postModified.comments[i].nested_comments[x].current_user_voted = true
							}
						}
					}
					if (post.comments[i].posterid = userID) {
						postModified.comments[i].current_user_admin = true
					} else {
						postModified.comments[i].current_user_admin = false
					}
				} else {
					
				}
				
			}
			
			
			
		}

		User.findById(postModified.posterID, function(err, user) {
			postModified.posterAvatarSrc = user.avatar
			
			res.send(postModified)
		})
		
	})
})

app.get('/api/get/:topic/:sorting/:duration/:page', async(req, res) => {	
	postsonpage = []
	page = req.params.page
	sorting = req.params.sorting
	duration = req.params.duration

	if (req.params.topic == "all_users") {
		return
	}
	// Commenting out this part below allows for users to view without being logged in
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	sortingJSON = {}

	if (sorting == "top") {
		if (duration == "day") {
			timestamp24hoursago = (Date.now() - ms_in_day)
			sortingJSON = {total_votes: -1}
		} else if (duration == "week") {
			timestamp1weekago = (Date.now() - (ms_in_day*7))
			console.log(Date.now() - (ms_in_day*7))
			sortingJSON = {total_votes: -1}
		} else if (duration == "month") {
			timestamp1monthago = (Date.now() - (ms_in_day*30))
			sortingJSON = {total_votes: -1}
		} else if (duration == "all") {
			sortingJSON = {total_votes: -1}
		}
		
	} else if (sorting == "new") {
		sortingJSON = {timestamp: -1}
	} else if (sorting == "hot") {
		sortingJSON = {total_votes: -1}
	}
	
	console.log(sortingJSON)
	if (req.params.topic == "all") {
		Post.find({status:'active'}).sort(sortingJSON).exec(async function(err, posts){

			if(err){
			} else{
				filteredPosts = []

				for (let x=0;x<posts.length;x++) {
					if (sorting == "top" && duration == "day") {
						if (posts[x].timestamp >= timestamp24hoursago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "week"){
						if (posts[x].timestamp >= timestamp1weekago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "month"){
						if (posts[x].timestamp >= timestamp1monthago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "all") {
						filteredPosts.push(posts[x])
					} else if (sorting == "new") {
						filteredPosts.push(posts[x])
					} else if (sorting == "hot") {
						if (posts[x].last_touched_timestamp == null) {
							now = Date.now()
							Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err, docs) {
								if (err){
									console.log(err)
								}
								else{
									console.log("Updated Post")
								}
							})
						}
						if (posts.length > 1) {
							posts.sort( compare );
						}
						filteredPosts = posts
					}
				}

				totalPosts = filteredPosts.length
				totalPages = Math.ceil((totalPosts)/postsPerPage)
				lastPagePosts = totalPosts % postsPerPage

				postsonpage = await paginate(filteredPosts, postsPerPage, page)

				for (let i=0;i<postsonpage.length;i++) {
					if (postsonpage[i].posterID == userID) {
						// postsonpage[i] = posts[i]
						postsonpage[i].current_user_admin = true
					} else {
						// postsonpage[i] = posts[i]
						postsonpage[i].current_user_admin = false
					}
					if (postsonpage[i].users_upvoted.includes(userID)) {
						postsonpage[i].current_user_upvoted = true
						postsonpage[i].current_user_downvoted = false
					}
					if (postsonpage[i].users_downvoted.includes(userID)) {
						postsonpage[i].current_user_upvoted = false
						postsonpage[i].current_user_downvoted = true
					}
					
					if (users.some(x => x[0] == postsonpage[i].posterID)) {
						indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
						postsonpage[i].posterAvatarSrc = users[indexOfUser][2]
					} else {
						console.log("error loading user... do they exist?")
					}
					

				}
				res.send(postsonpage)
			
			}
		})
	} else {
		Post.find({topic: req.params.topic, status:"active"}).sort({total_votes: -1}).exec(async function(err, posts){
			if(err){
			} else{
				try {
					if (userID != null) {
						User.findById(userID, async function(err, docs) {
							if (docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)) {
								index = docs.statistics.topics.visited_array.findIndex(x => x[0] == req.params.topic)
								currentCount = docs.statistics.topics.visited_array[index][2]
								docs.statistics.topics.visited_array[index] = [req.params.topic, Date.now(),(currentCount+1)]
		
							} else {
								array = docs.statistics.topics.visited_array
								array.push([req.params.topic, Date.now(), 1])
								docs.statistics.topics.visited_array = array
							}
							
							docs.update()
					})
				}
				} catch(err) {
					console.log(err)
				}

				filteredPosts = []

				for (let x=0;x<posts.length;x++) {
					if (sorting == "top" && duration == "day") {
						if (posts[x].timestamp >= timestamp24hoursago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "week"){
						if (posts[x].timestamp >= timestamp1weekago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "month"){
						if (posts[x].timestamp >= timestamp1monthago) {
							filteredPosts.push(posts[x])
						}
					} else if (sorting == "top" && duration == "all") {
						filteredPosts.push(posts[x])
					} else if (sorting == "new") {
						filteredPosts.push(posts[x])
					} else if (sorting == "hot") {
						if (posts[x].last_touched_timestamp == null) {
							now = Date.now()
							Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err, docs) {
								if (err){
									console.log(err)
								}
								else{
									console.log("Updated Post")
								}
							})
						}
						if (posts.length > 1) {
							posts.sort( compare );
						}
						filteredPosts = posts
					}
				}
				
				totalPosts = filteredPosts.length
				totalPages = Math.ceil((totalPosts)/postsPerPage)
				lastPagePosts = totalPosts % postsPerPage

				postsonpage = await paginate(filteredPosts, postsPerPage, page)
				
				for (i=0;i<postsonpage.length;i++) {
					if (postsonpage[i].posterID == userID) {
						postsonpage[i].current_user_admin = true
					} else {
						postsonpage[i].current_user_admin = false
					}
					if (postsonpage[i].users_upvoted.includes(userID)) {
						postsonpage[i].current_user_upvoted = true
						postsonpage[i].current_user_downvoted = false
					}
					if (postsonpage[i].users_downvoted.includes(userID)) {
						postsonpage[i].current_user_upvoted = false
						postsonpage[i].current_user_downvoted = true
					}

					if (users.some(x => x[0] == postsonpage[i].posterID)) {
						indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
						postsonpage[i].posterAvatarSrc = users[indexOfUser][2]
					} else {
						console.log("error loading user... do they exist?")
					}
				}
				res.send(postsonpage)
			}
		})
	}

	
})

function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

app.get('/api/get/posts/user/:user', async(req, res) => {	
	postsonpage = []
	// Commenting out this part below allows for users to view without being logged in
	try {
		token = req.cookies.token
		//console.logtoken)
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		//console.logerr)
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	Post.find({poster:req.params.user, status:"active"}).sort({total_votes: -1}).exec(async function(err, posts){
		if(err){
		} else{
			try {
				User.findById(userID, async function(err, docs) {
					if (docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)) {
						index = docs.statistics.topics.visited_array.findIndex(x => x[0] == req.params.topic)
						currentCount = docs.statistics.topics.visited_array[index][2]
						docs.statistics.topics.visited_array[index] = [req.params.topic, Date.now(),(currentCount+1)]

					} else {
						docs.statistics.topics.visited_array.push([req.params.topic, Date.now(), 1])
					}
					
					docs.save()
				})
			} catch(err) {
				console.log(err)
			}
			
			
			for (i=0;i<posts.length;i++) {
				if (posts[i].posterID == userID) {
					postsonpage[i] = posts[i]
					postsonpage[i].current_user_admin = true
				} else {
					postsonpage[i] = posts[i]
					postsonpage[i].current_user_admin = false
				}
				if (posts[i].users_upvoted.includes(userID)) {
					postsonpage[i].current_user_upvoted = true
					postsonpage[i].current_user_downvoted = false
				}
				if (posts[i].users_downvoted.includes(userID)) {
					postsonpage[i].current_user_upvoted = false
					postsonpage[i].current_user_downvoted = true
				}

				if (users.some(x => x[0] == posts[i].posterID)) {
					indexOfUser = users.findIndex(x => x[0] == posts[i].posterID)
					postsonpage[i].posterAvatarSrc = users[indexOfUser][2]
				} else {
					console.log("error loading user... do they exist?")
				}
			}
			res.send(postsonpage)
		}
	})
})

app.get('/api/get/users', async(req, res) => {	
	User.find({}, function(err, users) {
		usersArr = []
		for (i=0;i<users.length;i++) {
			usersArr.push({
				'name':users[i].name, 
				'color':users[i].color
			})
		}
		res.send(usersArr)
	})
})

app.get('/api/get/topics', async(req, res) => {	
	topicArray = []
	topicCount = []
	Post.find({status:"active"}, function(err, posts){
        if(err){
          ////console.logerr);
        } else{
			
			for (i=0;i<posts.length;i++) {
				if (topicArray.includes(posts[i].topic)) {
					index = topicArray.indexOf(posts[i].topic)
					topicCount[index] = parseInt(topicCount[index]+1)
				} else {
					topicArray.push(posts[i].topic)
					topicCount[i] = 1
				}
				if (topicCount[i] == null) {
					topicCount[i] = 1
				}
			}
			var joinedArray = topicArray.map(function (value, index){
				return [value, topicCount[index]]
			});
			joinedArray.sort(function(a,b) {
				return b[1] - a[1]
			})
			////console.logjoinedArray)
			res.send(joinedArray)
        }

    })
})

app.post('/login', async(req, res) => {
    const { name, password } = req.body
	const user = await User.findOne({ name }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{
				id: user._id,
				name: user.name
			},
			JWT_SECRET, { expiresIn: "30days"}
		)
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

		fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"

		User.findById(user._id, function(err, docs) {
			docs.statistics.misc.login_num += 1
			docs.statistics.misc.login_array.push([fulldatetime, Date.now()])
			docs.save()
		})

        res.cookie("token", token, {
            httpOnly: true
        })

		return res.json({ status: 'ok', code: 200, data: token })
	}

	res.json({ status: 'error', code: 400, error: 'Invalid username/password' })
})

app.post('/register', async(req, res) => {
    const { name, password: plainTextPassword} = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
		const response = await User.create({
            name: name,
            password: password,
		})
		////console.log'User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', code: 400, error: 'Username already in use' })
		} else {
            return res.json({ status: 'error', code:400, error: 'Unknown error code'})
        }
	}

	res.json({ status: 'ok', code:200 })
})

app.post('/api/post/post', async(req, res) => {
	const {title, body, link, topic, type} = req.body

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		poster = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

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

	fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"

	try {
		const response = await Post.create({
            title: title, 
			body: body, 
			poster: poster,
			link: link,
			topic: topic,
			type: type, // 1=text, using as temporary default
			posterID: userID,
			date: fulldatetime,
			timestamp:timestamp,
			status:"active"
		})
		if (body.indexOf('mpwknd199999999') == -1) {
			User.findById(userID, function(err, docs) {
				docs.statistics.posts.created_num += 1
				docs.statistics.posts.created_array.push([title, topic, response.id, fulldatetime])
				docs.save()
			})
		}
		
		res.json({ status:"ok", code:200, data: response})
	} catch (error) {
		console.log("ERROR:"+error)
		res.json(error)
	}
})


app.post('/api/post/comment/', async(req, res) => {
	const {body:reqbody, id} = req.body
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		username = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

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

	fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"
	try {
		Post.findById(id, function(err, docs) {
			//console.logdocs)
			commentArray = docs.comments
			Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
				console.log(err, update)
			})
			
			commentid = Math.floor(Math.random() * Date.now()) // generates a random id
			newComment = {
				'body': reqbody,
				'poster':username,
				'posterID': userID,
				'date': fulldatetime,
				'timestamp':timestamp,
				'total_votes':0,
				'users_voted':[],
				'nested_comments':[],
				'_id': commentid,
				'status': 'active'
			}
			commentArray.push(newComment)
			docs.comments = commentArray
			docs.save()
			User.findById(userID, function(err, docs) {
				docs.statistics.comments.created_num += 1
				docs.statistics.comments.created_array.push([reqbody, id, commentid])
				docs.save()
			})
			User.findById(userID, function(err, docs) {
				//console.logdocs)
			})
			res.json(newComment)
		})
	} catch(err) {
		res.send(err)
	}
	
})

app.post('/api/post/comment_nested/', async(req, res) => {
	const {body:reqbody, id, parentID} = req.body

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		username = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

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

	fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"
	try {
		Post.findById(id, function(err, docs) {
			// docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)
			parentCommentIndex = docs.comments.findIndex(x => x._id == parentID)
			randomID = Math.floor(Math.random() * Date.now()), // generates a random id
			oldComment = docs.comments[parentCommentIndex]
			newComment = {
				body:reqbody,
				poster:username,
				posterid:userID,
				date:fulldatetime,
				total_votes:0,
				users_voted:[],
				id: randomID
			}
			oldComment.nested_comments.push(newComment)

			docs.comments[parentCommentIndex] = oldComment
			docs.save()
			res.json(newComment)
		})
	} catch(err) {
		res.send(err)
	}
	
})


function isloggedin(req) {
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		////console.log"verified:"+JSON.stringify(verified))
		if (JSON.stringify(verified).status == "error") {
			return false
		} else {
			return true
		}
	} catch(err) {
		return false
	}
}

app.put('/vote/:id/:y', function(req,res) {
	id = (req.params.id).substring(13)
	change = req.params.y

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	try {
		Post.findOne({_id: id }, function (err, docs) { 
			upvotes = docs.upvotes
			downvotes = docs.downvotes
			total_votes = docs.total_votes
			users_upvoted = docs.users_upvoted
			users_downvoted = docs.users_downvoted

			user_already_upvoted = users_upvoted.includes(userID)
			user_already_downvoted = users_downvoted.includes(userID)
			posterid = docs.posterID


			if (change == 1) {
				if (user_already_upvoted) {
					// do nothing
				} else {
					Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
						console.log(err, update)
					})
					if (user_already_downvoted) {
						// remove the downvote, total_votes+1
						Post.findOneAndUpdate({ _id: id }, { $set: {downvotes: (downvotes-1), total_votes: (total_votes+1)},  $pull: {users_downvoted: userID} }, {}, function (err, numReplaced) {
							User.findById(posterid, function(err, docs) {
								docs.statistics.score += 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes+1, 'gif':'none'})
						})
					}
					if (!user_already_downvoted && !user_already_upvoted) {
						// vote up
						Post.findOneAndUpdate({ _id: id }, { $set: {upvotes: (upvotes+1), total_votes: (total_votes+1)},  $push: {users_upvoted: userID} }, {}, function (err, numReplaced) {
							User.findById(posterid, function(err, docs) {
								docs.statistics.score += 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes+1, 'gif':'up'})
						})
					}
				}
				
			}

			if (change == -1) {
				if (user_already_downvoted) {
					// do nothing
				} else {
					Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
						console.log(err, update)
					})
					if (user_already_upvoted) {
						// remove the upvote, total_votes-1
						Post.findOneAndUpdate({ _id: id }, { $set: {upvotes: (upvotes-1), total_votes: (total_votes-1)},  $pull: {users_upvoted: userID} }, {}, function (err, numReplaced) {
							User.findById(posterid, function(err, docs) {
								docs.statistics.score -= 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes-1, 'gif':'none'})
						})
					}
					if (!user_already_downvoted && !user_already_upvoted) {
						// vote down
						Post.findOneAndUpdate({ _id: id }, { $set: {downvotes: (downvotes+1), total_votes: (total_votes-1)},  $push: {users_downvoted: userID} }, {}, function (err, numReplaced) {
							User.findById(posterid, function(err, docs) {
								docs.statistics.score -= 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes-1, 'gif':'down'})
						})
					}
				}
				
			}
		
		})

	} catch(err) {
		res.json({'status':'error'})
	}
})


app.put('/api/put/post/delete/:postid', function(req,res) {
	postid = req.params.postid

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	Post.findById(postid, function(err, docs) {
		if (docs.posterID == userID) {
			// Post.findByIdAndUpdate(postid, { $set: { status: 'deleted' }})
			Post.findById(postid, function (err, doc) {
				if (err) {
					console.error(err)
				} else {
					doc.status = 'deleted';
					doc.save();
				}
			});
			res.json({status:'ok'})
		} else {
			res.json({status:'error'})
		}
	})
	
})

app.put('/api/put/comment/delete/:postid/:id', async function(req,res) {
	id = req.params.id
	postid = req.params.postid

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	post = await Post.findById(postid)
	ncomments = post.comments
	for (let i=0;i<ncomments.length;i++) {
		if (ncomments[i]._id == id) {
			index = i
		}
	}

	ncomments[index].status = 'deleted'
	ctbd = ncomments[index]
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

	fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm+" UTC"

	try {
		const resp = await DeletedComment.create({
			post: postid,
			body: ctbd.body,
			poster: ctbd.poster,
			posterID: ctbd.posterID,

			date: ctbd.date,
			timestamp: ctbd.timestamp,
			users_voted:ctbd.users_voted,
			nested_comments:ctbd.nested_comments,

			date_deleted: fulldatetime,
			timestamp_deleted: Date.now(),

			deleted_by: 'user'
		})
	} catch(err) {
		console.log(err)
	}

	ncomments.splice(index)

	Post.findById(postid, function(err, docs) {
		docs.comments = ncomments
		docs.save()
		res.json({status:'ok'})
	})
	
})

app.put('/voteComment/:parentid/:commentid/:nestedboolean/:commentParentID', function(req,res) {
	pID = req.params.parentid
	id = req.params.commentid
	// These two variables are only for nested comments
	nestedBoolean = req.params.nestedboolean
	commentParentID = req.params.commentParentID 
	//
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		//console.loguserID)
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}
	Post.findByIdAndUpdate(pID, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
		console.log(err, update)
	})

	if (nestedBoolean == "true") {
		try {
			Post.findById(pID, function(err, docs) {
				oldComArray = docs.comments
	
				for (i=0;i<oldComArray.length;i++) {
					for (x=0;x<oldComArray[i].nested_comments.length;x++) {
						if (oldComArray[i].nested_comments[x].id == id) {
							
							comIndex = i
							ncIndex = x
						}
					}
				}

				nc = oldComArray[comIndex].nested_comments[ncIndex]

				nestedCommentPosterId = nc.posterid
				if (!nc.users_voted.includes(userID)) { // user has not voted
					nc.users_voted.push(userID)
					nc.total_votes += 1
					oldComArray[comIndex].nested_comments[ncIndex] = nc
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err, docs) {	
					})
					User.findById(nestedCommentPosterId, function(err, docs) {
						docs.statistics.score += 1
						docs.save()
					})
					docs.save()
					res.json({"status":'ok', 'newcount':nc.total_votes, 'voted':'yes'})
				} else { // user has already voted
					userIDinArray = nc.users_voted.indexOf(userID)
					nc.users_voted.splice(userIDinArray, 1)
					nc.total_votes -= 1
					oldComArray[comIndex].nested_comments[ncIndex] = nc
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err, docs) {	
					})
					User.findById(nestedCommentPosterId, function(err, docs) {
						docs.statistics.score -= 1
						docs.save()
					})
					docs.save()
					res.json({"status":'ok', 'newcount':nc.total_votes, 'voted':'no'})
				}
			})
			
		} catch (err) {
			console.error(err)
		}
	}
	if (nestedBoolean == "false" || nestedBoolean == null) {
		
		try {
			Post.findById(pID, function(err, docs) {
				oldComArray = docs.comments
	
				for (i=0;i<oldComArray.length;i++) {
					if (oldComArray[i]._id == id) {
						//console.log"match:"+i)
						index = i
					}
				}
				oldVotes = oldComArray[index].total_votes
				newVotes = oldVotes+1
				newVotesDown = oldVotes-1
				commentPosterID = oldComArray[index].posterID
				
				
				if (oldComArray[index].users_voted.includes(userID)) {
					userIDinArray = oldComArray[index].users_voted.indexOf(userID)
					oldComArray[index].users_voted.splice(userIDinArray, 1)
					oldComArray[index].total_votes = newVotesDown
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err, docs) {	
						User.findById(commentPosterID, function(err, docs) {
							docs.statistics.score -= 1
							docs.save()
						})
						docs.save()
						res.json({"status":'ok', "newcount":oldComArray[index].total_votes, 'voted':'no'})
					})
					
				} else {
					oldComArray[index].users_voted.push(userID)
					oldComArray[index].total_votes = newVotes
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err, docs) {	
						User.findById(commentPosterID, function(err, docs) {
							docs.statistics.score += 1
							docs.save()
						})
						docs.save()
						res.json({"status":'ok', 'newcount':oldComArray[index].total_votes, 'voted':'yes'})
					})
				}
			})
			
		} catch (err) {
	
		}
	}
	

})

function deleteTestPosts() {
	try {
		Post.find({}, function(err, docs) {
			if (err) {
				console.log(err)
			} else {
				newDocs = docs
				console.log(newDocs[0])
				for (let i=0;i<newDocs.length;i++) {
					if (newDocs[i].body != null) {
						if (newDocs[i].body.indexOf('mpwknd199999999') != -1) {
							Post.findByIdAndDelete(newDocs[i].id, function(err, response) {
								console.log(response)
							})
						}
					}
					
				}
			}
			
		})
	} catch(err) {
		console.log(err)
	}
	
}

function compare( a, b ) {
	if ( a.last_touched_timestamp < b.last_touched_timestamp ){
	  return 1;
	}
	if ( a.last_touched_timestamp > b.last_touched_timestamp ){
	  return -1;
	}
	return 0;
}



//deleteTestPosts()

app.listen(process.env.PORT || 3000)