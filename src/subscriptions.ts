let subbutton = document.getElementById('subscribe-button')
const userCheckbox = document.getElementById("subscribe_topic_checkbox") as HTMLInputElement
const subscribeTextInput = document.getElementById("subscribe_topic_input") as HTMLInputElement
let subscriptions

const getSubscriptions = async() => {
    const response = await fetch('/api/get/user/'+currentUsername+'/subscriptions')
    const data = await response.json()

   
    let str = ''
    for (let i=0;i<data.topics.length;i++) {
        str += data.topics[i][0]+','
    }

    localStorage.setItem("subscriptions", str)
    subscriptions = localStorage.getItem('subscriptions').split(',')
    

    if (window.location.href.indexOf('/h/') != -1) {
        subbutton.style.display = 'block'
        
        if (subscriptions.includes(window.location.href.split('/')[4])) {
            console.log(subscriptions.includes(currentTopic), window.location.href.split('/')[4] )
            subbutton.innerHTML = 'Unsubscribe'
        } else {
            subbutton.innerHTML = 'Subscribe'
        }
    }
    if (window.location.href.indexOf('/subscriptions') != -1) {
        let subscriptions_page_container = document.getElementById('subscriptions_page_container')

        subscriptions_page_container.innerHTML = ""
        for (let i=0;i<subscriptions.length;i++) {
            var top = Object.create(topicObject)
            top.name = subscriptions[i]
            top.display()
        }
        for (let i=0;i<data.users.length;i++) {
            var top = Object.create(topicObject)
            top.name = data.users[i][0]+" (user)"
            top.isUser = true
            top.display()
        }
    }
}

subbutton.addEventListener('click', function() {
    if (subbutton.innerHTML == 'Subscribe') {
        subscribe(currentTopic, "topic")
        subbutton.innerHTML = 'Unsubscribe'
    } else {
        unsubscribe(currentTopic, "topic")
        subbutton.innerHTML = 'Subscribe'
    }
    
})

function querySubscribeElements() {
    const elements = document.querySelectorAll('.subscribe_inline_button');
}

async function addInlineSubscribeEventListeners() {
    const elements = document.querySelectorAll('.subscribe_inline_button');

    // adding the event listener by looping
    elements.forEach(async function(elem) {
        elem.addEventListener("click", function() {
            console.log(elem.id)
            if (elem.id.indexOf("unsubscribe") != -1) {
                let topic = elem.id.split('_')[1]
                unsubscribe(topic, "topic")
                console.log(document.getElementById(elem.id))
                document.getElementById(elem.id).classList.remove('far','fa-minus-square')
                document.getElementById(elem.id).classList.add('fas','fa-plus-square')
                document.getElementById(elem.id).style.color = 'green'
                document.getElementById(elem.id).id = 'subscribeInlineButton_'+topic
            } else {
                subscribe(elem.id.split('_')[1], "topic")
                console.log(document.getElementById(elem.id))
                document.getElementById(elem.id).classList.remove('fas','fa-plus-square')
                document.getElementById(elem.id).classList.add('far','fa-minus-square')
                document.getElementById(elem.id).style.color = 'red'
                document.getElementById(elem.id).id = 'unsubscribeInlineButton_'+topic
            }
        });
    });
}


userCheckbox.addEventListener('click', function() {
    if (subscribeTextInput.placeholder == "Subscribe to a topic") {
        subscribeTextInput.placeholder = "Subscribe to a user"
    } else {
        subscribeTextInput.placeholder = "Subscribe to a topic"
    }
    
})

document.getElementById('sorting_options').style.display = 'none'

document.getElementById("subscribe_topic_input").addEventListener("keyup", function(event) {
   if (event.keyCode === 13) {
      document.getElementById("subscribe_topic_submit").click()
   }
})

document.getElementById("subscribe_topic_submit").onclick = async function() {
   let topicToSubscribe = (document.getElementById("subscribe_topic_input") as HTMLInputElement)

   if (userCheckbox.checked) {
        await subscribe(topicToSubscribe.value, "user")
   } else {
        await subscribe(topicToSubscribe.value, "topic")
   }
   
   topicToSubscribe.value = ""
}