export const newPost = async() => {
    let postTitle = (document.getElementById("newPost_name") as HTMLInputElement).value;
    let topic = (document.getElementById("newPost_topic") as HTMLInputElement).value;
    let logs = (document.getElementById("newPost_logs") as HTMLDivElement);
    let newPost_type = 1
    if (topic.replace(" ", "") == "" || topic.replace(" ", "") == null || topic.replace(" ", "") == undefined) {
        topic = "all";
    }
    var myRegEx = /[^a-z\d]/i;

    if ((myRegEx.test(topic))) {
        return logs.innerHTML = "Please enter valid topic. No spaces or characters allowed.";
    }
    switch (newPost_type) {
        case 1:
            if (postTitle == "" || postTitle == null || !postTitle.replace(/\s/g, '').length) {
                logs.innerHTML = "Please enter title.";
            }
            else {
                createNewPost(1);
            }
            break;
        case 2:
            // if (postTitle == "" || postTitle == null) {
            //     logs.innerHTML = "Please enter title.";
            // }
            // else {
            //     if (document.getElementById("newPost_link").value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) {
            //         createNewPost(2);
            //     }
            //     else {
            //         logs.innerHTML = "Please enter valid URL.";
            //     }
            // }
            // break;
        case 3:
            // if (postTitle == "" || postTitle == null) {
            //     document.getElementById("newPost_logs").innerHTML = "Please enter title.";
            // }
            // else {
            //     createNewPost(3);
            // }
            // break;
    }
}

const createNewPost = async (posttype:number) => {
    let title = (document.getElementById("newPost_name") as HTMLInputElement).value;
    let body = (document.getElementById("newPost_desc") as HTMLTextAreaElement).value;
    let nsfw = (document.getElementById("newPost_nsfw") as HTMLInputElement).checked;
    var myRegEx = /[^a-z\d]/i;
    let topic = (document.getElementById("newPost_topic") as HTMLInputElement).value;
    let link = (document.getElementById("newPost_link") as HTMLInputElement).value;
    let logs = (document.getElementById("newPost_logs") as HTMLDivElement)
    let bodyJSON;
    if ((myRegEx.test(topic))) {
        return logs.innerHTML = "Please enter valid topic. No spaces or characters allowed.";
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
    // if (posttype == 3) {
    //     bodyJSON = {
    //         "title": title,
    //         "link": uploadedImageUrls.pop(),
    //         "delete_photo_link": uploadImageDeleteUrls.pop(),
    //         "topic": topic,
    //         "type": posttype,
    //         "nsfw": nsfw
    //     };
    // }
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
        logs.innerHTML = data.error;
    }
    // title.innerHTML = "";
    // body.innerHTML = "";
    // topic.innerHTML = "";
    // link.innerHTML = "";
    if (data.code == 200) {
        window.location.href = '/h/' + topic;
    }
};