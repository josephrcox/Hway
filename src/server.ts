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
var IDs = []
var topicArray = []
var topicCount = []
var postsonpage = []
var postsPerPage = 30;
let ms_in_day = 86400000;

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, '/views'))
app.set('layout', 'layouts/layout')
app.use(cors());
app.use(express.json())
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, './dist/')));
app.use(express.static('./dist/'));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL, {

})
const connection = mongoose.connection;

connection.once("open", function(res) {
  console.log("MongoDB database connection established successfully");
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
let usersArr = []

async function get_all_avatars() {
	let tempUsers = await User.find({})
	for (let i=0;i<tempUsers.length;i++) {
		users.push([tempUsers[i].id, tempUsers[i].name, tempUsers[i].avatar])
	}
}

get_all_avatars()


app.get('/', async(req, res) => {
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	try {
		Guest.findOne({ip_address:ip}, function(err, docs) {
			const dt = getFullDateTimeAndTimeStamp()
			let fulldatetime = dt[0]
			let timestamp = dt[1]
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
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		let userID = verified.id
		
		const dt = getFullDateTimeAndTimeStamp()
		let fulldatetime = dt[0]
		let timestamp = dt[1]

		User.findById(userID, function(err, docs) {
			docs.statistics.misc.logout_num += 1
			docs.statistics.misc.logout_array.push([fulldatetime, timestamp])
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
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
			if (ip.includes("ffff")) {
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
				const dt = getFullDateTimeAndTimeStamp()
				let fulldatetime = dt[0]

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

app.get('/api/get/notifications', function(req,res) {
	try {
		let token = req.cookies.token
		let user = jwt.verify(token, process.env.JWT_SECRET)
	
		User.findById(user.id, function(err,docs) {
			if (err) {
				res.send({status:'error'})
			} else {
				res.send(docs.notifications)
			}
		})
	}catch(error) {
		res.send({status:'error', data:'nojwt'})
	}
	
})

app.put('/api/put/notif/remove/:index', function(req,res) {
	try {
		let token = req.cookies.token
		let user = jwt.verify(token, process.env.JWT_SECRET)
	
		User.findById(user.id, function(err,docs) {
			docs.notifications.splice(req.params.index, 1)
			docs.save()
			res.send({status:'ok'})
		})
	}catch(error) {
		res.send({status:'error', data:'nojwt'})
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

app.get('/all/q', async(req, res) => {
	let valid = true
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid || allowUsersToBrowseAsGuests) {
		res.render('home.ejs', {topic: "- all"})
	} else {
		res.render('login.ejs', {topic:"- login"})
	}
	
})

app.get('/all', async(req,res) => {
	res.redirect('/all/q?sort=hot&t=all&page=1')
})

app.get('/all/:queries', async(req, res) => {
	let valid = true
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid || allowUsersToBrowseAsGuests) {
		res.render('home.ejs', {topic: "- all"})
	} else {
		res.render('login.ejs', {topic:"- login"})
	}
})



app.get('/h/:topic/q', async(req,res) => {
	res.render('home.ejs', {topic:"- "+req.params.topic})
})

app.get('/h/:topic/', async(req,res) => {
	res.redirect('/h/'+req.params.topic+'/q?sort=hot&t=all&page=1')
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
		let location
		for (let i=0;i<users.length;i++) {
			try {
				let locationArr = users[i].statistics.misc.approximate_location[0]
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
	let comments = []
	if (req.params.options == "all_comments") {
		Post.find({}, function(err, posts) {
			for (let i=0;i<posts.length;i++) {
				for (let x=0;x<posts[i].comments.length;x++) {
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
	let user = req.params.user
	let change = req.params.change
	let url = req.body.src

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
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		var userID = verified.id
		
	} catch (err) {
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	let postModified = []
	Post.findById(req.params.postid, function (err, post) {
		let postModified = post
		if (post == null) {
			res.send({error:'No post found'})
		} else {
			if (post.posterID == userID) {
				postModified.current_user_admin = true
			} else {
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
			
			for (let i=0;i<post.comments.length;i++) {
				let com = post.comments[i]
				if (com.status == 'active') {
					if (com.users_voted.includes(userID)) {
						postModified.comments[i].current_user_voted = true
					}
				}
				
			}
			try {
				User.findById(userID, function(err, docs) {
					if (docs != null) {
						const dt = getFullDateTimeAndTimeStamp()
						let fulldatetime = dt[0]
		
						let viewed_num = docs.statistics.posts.viewed_num
						let viewed_array = docs.statistics.posts.viewed_array
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
						for (let x=0;x<post.comments[i].nested_comments.length;x++) {
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

app.get('/api/get/:topic/q', async(req, res) => {
	postsonpage = []

	let queries = req.query

	let page = queries.page
	let sorting = queries.sort
	let duration = queries.t
	let userID

	if (req.params.topic == "all_users") {
		return
	}
	// Commenting out this part below allows for users to view without being logged in
	try {
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	let sortingJSON = {}
	let timestamp24hoursago
	let timestamp1weekago
	let timestamp1monthago

	if (sorting == "top") {
		if (duration == "day") {
			timestamp24hoursago = (Date.now() - ms_in_day)
			sortingJSON = {total_votes: -1}
		} else if (duration == "week") {
			timestamp1weekago = (Date.now() - (ms_in_day*7))
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
	
	if (req.params.topic == "all") {
		Post.find({status:'active'}).sort(sortingJSON).exec(async function(err, posts){

			if(err){
			} else{
				let filteredPosts = []

				for (let x=0;x<posts.length;x++) {
					if (filteredPosts.length >= postsPerPage) {

					} else {
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
								let now = Date.now()
								Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err, docs) {
									if (err){
										console.log(err)
									}
								})
							}
							if (posts.length > 1) {
								posts.sort( compare );
							}
							filteredPosts = posts
						}
					}
					
				}
				for(let i=0;i<filteredPosts.length;i++) {
					try {
						if (filteredPosts[i].special_attributes[0].nsfw == true) {
							if (queries.nsfw != 'true') {
								filteredPosts.splice(i,1)
							}
						}
					} catch(err) {

					}
					
					
				}

				let totalPosts = filteredPosts.length
				let totalPages = Math.ceil((totalPosts)/postsPerPage)
				let lastPagePosts = totalPosts % postsPerPage

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
						let indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
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
								let index = docs.statistics.topics.visited_array.findIndex(x => x[0] == req.params.topic)
								let currentCount = docs.statistics.topics.visited_array[index][2]
								docs.statistics.topics.visited_array[index] = [req.params.topic, Date.now(),(currentCount+1)]
		
							} else {
								let array = docs.statistics.topics.visited_array
								array.push([req.params.topic, Date.now(), 1])
								docs.statistics.topics.visited_array = array
							}
							
							docs.update()
					})
				}
				} catch(err) {
					console.log(err)
				}

				let filteredPosts = []

				for (let x=0;x<posts.length;x++) {
					if (filteredPosts.length >= postsPerPage) {

					} else {
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
								let now = Date.now()
								Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err, docs) {
									if (err){
										console.log(err)
									}
								})
							}
							if (posts.length > 1) {
								posts.sort( compare );
							}
							filteredPosts = posts
						}
					}
				}
				
				let totalPosts = filteredPosts.length
				let totalPages = Math.ceil((totalPosts)/postsPerPage)
				let lastPagePosts = totalPosts % postsPerPage

				postsonpage = await paginate(filteredPosts, postsPerPage, page)
				
				for (let i=0;i<postsonpage.length;i++) {
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
						let indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
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
	let userID
	// Commenting out this part below allows for users to view without being logged in
	try {
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		if (!allowUsersToBrowseAsGuests) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		} else {
			userID = null
		}
	}
	
	Post.find({poster:req.params.user, status:"active"}).sort({total_votes: -1}).exec(async function(err, posts){
		if(err){
		} else{
			
			for (let i=0;i<posts.length;i++) {
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
					let indexOfUser = users.findIndex(x => x[0] == posts[i].posterID)
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
		for (let i=0;i<users.length;i++) {
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
        } else{
			
			for (let i=0;i<posts.length;i++) {
				if (topicArray.includes(posts[i].topic)) {
					let index = topicArray.indexOf(posts[i].topic)
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
		const dt = getFullDateTimeAndTimeStamp()
		let fulldatetime = dt[0]
		let timestamp = dt[1]

		User.findById(user._id, function(err, docs) {
			docs.statistics.misc.login_num += 1
			docs.statistics.misc.login_array.push([fulldatetime, timestamp])
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
		let dt = getFullDateTimeAndTimeStamp
		const response = await User.create({
            name: name,
            password: password,
			statistics:{
				account_creation_date:[dt[0],dt[1]]
			}
		})
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', code: 400, error: 'Username already in use' })
		} else {
            return res.json({ status: 'error', code:400, error: 'Unknown error code'})
        }
	}

	res.json({ status: 'ok', code:200 })
})

app.post('/api/post/post', async(req, res) => {
	const {title, body, link, topic, type, nsfw} = req.body
	let userID
	let poster

	var special_attributes = {nsfw:nsfw}

	try {
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		poster = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]
	let timestamp = dt[1]

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
			status:"active",
			special_attributes: special_attributes
		})
		if (body != null) {
			if (body.indexOf('mpwknd199999999') == -1) {
				User.findById(userID, function(err, docs) {
					docs.statistics.posts.created_num += 1
					docs.statistics.posts.created_array.push([title, topic, response.id, fulldatetime])
					docs.save()
				})
			}
		}
		
		
		res.json({ status:"ok", code:200, data: response})
	} catch (error) {
		res.json(error)
	}
})


app.post('/api/post/comment/', async(req, res) => {
	const {body:reqbody, id} = req.body
	let token
	let userID
	let username

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		username = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]
	let timestamp = dt[1]

	try {
		Post.findById(id, function(err, docs) {
			let commentArray = docs.comments
			Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
			})
			
			let commentid = Math.floor(Math.random() * Date.now()) // generates a random id
			let newComment = {
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
			User.findById(docs.posterID, async function(err, docs) {
				if (err) {
					console.log(err)
				} else {
					let user_triggered_avatar
					let user_triggered_name
					let notifs:any[] = docs.notifications
					let postInfo:any[]
					for (let i=0;i<users.length;i++) {
						if (users[i][0] == userID) {
							user_triggered_avatar = users[i][2]
							user_triggered_name = users[i][1]
						}
					}
					postInfo = await Post.findById(id, 'title').exec();
					notifs.push({
						type:'comment', 
						body: reqbody, 
						post: postInfo,
						postID: id,
						user: user_triggered_name,
						avatar: user_triggered_avatar
					 })
					docs.notifications = notifs
					docs.save()
				}
			})

			User
			res.json(newComment)
		})
	} catch(err) {
		res.send(err)
	}
	
})

app.get('/notifications', async(req,res)=> {
	res.render('notifications.ejs', {topic: "- notifications"})
})

app.post('/api/post/comment_nested/', async(req, res) => {
	const {body:reqbody, id, parentID} = req.body

	let token
	let userID
	let username

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		username = verified.name
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]
	try {
		Post.findById(id, function(err, docs) {
			// docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)
			let parentCommentIndex = docs.comments.findIndex(x => x._id == parentID)
			let randomID = Math.floor(Math.random() * Date.now()), // generates a random id
			oldComment = docs.comments[parentCommentIndex]
			let newComment = {
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
	let token
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		return true
	} catch(err) {
		return false
	}
}

app.put('/vote/:id/:y', function(req,res) {
	let id = (req.params.id).substring(13)
	let change = req.params.y
	let token
	let userID

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	try {
		Post.findOne({_id: id }, function (err, docs) { 
			let upvotes = docs.upvotes
			let downvotes = docs.downvotes
			let total_votes = docs.total_votes
			let users_upvoted = docs.users_upvoted
			let users_downvoted = docs.users_downvoted

			let user_already_upvoted = users_upvoted.includes(userID)
			let user_already_downvoted = users_downvoted.includes(userID)
			let posterid = docs.posterID


			if (change == 1) {
				if (user_already_upvoted) {
					// do nothing
				} else {
					Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err, update) {
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
	let postid = req.params.postid
	let token
	let userID

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

app.put('/api/put/filter_nsfw/:show/', function(req,res) {
	let show = req.params.show
	let token
	let userID

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	User.findByIdAndUpdate(userID, {$set: {show_nsfw: show}}, function (err, docs) {
		if (err) {
			return res.json({ status:"error", code:400, error: err})
		} else{
			res.json({status:'ok'})
		}
	})
	
})

app.put('/api/put/comment/delete/:postid/:id', async function(req,res) {
	let id = req.params.id
	let postid = req.params.postid
	let token
	let userID

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	let post = await Post.findById(postid)
	let ncomments = post.comments
	let index
	for (let i=0;i<ncomments.length;i++) {
		if (ncomments[i]._id == id) {
			index = i
		}
	}

	ncomments[index].status = 'deleted'
	let ctbd = ncomments[index]
	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]

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
	let pID = req.params.parentid
	let id = req.params.commentid
	// These two variables are only for nested comments
	let nestedBoolean = req.params.nestedboolean
	let commentParentID = req.params.commentParentID 
	let token
	let userID
	//
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}
	Post.findByIdAndUpdate(pID, {$set: {last_touched_timestamp: Date.now()}})

	if (nestedBoolean == "true") {
		try {
			let comIndex
			let ncIndex
			Post.findById(pID, function(err, docs) {
				let oldComArray = docs.comments
	
				for (let i=0;i<oldComArray.length;i++) {
					for (let x=0;x<oldComArray[i].nested_comments.length;x++) {
						if (oldComArray[i].nested_comments[x].id == id) {
							
							comIndex = i
							ncIndex = x
						}
					}
				}

				let nc = oldComArray[comIndex].nested_comments[ncIndex]

				let nestedCommentPosterId = nc.posterid
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
					let userIDinArray = nc.users_voted.indexOf(userID)
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
				let oldComArray = docs.comments
				let index
	
				for (let i=0;i<oldComArray.length;i++) {
					if (oldComArray[i]._id == id) {
						index = i
					}
				}
				let oldVotes = oldComArray[index].total_votes
				let newVotes = oldVotes+1
				let newVotesDown = oldVotes-1
				let commentPosterID = oldComArray[index].posterID
				
				
				if (oldComArray[index].users_voted.includes(userID)) {
					let userIDinArray = oldComArray[index].users_voted.indexOf(userID)
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
		Post.find({poster:'robot'}, function(err, docs) {
			for (let i=0;i<docs.length;i++) {
				Post.findByIdAndDelete(docs[i].id, function(err, response) {
				})
			}
		})
	} catch(err) {
	}

	
}

deleteTestPosts()

function compare( a, b ) {
	if ( a.last_touched_timestamp < b.last_touched_timestamp ){
	  return 1;
	}
	if ( a.last_touched_timestamp > b.last_touched_timestamp ){
	  return -1;
	}
	return 0;
}

app.get('/search/', async(req,res) => {
	res.render('home.ejs', {topic: "- search"})
})

app.get('/api/get/search/', async(req,res) => {
	let token
	let userID

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

	var regex_q = new RegExp(req.query.query, 'i');

	if (req.query.topic) {
		var regex_t = new RegExp(req.query.topic, 'i');
		Post.find({status:'active', title: regex_q, topic: regex_t}, function(err, docs) {
			postsonpage = docs
			for (let i=0;i<docs.length;i++) {
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
					let indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
					postsonpage[i].posterAvatarSrc = users[indexOfUser][2]
				} else {
					console.log("error loading user... do they exist?")
				}
			}
			res.send(postsonpage)
		})
	} else {
		Post.find({status:'active', title: regex_q}, function(err, docs) {
			postsonpage = docs
			for (let i=0;i<docs.length;i++) {
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
					let indexOfUser = users.findIndex(x => x[0] == postsonpage[i].posterID)
					postsonpage[i].posterAvatarSrc = users[indexOfUser][2]
				} else {
					console.log("error loading user... do they exist?")
				}
			}
			res.send(postsonpage)
		})
	}

})

app.get('*', async(req, res) => {
	res.render('error.ejs', {layout: 'layouts/error.ejs', topic:"PAGE NOT FOUND", error:((req.url).replace('/',''))})
})

function getFullDateTimeAndTimeStamp() {
	let datetime = new Date()
	let month = datetime.getUTCMonth()+1
	let day = datetime.getUTCDate()
	let year = datetime.getUTCFullYear()
	let hour = datetime.getUTCHours()
	let minute = datetime.getUTCMinutes()
	let timestamp = Date.now()
	let ampm
	let strminute = ""+ minute

	if (hour > 12) {
		ampm = "PM"
		hour -= 12
	} else {
		ampm = "AM"
	}
	if (minute < 10) {
		strminute = "0"+minute
	}

	let fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+strminute+" "+ampm+" UTC"
	return [fulldatetime,timestamp]

}

app.listen(process.env.PORT || 3000) 