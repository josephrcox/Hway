const logs = document.getElementsByClassName('np_logs')[0] as HTMLDivElement
const np_types = document.getElementsByClassName('np_type')
const title = document.getElementsByClassName('np-title')[0].children[1] as HTMLInputElement
const body = document.getElementsByClassName('np-body')[0].children[1] as HTMLTextAreaElement
var link = document.getElementsByClassName('np-link')[0].children[1] as HTMLInputElement
const file = document.getElementsByClassName('np-file')[0].children[1] as HTMLInputElement
const body_d = document.getElementsByClassName('np-body')[0] as HTMLDivElement
var link_d = document.getElementsByClassName('np-link')[0] as HTMLDivElement
const file_d = document.getElementsByClassName('np-file')[0] as HTMLDivElement
const topic = document.getElementsByClassName('np-topic')[0].children[1] as HTMLInputElement
const nsfw = document.getElementsByClassName('np-nsfw')[0].children[1] as HTMLInputElement
const submit = document.getElementsByClassName('np_submit')[0] as HTMLDivElement


let uploadedImageUrls:string[] = []


const newNewPostSubmit = async () => {
    let post_type = 1
    for (let i=0;i<np_types.length;i++) {
        if (np_types[i].getAttribute('data-selected') == "true") {
            post_type = i + 1 // model starts index at 1
            i = np_types.length + 1
        }
    }

    var check = postBouncer(post_type)

    if (check != "") {
        logs.innerText = check
        logs.style.display = "block"
    } else {
        logs.style.display = "none"
        logs.innerText = ""
        let templink = ""
        
        if (post_type == 1) {
            link.value = ""
        } else if (post_type == 2) {
            body.value = ""
            templink = link.value
        } else if (post_type == 3) {
            templink = localStorage.getItem("lastuploadedimage")+""
            body.value = ""
        }
    
        let bodyJSON = {
            "title": title.value,
            "body": body.value,
            "topic": topic.value,
            "type": post_type,
            "nsfw": nsfw.value,
            "link": templink,
        };
    
        console.log(bodyJSON)

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

    }
}

function postBouncer(post_type:number) {
    let msg = ""

    var myRegEx = /[^a-z\d]/i;
    if ((myRegEx.test(topic.value))) {
        msg = "Please enter valid topic. No spaces or characters allowed.";
    }
    if (topic.value == "") {
        topic.value = "all"
    }
    if (title.value.length < 1) {
        // all post types require a title and a topic, which defaults to "all"
        msg = "Please enter a title."
    }
    if (post_type == 2) { // link post
        // requires a link
        if (link.value.length < 1 || isValidUrl(link.value) == false) {
            msg = "Please enter valid link."
        }
    } else if (post_type == 3) { // photo post
        // requires a photo URL
        if (isValidUrl(uploadedImageUrls.pop() + "") == false) {
            msg = "Please upload a photo."
        }
    }

    return msg 
}

for (let i=0;i<np_types.length;i++) {
    np_types[i].addEventListener('click', function() {
        for (let j=0;j<np_types.length;j++) {
            np_types[j].setAttribute("data-selected", "false")
        }
        np_types[i].setAttribute("data-selected", "true")

        switch(i+1) {
            case 1:
                // text post, requires body
                body_d.style.display = 'flex'
                link_d.style.display = 'none'
                file_d.style.display = 'none'
                break;
            case 2:
                // link post, requires link
                body_d.style.display = 'none'
                link_d.style.display = 'flex'
                file_d.style.display = 'none'
                break;
            case 3:
                // photo post, requires file
                body_d.style.display = 'none'
                link_d.style.display = 'none'
                file_d.style.display = 'flex'
                break;
            
        }
    })
}

submit.addEventListener('click', newNewPostSubmit, false)

function isValidUrl(string:string) {
    const matchpattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(string);
}

file.addEventListener("change", async function() {
    let body = new FormData()
    body.set('key', 'e23bc3a1c5f2ec99cc1aa7676dc0f3fb')
    body.append('image', file.files[0])

    const fetchResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: body
    })
    const data = await fetchResponse.json();
    const url = (JSON.stringify(data.data.image.url)).replace(/["]+/g, '')

    uploadedImageUrls.push(url)
    localStorage.setItem("lastuploadedimage", url)
    console.log(uploadedImageUrls)
})