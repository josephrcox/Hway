var randomWords = require('random-words');

const DataStore = require('nedb');
posts = new DataStore('data/posts.db');
posts.loadDatabase();

users = new DataStore('data/users.db')
users.loadDatabase();


app.get('/all/:sorting/:page', function(req, res) {
    page = req.params.page
    postsonpage = []
    if (req.params.sorting == "1") {
        posts.find({}).sort({votes: -1}).exec(function (err, docs) {
            totalPosts = docs.length
            totalPages = Math.ceil((totalPosts)/postsPerPage)
            lastPagePosts = totalPosts % postsPerPage

            postsonpage = paginate(docs, postsPerPage, page)

            res.send(JSON.stringify(postsonpage))
        });
    } else {
        posts.find({}).sort({votes: 1}).exec(function (err, docs) {
            res.send(JSON.stringify(docs))
        });
    }
});

app.get('/posts/:postid', function(req, res) {
    id = req.params.postid
    posts.find({_id: id}, function (err, docs) {
        res.send(JSON.stringify(docs))
    });
    
});

app.get('/posts/:postid/comments', function(req, res) {
    id = req.params.postid

    comments = new DataStore({filename: 'data/comments/'+id+".db"})
    comments.loadDatabase()
    //posts.find({}).sort({votes: -1}).exec(function (err, docs) {
    comments.find({}).sort({votes: -1}).exec(function (err, docs) {
        res.send(JSON.stringify(docs))
    });
});

function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

app.get('/admin/topicsinfo', function(req, res) {
    topicArray = []
    topicCount = []
    posts.find({}).sort({votes: -1}).exec(function (err, docs) {
        for (i=0;i<docs.length;i++) {
            if (topicArray.includes(docs[i].topic)) {
                index = topicArray.indexOf(docs[i].topic)
                topicCount[index] = parseInt(topicCount[index]+1)
            } else {
                topicArray.push(docs[i].topic)
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
    });
});

app.get('/t/:topic', function(req, res) {
    posts.find({topic: req.params.topic}).sort({votes: -1}).exec(function (err, docs) {
        res.send(JSON.stringify(docs))
    });
});

app.get('/admin/getusers', function(req, res) {
    users.find({}, function (err, docs) {
        res.send(JSON.stringify(docs))
    });
});

app.get('/admin/gettopics', function(req, res) {
    posts.find({}, function (err, docs) {
        res.send(JSON.stringify(docs))
    });
});

app.post('/admin/clear', function(req, res) {
    posts.remove({}, { multi: true }, function (err, numRemoved) {
    });
});

app.post('/post/', function(req, res) {
    tit = req.body.title
    desc = req.body.description
    user = req.body.poster
    usernameValidOverride = req.body.usernameValid
    password = req.body.password
    top = req.body.topic
    if (password != undefined) {
        password.replace(' ','')
    }

    if (password == null || password == ""){
        //password is empty
        hasPassword = false
    } else {
        hasPassword = true
    }

    if (user == "zzdj" || user == null) {
        user = (randomWords({ exactly: 2, join: '' }))+Math.floor(Math.random() * (99 - 1) + 1)
    }

    users.count({username: user}, function (err, docs) {
        if ((docs > 0) && (usernameValidOverride == false)) {
            usernameTaken = true
            res.sendStatus(406)
        } else {
            let post_datetime = new Date()
            month = post_datetime.getMonth()+1
            day = post_datetime.getDate()
            year = post_datetime.getFullYear()
            hour = post_datetime.getHours()
            minute = post_datetime.getMinutes()
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

            fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm

            doc = {
                type: "normal",
                title: tit,
                description: desc,
                poster: user,
                pw:password,
                haspw:hasPassword,
                topic: top,
                votes: 1,
                upvotes: 1,
                downvotes: 0,
                comments: 0,
                datetime: fulldatetime,
                exactdatetime: timestamp
            }

            posts.insert(doc, function (err, newDoc) {
                id = newDoc._id
                comments = new DataStore({filename: 'data/comments/'+id+".db"})
                comments.loadDatabase()
            });
            

            docu = {username: user, taken: true, posts: 1, exactdatetime: timestamp}

            users.count({username: user}, function (err, docs) {
                if (docs == 0) {
                    users.insert(docu, function (err, newDoc) {
                        res.sendStatus(202)
                    });
                } else {
                    res.sendStatus(202)
                }
            });

        }
    });
});

app.post('/post/link', function(req, res) {
    tit = req.body.title
    href = req.body.link
    user = req.body.poster
    usernameValidOverride = req.body.usernameValid
    password = req.body.password
    top = req.body.topic
    if (password != undefined) {
        password.replace(' ','')
    }

    if (password == null || password == ""){
        //password is empty
        hasPassword = false
    } else {
        hasPassword = true
    }

    if (user == "zzdj" || user == null) {
        user = (randomWords({ exactly: 2, join: '' }))+Math.floor(Math.random() * (99 - 1) + 1)
    }

    users.count({username: user}, function (err, docs) {
        if ((docs > 0) && (usernameValidOverride == false)) {
            usernameTaken = true
            res.sendStatus(406)
        } else {
            let post_datetime = new Date()
            month = post_datetime.getMonth()+1
            day = post_datetime.getDate()
            year = post_datetime.getFullYear()
            hour = post_datetime.getHours()
            minute = post_datetime.getMinutes()
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

            fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm

            doc = {
                type: "link",
                title: tit,
                link: href,
                poster: user,
                pw:password,
                haspw:hasPassword,
                topic: top,
                votes: 1,
                upvotes: 1,
                downvotes: 0,
                comments: 0,
                datetime: fulldatetime,
                exactdatetime: timestamp
            }

            posts.insert(doc, function (err, newDoc) {
            });

            docu = {username: user, taken: true, posts: 1, exactdatetime: timestamp}

            users.count({username: user}, function (err, docs) {
                if (docs == 0) {
                    users.insert(docu, function (err, newDoc) {
                        res.sendStatus(202)
                    });
                } else {
                    res.sendStatus(202)
                }
            });

        }
    });
});

app.post('/post/media', function(req, res) {
    tit = req.body.title
    user = req.body.poster
    usernameValidOverride = req.body.usernameValid
    password = req.body.password
    url = req.body.src
    top = req.body.topic

    if (password != undefined) {
        password.replace(' ','')
    }

    if (password == null || password == ""){
        //password is empty
        hasPassword = false
    } else {
        hasPassword = true
    }

    if (user == "zzdj" || user == null) {
        user = (randomWords({ exactly: 2, join: '' }))+Math.floor(Math.random() * (99 - 1) + 1)
    }

    users.count({username: user}, function (err, docs) {
        if ((docs > 0) && (usernameValidOverride == false)) {
            usernameTaken = true
            res.sendStatus(406)
        } else {
            let post_datetime = new Date()
            month = post_datetime.getMonth()+1
            day = post_datetime.getDate()
            year = post_datetime.getFullYear()
            hour = post_datetime.getHours()
            minute = post_datetime.getMinutes()
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

            fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm

            doc = {
                type: "media",
                title: tit,
                src: url,
                poster: user,
                pw:password,
                haspw:hasPassword,
                topic: top,
                votes: 1,
                upvotes: 1,
                downvotes: 0,
                comments: 0,
                datetime: fulldatetime,
                exactdatetime: timestamp
            }

            posts.insert(doc, function (err, newDoc) {
            });

            docu = {username: user, taken: true, posts: 1, exactdatetime: timestamp}

            users.count({username: user}, function (err, docs) {
                if (docs == 0) {
                    users.insert(docu, function (err, newDoc) {
                        res.sendStatus(202)
                    });
                } else {
                    res.sendStatus(202)
                }
            });

        }
    });
});

app.put('/vote/:id/:y', function(req,res) {
    id = (req.params.id).substring(13)
    change = req.params.y
    posts.find({_id: id }, function (err, docs) {
        curUp = parseInt(docs[0].upvotes)
        curDown = parseInt(docs[0].downvotes)

        if (change == 1 || change == "1") {
            posts.update({ _id: id }, { $set: {upvotes: (curUp+1)} }, {}, function (err, numReplaced) {
                posts.update({ _id: id }, { $set: {votes: ((curUp+1)-curDown)} }, {}, function (err, numReplaced) {
                    res.sendStatus(200)
                });
            });
        }
        if (change == -1 || change == "-1") {
            posts.update({ _id: id }, { $set: {downvotes: (curDown+1)} }, {}, function (err, numReplaced) {
                posts.update({ _id: id }, { $set: {votes: ((curDown+1)-curUp)} }, {}, function (err, numReplaced) {
                    res.sendStatus(200)
                });
            });
        }
    });
})

app.put('/voteCom/:id/:pid/:y', function(req,res) {
    id = (req.params.id).substring(13)
    pid = req.params.pid


    change = req.params.y

    let comments = new DataStore({filename: 'data/comments/'+pid+".db"})
    comments.loadDatabase()

    comments.find({_id:id}, function(err, docs) {
        curUp = docs[0].upvotes
        curDown = docs[0].downvotes

        if (change == 1 || change == "1") {
            comments.update({ _id: id }, { $set: {upvotes: (curUp+1)} }, {}, function (err, numReplaced) {
                comments.update({ _id: id }, { $set: {votes: ((curUp+1)-curDown)} }, {}, function (err, numReplaced) {
                    res.sendStatus(200)
                });
            });
        }
        if (change == -1 || change == "-1") {
            comments.update({ _id: id }, { $set: {downvotes: (curDown+1)} }, {}, function (err, numReplaced) {
                comments.update({ _id: id }, { $set: {votes: ((curDown+1)-curUp)} }, {}, function (err, numReplaced) {
                    res.sendStatus(200)
                });
            });
        }
    });
})

app.get('/saveuser/', function(req, res) {
    users.find({}).sort({exactdatetime: 1}).exec(function (err, docs) {
        userCount = docs.length
        latestUserID = docs[userCount-1]

        res.send(latestUserID)
    })
})

app.post('/comment/', function(req, res) {
    id = req.body.id
    b = req.body.body
    user = req.body.poster
    usernameValidOverride = req.body.usernameValid
    password = req.body.password
    
    if (password != undefined) {
        password.replace(' ','')
    }

    if (password == null || password == ""){
        //password is empty
        hasPassword = false
    } else {
        hasPassword = true
    }

    if (user == "zzdj" || user == null) {
        user = (randomWords({ exactly: 2, join: '' }))+Math.floor(Math.random() * (99 - 1) + 1)
    }

    users.count({username: user}, function (err, docs) {
        if ((docs > 0) && (usernameValidOverride == false)) {
            usernameTaken = true
            res.sendStatus(406)
        } else {
            let comments = new DataStore({filename: 'data/comments/'+id+".db"})
            comments.loadDatabase()
            let post_datetime = new Date()
            month = post_datetime.getMonth()+1
            day = post_datetime.getDate()
            year = post_datetime.getFullYear()
            hour = post_datetime.getHours()
            minute = post_datetime.getMinutes()
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

            fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+minute+" "+ampm

            doc = {
                parent: id, 
                body: b,
                votes: 1,
                upvotes: 1,
                downvotes: 0,
                poster: user,
                pw: password,
                datetime: fulldatetime,
                exactdatetime: timestamp
            }
            
            posts.find({}, function (err, docs) {
                for (i=0;i<docs.length;i++) {
                    if (docs[i]._id == id) {
                        count = parseInt(docs[i].comments)
                        posts.update({ _id: id }, { $set: {comments: (count+1)} }, {}, function (err, numReplaced) {
                        });
                    }
                }
            });


            comments.insert(doc, function (err, newDoc) {
                res.json(newDoc)
            });

            docu = {username: user, taken: true, posts: 1, comments: 1, exactdatetime: timestamp}

            users.count({username: user}, function (err, docs) {
                if (docs == 0) {
                    users.insert(docu, function (err, newDoc) {
                    });
                } else {
                    // User already exists and is placing a new comment
                    users.find({username: user}, function (err, docs) {
                        comCount = parseInt(docs[0].comments)
                        newCount = comCount+1
                        docu = {username: user, taken: true, posts: 1, comments: newCount, exactdatetime: timestamp}
                        users.update({ username: user }, { $set: { comments: newCount } }, { multi: true }, function (err, numReplaced) {
                        });
                    })
                }
            });

        }
    });
});

app.post('/deletepost/pw/:pw/:id', function(req, res) {
    id = req.params.id
    pwEntered = req.params.pw

    posts.findOne({ _id: id }, function (err, docs) {
        if (docs.pw == pwEntered) {
            posts.remove({ _id: id }, {}, function (err, numRemoved) {
                res.send(docs)
            });
        } else {
            res.sendStatus(403)
        }
    });
});

app.post('/deletepost/:id', function(req, res) {
    id = req.params.id

    posts.find({ _id: id }, function (err, docs) {
        if (docs.hasPW == "false" || docs.hasPW == false || docs.hasPW == null) {
            posts.remove({ _id: id }, {}, function (err, numRemoved) {
                res.send(docs)
            });
        }
    });
});

app.listen(process.env.PORT || 5000)