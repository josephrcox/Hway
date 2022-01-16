let subbutton = document.getElementById('subscribe-button');
let subscriptions;
const getSubscriptions = async () => {
    const response = await fetch('/api/get/user/' + currentUsername + '/subscriptions');
    const data = await response.json();
    let str = '';
    for (let i = 0; i < data.topics.length; i++) {
        str += data.topics[i][0] + ',';
    }
    localStorage.setItem("subscriptions", str);
    subscriptions = localStorage.getItem('subscriptions').split(',');
    subscriptions.filter(function () { return true })

    if (window.location.href.indexOf('/h/') != -1) {
        subbutton.style.display = 'block';
        if (subscriptions.includes(window.location.href.split('/')[4])) {
            console.log(subscriptions.includes(currentTopic), window.location.href.split('/')[4]);
            subbutton.innerHTML = 'Unsubscribe';
        }
        else {
            subbutton.innerHTML = 'Subscribe';
        }
    }
    if (window.location.href.indexOf('/subscriptions') != -1) {
        let subscriptions_page_container = document.getElementById('subscriptions_page_container');
        subscriptions_page_container.innerHTML = "";
        for (let i = 0; i < subscriptions.length; i++) {
            var top = Object.create(topicObject);
            top.name = subscriptions[i];
            top.display();
        }
    }
};
subbutton.addEventListener('click', function () {
    if (subbutton.innerHTML == 'Subscribe') {
        subscribe(currentTopic, "topic");
        subbutton.innerHTML = 'Unsubscribe';
    }
    else {
        unsubscribe(currentTopic, "topic");
        subbutton.innerHTML = 'Subscribe';
    }
});
function querySubscribeElements() {
    const elements = document.querySelectorAll('.subscribe_inline_button');
}
async function addInlineSubscribeEventListeners() {
    const elements = document.querySelectorAll('.subscribe_inline_button');
    elements.forEach(async function (elem) {
        elem.addEventListener("click", function () {
            let topic = elem.id.split('_')[1];
            if (elem.id.indexOf("unsubscribe") != -1) {
                if (topic != 'home') {
                    unsubscribe(topic, "topic");
                } 
                document.getElementById(elem.id).classList.remove('far', 'fa-minus-square');
                document.getElementById(elem.id).classList.add('fas', 'fa-plus-square');
                document.getElementById(elem.id).style.color = 'green';
                document.getElementById(elem.id).id = 'subscribeInlineButton_' + topic;
            }
            else {
                if (topic != 'home') {
                    subscribe(elem.id.split('_')[1], "topic");
                } 
                document.getElementById(elem.id).classList.remove('fas', 'fa-plus-square');
                document.getElementById(elem.id).classList.add('far', 'fa-minus-square');
                document.getElementById(elem.id).style.color = 'red';
                document.getElementById(elem.id).id = 'unsubscribeInlineButton_' + topic;
            }
        });
    });
}
