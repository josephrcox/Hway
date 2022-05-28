import { startLoaders } from "../main.js"
import { subscribeTo } from "./subscriptions.js"

const login_form = document.getElementById("reg-form") as HTMLDivElement
let login_username = document.getElementById("username") as HTMLInputElement
let login_password = document.getElementById("password") as HTMLInputElement
let login_logs = document.getElementById("logs") as HTMLDivElement
let login_submit:any

if (window.location.pathname.includes("/login")) {
    login_submit = document.getElementById('login_submit') as HTMLInputElement
    login_submit.addEventListener('click', loginUser)
}

login_password.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        startLoaders()
        login_submit.click()
    }
})

export async function loginUser() {
    let bodyJSON = {
        "name":login_username.value,
        "password":login_password.value
    }

    const fetchResponse:any = await fetch('/login', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'POST',
        body: JSON.stringify(bodyJSON)
    });
    const data = await fetchResponse.json()
    
    if (data.code == 200) {
        //localStorage.clear()
        let ref = window.location.search.split('ref=')[1]
        if (ref == undefined) {
            ref = "/"
        } 
        window.location.href = ref
    } 
    if (data.code == 400) {
        login_logs.innerHTML = data.error
    }

    if (fetchResponse.status != 200) {
        login_logs.innerHTML = fetchResponse.error;
    }
}