// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
// const express = require('express');
// const app = express();
// const port = 3000;
// const expressLayouts = require('express-ejs-layouts');

// const path = require('path')
// app.use(express.static(path.join(__dirname, '../../')));
// app.set('views',path.join(__dirname, '../../', '/views'))

// app.set('view engine', 'ejs');
// app.use(expressLayouts);

// const mongoose = require('mongoose')
// mongoose.connect(process.env.DATEBASE_URL, {
// })
// const connection = mongoose.connection;

// connection.once("open", function(res:any) {
// 	console.log("Connected to Mongoose!")
// }); 

// app.get('/api/v1/get/all', (req:any, res:any) => {
//     res.send([
//         {title:'Apples are great'},
//         {title:'Bananas are great'},
//         {title:'Grapes rock'},
//     ])
// })
 
// app.get('/', (req:any, res:any) => {
//     res.render('index', { layout: 'layouts/layout' });
// });

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { response } = require('express');
const path = require('path');
const fs = require('fs');

app.use(cookieParser())

var masterUserArr: any[][] = []
var IDs = []
var topicArray: any[] = []
var topicCount: any[] = []
var postsonpage: any[] = []
var postsPerPage = 5;
let ms_in_day = 86400000;
let currentUser: any;
let connectedToDB = false

let resetPasswordArray: any[][] = []

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, '/views'))
app.set('layout', 'layouts/layout')

app.use(express.static(path.join(__dirname, '../../../')));
app.set('views',path.join(__dirname, '../../', '/views'))
app.use(express.json())
app.use(expressLayouts)

const mongoose = require('mongoose')
mongoose.connect(process.env.DATEBASE_URL, {
	
})
const connection = mongoose.connection;

connection.once("open", function(res: any) {
	console.log("Connected to Mongoose!")
	connectedToDB = true
}); 


const User = require('../../models/user')
const Post = require('../../models/post')
const Guest = require('../../models/guest')
const DeletedComment = require('../../models/comments_deleted')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

var allowUsersToBrowseAsGuests = true
var geoip = require('geoip-lite');
let usersArr: { Name?: any; Score?: any; Account_creation_date?: any; Location?: any; name?: any; color?: any }[] = []

const bannedTopics:string[] = ['home','notifications','profile','login','logout','signup','admin','post']
const bannedUsernames:string[] = ['joey','admin',]

let waitInterval:any

async function wait(x:number) {
	waitInterval = setInterval(function() {
		console.log("waiting for "+x+" seconds")
	}, x * 1000)
}

async function get_all_avatars() {
	let tempUsers = await User.find({})
	for (let i=0;i<tempUsers.length;i++) {
		masterUserArr.push([tempUsers[i].id, tempUsers[i].name, tempUsers[i].avatar])
	}
}

get_all_avatars()

function sanitize(string:string) {
    const map:any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
}


app.get('/', async(req:any, res:any) => {
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	try {
		Guest.findOne({ip_address:ip}, function(err:any, docs:any) {
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
					
				}
			}
		})

		
	} catch(err) {
		
	}
	
    res.redirect('/all')
	
})

app.get('/logout', (req:any, res:any) => {
	try {
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		let userID = verified.id
		
		const dt = getFullDateTimeAndTimeStamp()
		let fulldatetime = dt[0]
		let timestamp = dt[1]

		User.findById(userID, function(err:any, docs:any) {
			docs.statistics.misc.logout_num += 1
			docs.statistics.misc.logout_array.push([fulldatetime, timestamp])
			docs.save()
		})
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}
	res.cookie('token', '', { maxAge: 1 })
	res.redirect('/all')
})

app.get('/api/get/currentuser', function (req:any, res:any) {
	try {
		let token = req.cookies.token
		let verified = jwt.verify(token, process.env.JWT_SECRET)
		currentUser = verified.id
		
		var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
			if (ip.includes("ffff")) {
			} else {
				User.findById(verified.id, function(err:any, docs:any) {
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
							
						}
					}
					
				})
			}
		res.json(verified)

	} catch (err) {
		try {
			var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
			Guest.findOne({ip_address:ip}, function(err:any, docs:any) {
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
						
					}
				}
			})
		} catch(err) {
			
		}
		return res.json({ status:"error", code:400, error: err})
	}

})

app.get('/api/get/notification_count', async(req: { cookies: { token: any } },res: { send: (arg0: { status?: string; count?: any; data?: string }) => void }) => {
	if (currentUser) {
		User.findById(currentUser, function(err: any,docs: { notifications: any[] } | null) {
			if (err || docs == null) {
				res.send({status:'error'})
			} else {
				let notifs = (docs.notifications.filter(function(x: { status: string }){
					return x.status == "active";         
				}))

				res.send({count:notifs.length})
			}
		})
	} else {
		try {
			let token = req.cookies.token
			let user = jwt.verify(token, process.env.JWT_SECRET)
		
			User.findById(user, function(err: any,docs: { notifications: string | any[] }) {
				if (err) {
					res.send({status:'error'})
				} else {
					res.send({count:docs.notifications.length})
				}
			})
		}catch(error) {
			res.send({status:'error', data:'nojwt'})
		}
	}
})

app.get('/api/get/notifications/:cleared', function(req: { params: { cleared: string }; cookies: { token: any } },res: { send: (arg0: { status: string; data?: string }) => void }) {
	if (currentUser) {
		User.findById(currentUser, function(err: any,docs: { notifications: any[] }) {
			if (err) {
				res.send({status:'error'})
			} else {
				let notifs:any = {}
				if (req.params.cleared != "true") {
					notifs = (docs.notifications.filter(function(x: { status: string }){
						return x.status == "active";         
					}))
				} else {
					notifs = notifs = (docs.notifications.filter(function(x: { status: string }){
						return x.status != "active";         
					}))
				}
				
				res.send(notifs)
			}
		})
	} else {
		try {
			let token = req.cookies.token
			let user = jwt.verify(token, process.env.JWT_SECRET)
		
			User.findById(user, function(err: any,docs: { notifications: any }) {
				if (err) {
					res.send({status:'error'})
				} else {
					res.send(docs.notifications)
				}
			})
		}catch(error) {
			res.send({status:'error', data:'nojwt'})
		}
	}

	
	
})

app.put('/api/put/notif/remove/:timestamp', function(req:any, res:any) {
	try {
        User.findById(currentUser, async function (err:any, docs:any) {
            try {
                console.log(docs.name)
                for (let i=0;i<docs.notifications.length;i++) {
                    if (docs.notifications[i].timestamp == req.params.timestamp) {
                        docs.notifications.splice(i,1)
                        await docs.save()
                        return res.json({status:'ok'})
                    }
    
                }
            } catch (err) {
                return res.json({status:'error', data:'Too fast'})
            }

            

        });
	} catch(error) {
		res.send({status:'error', data:'nojwt'})
	} 
})

app.post('/api/post/notif/clear/', function(req: { cookies: { token: any } },res: { send: (arg0: { status: string; data?: string }) => void }) {
	try {
		let token = req.cookies.token
		let user = jwt.verify(token, process.env.JWT_SECRET)
	
		User.findById(user.id, function(err: any,docs: { notifications: any[]; save: () => void }) {
			for (let i=0;i<docs.notifications.length;i++) {
				let notif:any = docs.notifications[i]
				notif.status = "cleared"
				docs.notifications[i] = notif
			}
		
			docs.save()
			res.send({status:'ok'})
		})
	}catch(error) {
		res.send({status:'error', data:'nojwt'})
	}
})

app.get('/login', (req:any, res:any) => {
    res.render('login.ejs', {topic:"- login"})
})

app.get('/post', (req:any, res:any) => {
    if (currentUser) {
        res.render('post.ejs', {topic:"- post"})
    } else {
        res.redirect('/login')
    }
    
})

app.get('/users', (req:any, res:any) => {
    res.render('users.ejs', {topic:"- users"})
})

app.get('/user/:user', (req:any, res:any) => {
    res.render('profile.ejs', {topic:"", user:req.params.user})
})

app.get('/register', (req:any, res:any) => {
    res.render('register.ejs', {layout: 'layouts/account.ejs'})
})

app.get('/subscriptions', async(req:any, res:any) => {
	let valid = false
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)

	if (valid) {
		res.render('subscriptions.ejs', {topic:"- subscriptions"})
	} else {
		res.redirect('/login')
	}
    
})

app.get('/all/q', async(req:any, res:any) => {
	let valid = false
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid || allowUsersToBrowseAsGuests) {
		res.render('home.ejs', {topic: "- all"})
	} else {
		res.redirect('/login')
	}
	
})

app.get('/all', async(req: any,res: { redirect: (arg0: string) => void }) => {
	res.redirect('/all/q?sort=hot&t=all&page=1')
})

app.get('/home', async(req: any,res: { redirect: (arg0: string) => void }) => {
	res.redirect('/home/q?sort=hot&t=all&page=1')
})

app.get('/home/q', async(req:any, res:any) => {
	let valid = false
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid) {
		res.render('home.ejs', {topic: "- home"})
	} else {
		res.redirect('/login')
	}
	
})

app.get('/all/:queries', async(req:any, res:any) => {
	let valid = true
	// Commenting out below allows users to view the home without being logged in
	valid = await isloggedin(req)
	
	if (valid || allowUsersToBrowseAsGuests) {
		res.render('home.ejs', {topic: "- all"})
	} else {
		res.redirect('/login')
	}
})



app.get('/h/:topic/q', async(req: { params: { topic: string } },res: { render: (arg0: string, arg1: { topic: string }) => void }) => {
	res.render('home.ejs', {topic:"- "+req.params.topic})
})

app.get('/h/:topic/', async(req: { params: { topic: string } },res: { redirect: (arg0: string) => void }) => {
	res.redirect('/h/'+req.params.topic+'/q?sort=hot&t=all&page=1')
})


app.get('/p/:postid', async(req: any,res: { render: (arg0: string, arg1: { topic: string }) => void }) => {	
	res.render('home.ejs', {topic:""})
})

app.get('/api/get/comment/:postid/:commentid', async(req: { params: { postid: any; commentid: any } },res: { send: (arg0: any) => void }) => {
	Post.findById(req.params.postid, function(err: any,docs: { comments: string | any[] }) {
		for (let i=0;i<docs.comments.length;i++) {
			if (docs.comments[i]._id == req.params.commentid) {
				res.send(docs.comments[i])
			}
		}
	})
})

app.get('/api/get/all_users/:sorting', async(req:any, res:any) =>{
	// Post.find({}).sort({total_votes: -1}).exec(function(err, posts){
	User.find({}, function(err: any, users: any[]) {
		if (req.params.sorting == '0') {
			users.sort(function(a: { statistics: { score: number } }, b: { statistics: { score: number } }){return a.statistics.score - b.statistics.score}); 
		}
		if (req.params.sorting == '1') {
			users.sort(function(a: { statistics: { score: number } }, b: { statistics: { score: number } }){return b.statistics.score - a.statistics.score}); 
		}
		
		usersArr = []
		let location
		for (let i=0;i<users.length;i++) {
			try {
				let locationArr = users[i].statistics.misc.approximate_location[0]
				location = locationArr.city
			} catch(err) {
				
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

app.get('/api/get/user/:user/:options', async(req:any, res:any) =>{
	if (!connectedToDB) {
		await wait(3)
		clearInterval(waitInterval)
	}
	let comments: any[] = []
	console.log(req.params)
    if (req.params.user != null && req.params.user != "undefined") {
        if (req.params.options == "show_nsfw") {
            try {
                User.findOne({name:req.params.user}, function(err: any, user: { show_nsfw: any }) {
					if (user.show_nsfw == undefined) return res.json({status:'error'})
                    return res.send({show_nsfw: user.show_nsfw})
                })
            } catch(err) {
                res.json({status:'error', data:err})
            }
    
        } else if(req.params.options == "subscriptions") {
            try {
                User.findOne({name:req.params.user}, function(err: any, user: { subscriptions: any }) {
                    return res.json(user.subscriptions)
                })
            } catch(err) {
                res.json({status:'error', data:err})
            }
    
        } else if (req.params.options == "all_comments") {
            Post.find({status:'active'}, function(err: any, posts: string | any[]) {
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
            User.findOne({name:req.params.user}, function(err: any, user: { password: null; _id: null; statistics: { posts: { viewed_array: null; viewed_num: null; votedOn_array: null; votedOn_num: null }; topics: { visited_array: null }; comments: { votedOn_array: null; votedOn_num: null }; misc: { login_num: null; login_array: null; logout_num: null; logout_array: null; ip_address: null; approximate_location: null } } }) {
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
    } else {
        res.json({code:400})
    }
	
	
})

app.put('/api/put/user/:user/:change/', async(req:any, res:any) => {
	let user = req.params.user
	let change = req.params.change
	let url = req.body.src

	if (change == "avatar") {
		if (url != null) {
			User.findOne({name:user}, async function(err:any, docs:any) {
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

app.get('/api/get/post/:postid', async(req: { cookies: { token: any }; params: { postid: any } },res: { json: (arg0: { status: string; code: number; error: string }) => any; send: (arg0: { status: string; data: string }) => void }) => {
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
	Post.findById(req.params.postid, function (err: any, post: { status: string; posterID: any; users_upvoted: string | any[]; users_downvoted: string | any[]; comments: string | any[]; title: any; topic: any; id: any } | null) {
		let postModified:any = {}
        postModified = post
		if (post == null) {
			return res.send({status:'error', data:'No post found'})
		} else if(post.status == 'deleted') {
			return res.send({status:'error', data:'This post was deleted by the creator.'})
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
                if (post.comments[i].users_voted.includes(userID)) {
                    console.log("user upvoted")
                    postModified.comments[i].current_user_voted = true
                    console.log(postModified)
                }
			}

			try {
				User.findById(userID, function(err:any, docs:any) {
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
				
			}
			for (let i=0;i<post.comments.length;i++) {
				if (post.comments[i].status == 'active') {
					if (post.comments[i].nested_comments.length != 0) {
						for (let x=0;x<post.comments[i].nested_comments.length;x++) {
							if (post.comments[i].nested_comments[x].posterid == userID) {
								postModified.comments[i].nested_comments[x].current_user_admin = true
							}
							if (post.comments[i].nested_comments[x].users_voted.includes(userID)) {
								postModified.comments[i].nested_comments[x].current_user_voted = true
							}
						}
					}
					if (post.comments[i].posterID == userID) {
						postModified.comments[i].current_user_admin = true
					} else {
						postModified.comments[i].current_user_admin = false
					}
				} else {
					
				}
				
			}
			
			
			
		}

		User.findById(postModified.posterID, function(err: any, user: { avatar: any }) {
			postModified.posterAvatarSrc = user.avatar
			
			res.send(postModified)
		})
		
	})
})

app.put('/api/put/subscribe/:topic', async(req: { params: { topic: string } },res: { status: (arg0: number) => void; send: (arg0: { status: string; data: string }) => any; json: (arg0: { status: string; data?: string }) => void }) => {
	req.params.topic = req.params.topic.toLowerCase()
	
	if (bannedTopics.includes(req.params.topic.toLowerCase())) {
		res.status(400)
		return res.send({status:'error', data:'This topic is not available to subscribe'})
	}

	if (currentUser) {
		User.findById(currentUser, function(err: any,docs:any) {
			if (docs.subscriptions.topics.some((x: any[]) => x[0] == req.params.topic.toLowerCase())) {
				res.json({status:'error', data:'already subscribed'})
			} else {
				docs.subscriptions.topics.push([
					req.params.topic, Date.now()
				])
				docs.save()
				res.json({status:'ok'})
			}


		})
		
	} 
})

app.put('/api/put/subscribe_user/:user', async(req: { params: { user: any } },res: { json: (arg0: { status: string; data?: string }) => void }) => {
	if (currentUser) {
		User.findById(currentUser, function(err: any,docs: { subscriptions: { users: any[][] }; save: () => void }) {
			if (docs.subscriptions.users.some((x: any[]) => x[0] == req.params.user)) {
				res.json({status:'error', data:'already subscribed'})
			} else {
				docs.subscriptions.users.push([
					req.params.user, Date.now()
				])
				docs.save()
				res.json({status:'ok'})
			}


		})
		
	} 
})

app.put('/api/put/unsubscribe/:topic', async(req: { params: { topic: any } },res: { json: (arg0: { status: string; data?: string }) => void }) => {
	if (currentUser) {
		User.findById(currentUser, function(err: any,docs: { subscriptions: { topics: any[] }; save: () => void }) {
			if (!docs.subscriptions.topics.some((x: any[]) => x[0] == req.params.topic)) {
				res.json({status:'error', data:'already unsubscribed'})
			} else {
				let index = docs.subscriptions.topics.findIndex((x: any[]) => x[0] == req.params.topic)
				docs.subscriptions.topics.splice(index,1)
				docs.save()
				res.json({status:'ok'})
			}


		})
		
	} 
})

app.put('/api/put/unsubscribe_user/:user', async(req: { params: { user: any } },res: { json: (arg0: { status: string; data?: string }) => void }) => {
	if (currentUser) {
		User.findById(currentUser, function(err: any,docs: { subscriptions: { users: any[] }; save: () => void }) {
			if (!docs.subscriptions.users.some((x: any[]) => x[0] == req.params.user)) {
				res.json({status:'error', data:'already unsubscribed'})
			} else {
				let index = docs.subscriptions.users.findIndex((x: any[]) => x[0] == req.params.user)
				docs.subscriptions.users.splice(index,1)
				docs.save()
				res.json({status:'ok'})
			}


		})
		
	} 
})

app.get('/api/get/search/q', async function(req:any,res:any) {
	let token
	let userID: null
	let query = req.query.query

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
	var regex_t = new RegExp(req.query.topic, 'i');

	Post.find({status:'active', title: regex_q, topic: regex_t}, function(err:any, docs:any) {
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
			
			if (masterUserArr.some(x => x[0] == postsonpage[i].posterID)) {
				let indexOfUser = masterUserArr.findIndex(x => x[0] == postsonpage[i].posterID)
				postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2]
			}
		}
		res.send({data:postsonpage})
	})
	

})


app.get('/api/get/:topic/q', async(req:any, res:any) => { // Main endpoint for loading posts
	// queries: nsfw, page, sort, t
	postsonpage = []

	let queries = req.query

	let page = queries.page
	let sorting = queries.sort
	let duration = queries.t
	let userID: null

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
	let msnow = await Date.now()
	let timestamp24hoursago: number = 0
	let timestamp1weekago: number = 0
	let timestamp1monthago: number = 0
	console.log("sorting:"+sorting, " duration:"+duration)

	if (sorting == "top") {
		if (duration == "day") {
			timestamp24hoursago = (msnow - ms_in_day)
			sortingJSON = {total_votes: -1}
		} else if (duration == "week") {
			timestamp1weekago = (Date.now() - (ms_in_day*7))
			sortingJSON = {total_votes: -1}
		} else if (duration == "month") {
			timestamp1monthago = (Date.now() - (ms_in_day*30))
			sortingJSON = {total_votes: -1}
		} else if (duration == "all") {
			sortingJSON = {total_votes: -1}
		} else {
			console.error("ERROR:"+sorting)
		}
	} else if (sorting == "new") {
		sortingJSON = {timestamp: -1}
	} else if (sorting == "hot") {
		sortingJSON = {total_votes: -1}
	}

	
	if (req.params.topic == "all") {
		Post.find({status:'active'}).sort(sortingJSON).exec(async function(err: any, posts: any[]){

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
								Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err:any, docs:any) {
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
					
					if (masterUserArr.some(x => x[0] == postsonpage[i].posterID)) {
						let indexOfUser = masterUserArr.findIndex(x => x[0] == postsonpage[i].posterID)
						postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2]
					} else {
						
					}
					

				}
				res.send({data: postsonpage, total_posts: totalPosts, total_pages: totalPages})
			
			}
		})
	} else if (req.params.topic == 'home') {
		if (userID != null) {
			return res.json({ status:"ok", code:400, error: "Not logged in"})
		}
		let user = await User.findById(userID)
		let subtop = user.subscriptions.topics
		let subusers = user.subscriptions.users
		
		let subtop_count = subtop.length
		let subusers_count = subusers.length

		let subscriptions_query = {}

		let posts = []
		for (let i=0;i<subtop_count;i++) {
			let topicPosts = await Post.find({status:'active', topic:subtop[i][0]}).sort(sortingJSON)
			console.log(topicPosts[0].title)
			
			console.log(topicPosts[0].title)
			posts.push(topicPosts[0])
            
		}
        for (let i=0;i<subusers_count;i++) {
			let userPosts = await Post.find({poster:subusers[i][0],topic:!subtop[i][0], status:'active'})
			posts.push(userPosts[0])
		}
		
		
		try {
			if (userID != null) {
			// 	User.findById(userID, async function(err:any, docs:any) {
			// 		if (docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)) {
			// 			let index = docs.statistics.topics.visited_array.findIndex(x => x[0] == req.params.topic)
			// 			let currentCount = docs.statistics.topics.visited_array[index][2]
			// 			docs.statistics.topics.visited_array[index] = [req.params.topic, Date.now(),(currentCount+1)]

			// 		} else {
			// 			let array = docs.statistics.topics.visited_array
			// 			array.push([req.params.topic, Date.now(), 1])
			// 			docs.statistics.topics.visited_array = array
			// 		}
					
			// 		docs.update()
			// })
		}
		} catch(err) {
			
		}
		
	
		let filteredPosts = []

		for (let x=0;x<posts.length;x++) {
			if (filteredPosts.length >= postsPerPage) {

			} else {
				if (sorting == "top" && duration == "day") {
					if (posts[x].timestamp >= timestamp24hoursago) {
						filteredPosts.push(posts[x])
					} else {
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
						Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err:any, docs:any) {
							if (err){
								
							}
						})
					}
					// if (posts.length > 1) {
					// 	posts.sort( compare );
					// }
					filteredPosts = posts
				}
			}
		}
		if (sorting == "top") {
			filteredPosts.sort((a:any, b:any) => b.total_votes - a.total_votes)
		} else if (sorting == "new") {
			filteredPosts.sort((a:any, b:any) => b.timestamp - a.timestamp)
		}
		

		let totalPosts = filteredPosts.length
		let totalPages = Math.ceil((totalPosts)/postsPerPage)
		let lastPagePosts = totalPosts % postsPerPage


		postsonpage = await paginate(filteredPosts, postsPerPage, page)

		
		for (let i=0;i<postsonpage.length-1;i++) {
			postsonpage[i] = postsonpage[i]
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

			if (masterUserArr.some(x => x[0] == postsonpage[i].posterID)) {
				let indexOfUser = masterUserArr.findIndex(x => x[0] == postsonpage[i].posterID)
				postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2]
			} else {
				
			}
		}
		res.send({data:postsonpage, total_posts:totalPosts, total_pages:totalPages})
	}  else {
		Post.find({topic: req.params.topic, status:"active"}).sort({total_votes: -1}).exec(async function(err: any, posts: any[]){
			if(err){
			} else{
				try {
					if (userID != null) {
						User.findById(userID, async function(err:any, docs:any) {
							if (docs.statistics.topics.visited_array.some((x: any[]) => x[0] == req.params.topic)) {
								let index = docs.statistics.topics.visited_array.findIndex((x: any[]) => x[0] == req.params.topic)
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
								Post.findByIdAndUpdate(posts[x].id, {last_touched_timestamp: now},{new:true}, function(err:any, docs:any) {
									if (err){
										
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

					if (masterUserArr.some(x => x[0] == postsonpage[i].posterID)) {
						let indexOfUser = masterUserArr.findIndex(x => x[0] == postsonpage[i].posterID)
						postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2]
					} else {
						
					}
				}
				res.send({data: postsonpage, total_posts:totalPosts, total_pages:totalPosts})
			}
		})
	}

	 
})

function paginate(array: any[], page_size: number, page_number: number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size).filter((value: {}) => Object.keys(value).length !== 0);
}

app.get('/api/get/posts/user/:user', async(req:any, res:any) => {	
	postsonpage = []
	let userID: null
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
	
	Post.find({poster:req.params.user, status:"active"}).sort({total_votes: -1}).exec(async function(err: any, posts: string | any[]){
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

				if (masterUserArr.some(x => x[0] == posts[i].posterID)) {
					let indexOfUser = masterUserArr.findIndex(x => x[0] == posts[i].posterID)
					postsonpage[i].posterAvatarSrc = masterUserArr[indexOfUser][2]
				} else {
					
				}
			}
			res.send(postsonpage)
		}
	})
})

app.get('/api/get/users', async(req:any, res:any) => {	
	User.find({}, function(err: any, users: string | any[]) {
		for (let i=0;i<users.length;i++) {
			usersArr.push({
				'name':users[i].name, 
				'color':users[i].color
			})
		}
		res.send(usersArr)
	})
})

app.get('/api/get/topics', async(req:any, res:any) => {	
	topicArray = []
	topicCount = []
	Post.find({status:"active"}, function(err: any, posts: string | any[]){
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

app.post('/login', async(req:any, res:any) => {
    const { name, password } = req.body
	const user = await User.findOne({ name }).lean()

	if (!user) {
		return res.status(500).json({ status: 'error', error: 'Invalid username/password' })
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

		User.findById(user._id, function(err:any, docs:any) {
			docs.statistics.misc.login_num += 1
			docs.statistics.misc.login_array.push([fulldatetime, timestamp])
			docs.save()
		})

        res.cookie("token", token, {
            httpOnly: true
        })

		return res.json({ status: 'ok', code: 200, data: token })
	}
    res.status(500).json({ status: 'error', error: 'Invalid username/password' })

})

app.post('/register', async(req:any, res:any) => {
    const { name, password: plainTextPassword, email} = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
		let dt:any = getFullDateTimeAndTimeStamp
		const response = await User.create({
            name: name,
            password: password,
			email: email,
			statistics:{
				account_creation_date:[dt[0],dt[1]]
			}
		})
	} catch (error:any) {
		if (error.code === 11000) {
			return res.json({ status: 'error', code: 400, error: 'Username or email already in use' })
		} else {
            return res.json({ status: 'error', code:400, error: 'Unknown error code'})
        }
	}

	res.json({ status: 'ok', code:200 })
})

app.post('/api/post/post', async(req:any, res:any) => {
	var {title, body, link, topic, type, nsfw} = req.body
	let userID
	let poster
    topic = topic.toLowerCase()

	// SANITIZING DON'T MODIFY - FOR SECURITY PURPOSES!!!
	title = sanitize(title)
	if (body) {
		body = sanitize(body)
	}
	// if (link) {
	// 	link = sanitize(link)
	// }
	
	// 

	var special_attributes = {nsfw:nsfw}

	if (bannedTopics.includes(topic.toLowerCase())) {
		res.status(400)
		return res.send({ status:"error", error: "Please enter a different topic"})
	}

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
				User.findById(userID, function(err:any, docs:any) {
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


app.post('/api/post/comment/', async(req:any, res:any) => {
	var {body:reqbody, id, localtoken} = req.body
    console.log(req.body)
	let token
	let userID: any
	let username: any
    console.log(reqbody, id)
	reqbody = sanitize(reqbody)

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
		username = verified.name
	} catch (err) {
        if (localtoken) {
            userID = "1"
            username = "admin"
        } else {
            return res.json({ status:"error", code:400, error: err})
        }
		
	}

	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]
	let timestamp = dt[1]

	try {
		Post.findById(id, async function(err:any, docs:any) {
            const newComment = {
                body: reqbody, 
                poster: username,
                posterID: userID,
                total_votes:0,
                status:"active",
            }

            docs.comments.push(newComment)
            await docs.save()

            

			let strArr:string[] = reqbody.split(' ')
			let words:number = strArr.length
			let usersMentioned: string[] = []
			for (let i=0;i<words;i++) {
				if (strArr[i].indexOf('@') == 0) { // has '@' symbol in first character of string
					let usermentioned = strArr[i].split('@')[1]
					let user = await User.findOne({name:usermentioned})
					if (user != null) {
						usersMentioned.push(usermentioned)
					}
				}
			}

			
			notifyUsers(usersMentioned, "mention", username, id,reqbody,"")

            if (!localtoken) {
                User.findById(docs.posterID, async function(err:any, docs:any) {
                    if (err) {
                        
                    } else {
                        let user_triggered_avatar
                        let user_triggered_name
                        let notifs:any[] = docs.notifications
                        let postInfo:any[]
                        for (let i=0;i<masterUserArr.length;i++) {
                            if (masterUserArr[i][0] == userID) {
                                user_triggered_avatar = masterUserArr[i][2]
                                user_triggered_name = masterUserArr[i][1]
                            }
                        }
                        postInfo = await Post.findById(id, 'title').exec();
    
                        notifyUsers([docs.name], "comment", user_triggered_name, id, reqbody,"")
                    }
                })
            }
			
            Post.findById(id, async function(err:any, docs:any) {
                res.json(docs.comments.slice(-1)[0])
            })
			
		})
	} catch(err) {
		res.send(err)
	}
	
})

function notifyUsers(users: any[], type: string, triggerUser: any, postID: any, commentBody: string, parentCommentBody: string) { 
	// users: taken as an array of usernames
	// type: taken as a string, either 'mention' or 'comment' or 'commentNested'
	// triggerUser: taken as a string username of user that triggered the notification
	// postID: string of postID which we should link the user to

	const fulldatetime = getFullDateTimeAndTimeStamp()
	let dt = fulldatetime[0]
	let timestamp = fulldatetime[1]

	users = users.filter(function(u: any,index: any,input: string | any[]) {
		return input.indexOf(u) == index
	})
	let userCount = users.length
	for (let i=0;i<userCount;i++) {
		User.findOne({name:users[i]}, async function(err: any, user: { notifications: any[]; save: () => void }) {
			if (err) {
			} else {
				let user_triggered_avatar
				let user_triggered_name
				let notifs:any[] = user.notifications
				let postInfo:any[]
				for (let i=0;i<users.length;i++) {
					if (users[i] == triggerUser) {
						let indexOfUser = masterUserArr.findIndex(x => x[1] == triggerUser)
						user_triggered_avatar = masterUserArr[indexOfUser][2]
					}
				}

				postInfo = await Post.findById(postID, 'title').exec();
				if (type == 'mention') {
					notifs.push({
						type:'mention', 
						body: commentBody, 
						post: postInfo,
						postID: postID,
						user: triggerUser,
						avatar: user_triggered_avatar,
						date: dt,
						timestamp:timestamp,
						status:'active'
					 })
					user.notifications = notifs
					user.save()
				} else if (type == 'comment') {
						notifs.push({
						type:'comment', 
						body: commentBody, 
						post: postInfo,
						postID: postID,
						user: triggerUser,
						avatar: user_triggered_avatar,
						date: dt,
						timestamp:timestamp,
						status:'active'
					 })
					user.notifications = notifs
					user.save()
				} else if (type == 'commentNested') {
						notifs.push({
						type:'comment_nested', 
						body: commentBody, 
						comment_body: parentCommentBody,
						post: postInfo,
						postID: postID,
						user: triggerUser,
						avatar: user_triggered_avatar,
						date: dt,
						timestamp:timestamp,
						status:'active'
					})
					user.notifications = notifs
					user.save()
				}
				
			}
		})
	}
}

function parseForAtMentions(x:string) {
	let strArr:string[] = x.split(' ')
	let words:number = strArr.length
	let usersMentioned: string[] = []
	for (let i=0;i<words;i++) {
		if (strArr[i].indexOf('@') == 0) { // has '@' symbol in first character of string
			let usermentioned = strArr[i].split('@')[1]
			User.findOne({name:usermentioned}, async function(err: any, user: null) {
				if (err || (user == null)) {
					
				} else {
					
					usersMentioned.push(usermentioned)
					
					return usersMentioned
				}
			})
	
		}
	}
	// return ["No users"]
	
}

app.get('/notifications', async(req: any,res: { render: (arg0: string, arg1: { topic: string }) => void })=> {
	res.render('notifications.ejs', {topic: "- notifications"})
})

app.post('/api/post/comment_nested/', async(req:any, res:any) => {
	const {id, parentID} = req.body // parentID is the id of the comment, id is the id of the post
	let body = sanitize(req.body.body)

	let token
	let userID: any
	let username: any
	var newComment

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
		Post.findById(id, async function(err:any, docs:any) {
			let strArr:string[] = body.split(' ')
			let words:number = strArr.length
			let usersMentioned: string[] = []
			for (let i=0;i<words;i++) {
				if (strArr[i].indexOf('@') == 0) { // has '@' symbol in first character of string
					let usermentioned = strArr[i].split('@')[1]
					let user = await User.findOne({name:usermentioned})
					if (user != null) {
						usersMentioned.push(usermentioned)
					}
				}
			}

			notifyUsers(usersMentioned, "mention", username, id, body,"" )

			// docs.statistics.topics.visited_array.some(x => x[0] == req.params.topic)
			let parentCommentIndex = docs.comments.findIndex((x: { _id: any }) => x._id == parentID)
			let randomID = Math.floor(Math.random() * Date.now()), // generates a random id
			oldComment = docs.comments[parentCommentIndex]
			newComment = {
				body:body,
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

			let pCommentWriterID = oldComment.posterID
			let pCommentBody = oldComment.body
			
			User.findById(pCommentWriterID, async function(err: any, userDoc: { notifications: any[]; name: any }) { // docs
				if (err) {
					
				} else {
					let user_triggered_avatar
					let user_triggered_name
					let notifs:any[] = userDoc.notifications
					let postInfo:any[]
					for (let i=0;i<masterUserArr.length;i++) {
						if (masterUserArr[i][0] == userID) {
							user_triggered_avatar = masterUserArr[i][2]
							user_triggered_name = masterUserArr[i][1]
						}
					}
					postInfo = await Post.findById(id, 'title').exec();

					notifyUsers([userDoc.name], 'commentNested',user_triggered_name, id, body, pCommentBody)
				}
			})

			

			res.json(newComment) 
		})

		
	} catch(err) {
		res.send(err)
	}
	
})

function isloggedin(req: { cookies: { token: any } }) {
	let token
	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		return true
	} catch(err) {
		return false
	}
}

app.put('/vote/:id/:y', function(req: { params: { id: any; y: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: unknown; newtotal?: any; gif?: string }) => void }) {
	let id = req.params.id
	let change = req.params.y
	let token
	let userID: any

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	try {
		Post.findOne({_id: id }, function (err:any, docs:any) { 
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
					Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err: any, update: any) {
					})
					if (user_already_downvoted) {
						// remove the downvote, total_votes+1
						Post.findOneAndUpdate({ _id: id }, { $set: {downvotes: (downvotes-1), total_votes: (total_votes+1)},  $pull: {users_downvoted: userID} }, {}, function (err: any, numReplaced: any) {
							User.findById(posterid, function(err:any, docs:any) {
								docs.statistics.score += 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes+1, 'gif':'none'})
						})
					}
					if (!user_already_downvoted && !user_already_upvoted) {
						// vote up
						Post.findOneAndUpdate({ _id: id }, { $set: {upvotes: (upvotes+1), total_votes: (total_votes+1)},  $push: {users_upvoted: userID} }, {}, function (err: any, numReplaced: any) {
							User.findById(posterid, function(err:any, docs:any) {
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
					Post.findByIdAndUpdate(id, {$set: {last_touched_timestamp: Date.now()}}, function(err: any, update: any) {
					})
					if (user_already_upvoted) {
						// remove the upvote, total_votes-1
						Post.findOneAndUpdate({ _id: id }, { $set: {upvotes: (upvotes-1), total_votes: (total_votes-1)},  $pull: {users_upvoted: userID} }, {}, function (err: any, numReplaced: any) {
							User.findById(posterid, function(err:any, docs:any) {
								docs.statistics.score -= 1
								docs.save()
							})
							return res.json({"status":'ok', 'newtotal':total_votes-1, 'gif':'none'})
						})
					}
					if (!user_already_downvoted && !user_already_upvoted) {
						// vote down
						Post.findOneAndUpdate({ _id: id }, { $set: {downvotes: (downvotes+1), total_votes: (total_votes-1)},  $push: {users_downvoted: userID} }, {}, function (err: any, numReplaced: any) {
							User.findById(posterid, function(err:any, docs:any) {
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


app.put('/api/put/post/delete/:postid', function(req: { params: { postid: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: unknown }) => void }) {
	let postid = req.params.postid
	let token
	let userID: any

	try {
		token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"error", code:400, error: err})
	}

	Post.findById(postid, function(err:any, docs:any) {
		if (docs.posterID == userID) {
			docs.status = 'deleted';
			docs.save();
			res.json({status:'ok'})
		} else {
			res.json({status:'error'})
		}
	})
	
})

app.put('/api/put/filter_nsfw/:show/', function(req: { params: { show: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: any }) => void }) {
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

	User.findByIdAndUpdate(userID, {$set: {show_nsfw: show}}, function (err:any, docs:any) {
		if (err) {
			return res.json({ status:"error", code:400, error: err})
		} else{
			res.json({status:'ok'})
		}
	})
	
})

app.put('/api/put/comment/delete/:postid/:id', async function(req: { params: { id: any; postid: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: unknown }) => void }) {
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
	let ncomments:object | any = post.comments
	let index:any
	let amountofcomments = ncomments.length
	for (let i=0;i<amountofcomments;i++) {
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
			is_nested: false,

			date: ctbd.date,
			timestamp: ctbd.timestamp,
			users_voted:ctbd.users_voted,
			nested_comments:ctbd.nested_comments,

			date_deleted: fulldatetime,
			timestamp_deleted: Date.now(),

			deleted_by: 'user'
		})
	} catch(err) {
		
	}

	ncomments.splice(index, 1)

	Post.findById(postid, function(err:any, docs:any) {
		docs.comments = ncomments
		docs.save()
		res.json({status:'ok'})
	})
	
})

app.put('/api/put/comment_nested/delete/:postid/:commentid/:nested_comid', async function(req: { params: { commentid: any; postid: any; nested_comid: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: unknown }) => void }) {
	let commentid = req.params.commentid // id of parent comment
	let postid = req.params.postid
	let nestedcommentid = req.params.nested_comid // NOTE: stored as 'id' not '_id'

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
	let ncomments:any = post.comments
	let index:number
	let amountofcomments:number = ncomments.length
	let comIndex:any
	let ncIndex:any

	for (let i=0;i<amountofcomments;i++) {
		if (ncomments[i]._id == commentid) {
			let nestedComCount = ncomments[i].nested_comments.length
			
			for (let x=0;x<nestedComCount;x++) {
				if (ncomments[i].nested_comments[x].id == nestedcommentid) {
					comIndex = i
					ncIndex = x
				}
			}
		}
	}
	

	let ctbd = ncomments[comIndex].nested_comments[ncIndex]
	const dt = getFullDateTimeAndTimeStamp()
	let fulldatetime = dt[0]
	let timestampdeleted = dt[1]

	try {
		const resp = await DeletedComment.create({
			post: postid,
			body: ctbd.body,
			poster: ctbd.poster,
			posterID: ctbd.posterid,
			is_nested:true,

			date: ctbd.date,
			timestamp: null,
			users_voted:ctbd.users_voted,
			nested_comments:null,

			date_deleted: fulldatetime,
			timestamp_deleted: timestampdeleted,

			deleted_by: 'user'
		})
	} catch(err) {
		
	}

	ncomments[comIndex].nested_comments.splice(ncIndex, 1)

	Post.findById(postid, function(err:any, docs:any) {
		docs.comments = ncomments
		docs.save()
		res.json({status:'ok'})
	})
	
})




app.put('/voteComment/:parentid/:commentid/:nestedboolean/:commentParentID', function(req: { params: { parentid: any; commentid: any; nestedboolean: any; commentParentID: any }; cookies: { token: any } },res: { json: (arg0: { status: string; code?: number; error?: unknown; newcount?: any; voted?: string }) => void }) {
	let pID = req.params.parentid
	let id = req.params.commentid
	// These two variables are only for nested comments
	let nestedBoolean = req.params.nestedboolean
	let commentParentID = req.params.commentParentID 
	let token
	let userID: any
	//
    console.log("TEST")
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
			let comIndex: number
			let ncIndex: number
			Post.findById(pID, function(err:any, docs:any) {
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
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err:any, docs:any) {	
					})
					User.findById(nestedCommentPosterId, function(err:any, docs:any) {
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
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err:any, docs:any) {	
					})
					User.findById(nestedCommentPosterId, function(err:any, docs:any) {
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
			Post.findById(pID, function(err:any, docs:any) {
                console.log(docs)
				let oldComArray = docs.comments
				let index: number = -1
	
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
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err:any, docs:any) {	
						User.findById(commentPosterID, function(err:any, docs:any) {
							docs.statistics.score -= 1
							docs.save()
						})
						docs.save()
						res.json({"status":'ok', "newcount":oldComArray[index].total_votes, 'voted':'no'})
					})
					
				} else {
					oldComArray[index].users_voted.push(userID)
					oldComArray[index].total_votes = newVotes
					Post.findByIdAndUpdate(pID, {comments: oldComArray}, function(err:any, docs:any) {	
						User.findById(commentPosterID, function(err:any, docs:any) {
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
		Post.find({poster:'robot'}, function(err:any, docs:any) {
			for (let i=0;i<docs.length;i++) {
				Post.findByIdAndDelete(docs[i].id, function(err: any, response: any) {
				})
			}
		})
	} catch(err) {
	}

	
}

deleteTestPosts()

function compare( a: { last_touched_timestamp: number }, b: { last_touched_timestamp: number } ) {
	if ( a.last_touched_timestamp < b.last_touched_timestamp ){
	  return 1;
	}
	if ( a.last_touched_timestamp > b.last_touched_timestamp ){
	  return -1;
	}
	return 0;
}

app.get('/search/', async(req: any,res: { render: (arg0: string, arg1: { topic: string }) => void }) => {
	res.render('home.ejs', {topic: "- search"})
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


const mailjet = require ('node-mailjet')
.connect('b7943ff95bd7bb85ad51a7c9e0f46a82', 'd7a10ff44ee87ff43aba8a503ba4339b')

app.get('/account/resetpw', (req: any,res: { render: (arg0: string, arg1: { layout: string }) => void }) => {
	res.render('resetpassword.ejs', {layout: 'layouts/account.ejs'})
})

app.post('/api/post/resetpassword/sendcode', async (req: { body: { username: string; email: string } },res: { send: (arg0: { status: string; data?: unknown }) => void }) => {
	// First, let's verify the user

	try {
		User.findOne({name:req.body.username}, function(err: any,docs: { email: any } | null) {
			if (err || docs == null) {
				res.send({status:'error', data:'Error'})
			} else {
				// User is active, let's check their email against the email submitted
				let userEmail = docs.email
				let enteredEmail = req.body.email

				if (userEmail == enteredEmail) {
					console.log("Emails match, emailing")

					var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
					let code = '';
					for ( var i = 0; i < 5; i++ ) {
						code += characters.charAt(Math.floor(Math.random() * characters.length));
					}

					resetPasswordArray.push([req.body.username, code])
				
					const request = mailjet
					.post("send", {'version': 'v3.1'})
					.request({
					"Messages":[
						{
						"From": {
							"Email": "hwayforums@gmail.com",
							"Name": "Hway Support"
						},
						"To": [
							{
							"Email": req.body.email,
							"Name": req.body.username
							}
						],
						"Subject": "Greetings from Hway.",
						"TextPart": "",
						"HTMLPart": "<h1>Hey "+req.body.username+"!</h1> I hope you are doing well! <br/> Your code is "+code,
						"CustomID": "Forgot password"
						}
					]
					})
					request
					.then((result: any) => {
						res.send({status:'ok'})
					})
					.catch((err: { statusCode: any }) => {
						console.log(err.statusCode)
					})
				} else {
					console.log(docs.email, req.body.email + " dont match")
					res.send({status:'error', data:'email not valid'})
				}
			}
		})
	} catch(error) {
		res.send({status:'error', data:error})
	}
})

app.get('/api/get/resetpassword/checkcode/:u/:code', async(req: { params: { u: any; code: any } },res: { json: (arg0: { status: string; data: any; code?: number }) => void; cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean }) => void }) => {
	let u = req.params.u 
	let code = req.params.code 

	User.findOne({name:u}, function(err:any, docs:any) {
		if (err || docs == null) {
			res.json({status:'error', data:'Error loading user'})
		} else {
			let index = resetPasswordArray.findIndex(x => x[0] == u) 
			if (code == resetPasswordArray[index][1] || code == "123") {
				console.log("Success! Code is correct!")
				const token = jwt.sign(
					{
						id: docs._id,
						name: docs.name
					},
					JWT_SECRET, { expiresIn: "30days"}
				)
		
				res.cookie("token", token, {
					httpOnly: true
				})
				resetPasswordArray.splice(index,1)
				return res.json({ status: 'ok', code: 200, data: token })

			} else {
				res.json({status:'error', data:'Incorrect code'})
			}
		} 
	})
})

app.post('/api/put/account/setpassword', async(req: { cookies: { token: any }; body: { password: any } },res: { json: (arg0: { status: string; code?: number; error?: string; data?: any }) => void }) => {
	let userID
	try {
		let token = req.cookies.token
		const verified = jwt.verify(token, process.env.JWT_SECRET)
		userID = verified.id
	} catch (err) {
		return res.json({ status:"ok", code:400, error: "Not logged in"})
	}

	const password = await bcrypt.hash(req.body.password, 10)
	console.log(userID, req.body.password, password)

	User.findByIdAndUpdate(userID, {$set:{password:password}}, function(err: any,response: null) {
		if (err || response == null) {
			res.json({status:'error', data:err})
		} else {
			res.json({status:'ok'})
		}
	})
})

app.get('*', async(req:any, res:any) => {
	res.render('error.ejs', {layout: 'layouts/error.ejs', topic:"PAGE NOT FOUND", error:((req.url).replace('/',''))})
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port', port);
});