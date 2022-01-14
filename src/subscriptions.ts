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
       
        if (subscriptions.indexOf(currentTopic) != -1) {
            subbutton.innerHTML = 'Unsubscribe'
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