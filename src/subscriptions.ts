let subbutton = document.getElementById('subscribe-button')
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

async function addInlineSubscribeEventListeners() {
    const elements = document.querySelectorAll('.subscribe_inline_button');

    // adding the event listener by looping
    elements.forEach(async function(elem) {
        elem.addEventListener("click", function() {
            console.log(elem.id)
            if (elem.id.indexOf("unsubscribe") != -1) {
                unsubscribe(elem.id.split('_')[1], "topic")
                console.log(document.getElementById(elem.id))
                document.getElementById(elem.id).classList.remove('far','fa-minus-square')
                document.getElementById(elem.id).classList.add('fas','fa-plus-square')
                document.getElementById(elem.id).style.color = 'green'
            } else {
                subscribe(elem.id.split('_')[1], "topic")
                console.log(document.getElementById(elem.id))
                document.getElementById(elem.id).classList.remove('fas','fa-plus-square')
                document.getElementById(elem.id).classList.add('far','fa-minus-square')
                document.getElementById(elem.id).style.color = 'red'
            }
        });
    });
}
