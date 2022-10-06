const form = document.getElementById("reg-form") as HTMLDivElement
let username = document.getElementById("username") as HTMLInputElement
let password = document.getElementById("password") as HTMLInputElement
let email = document.getElementById("email") as HTMLInputElement
let register_logs = document.getElementById("logs") as HTMLDivElement

let register_submit = document.getElementById('register_submit') as HTMLInputElement

import { loginUser } from "../modules/login.js"

register_submit.addEventListener('click', registerUser)

username.addEventListener('change', function() {
    if (!username.validity.valid) {
        register_logs.innerHTML = "Please make sure your username: <br/>- Has only letters, numbers, _'s, and -'s<br/>- Is 3-30 characters"
    } else {
        register_logs.innerText = ""
    }
})

password.addEventListener('change', function() {
    //console.log(password.validity)
    if (!password.validity.valid) {
        
        register_logs.innerHTML = "Please make sure your password: <br/>- Is 8-50 characters"
    } else {
        register_logs.innerText = ""
    }
})

async function registerUser() {
    if (password.value.length < 8 || password.value.length > 50 || username.value.length < 3 || username.value.length > 30 || !username.validity.valid || !password.validity.valid) {
        register_logs.innerHTML = "Please make sure your username: <br/>- Has only letters, numbers, _'s, and -'s<br/>- Is 3-30 characters"
        register_logs.innerHTML += "<br/><br/>Please make sure your password: <br/>- Is 8-50 characters"

    } else {
        let bodyJSON = {
            "name":username.value,
            "password":password.value,
            "email":email.value
        }
    
        const fetchResponse:any = await fetch('/api/post/register', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        });
        const data = await fetchResponse.json()
         
        if (data.code == 200) {
            loginUser()
        } 
        if (data.code == 400) {
            register_logs.innerHTML = data.error
        }
    
        if (fetchResponse.status != 200) {
            register_logs.innerHTML = fetchResponse.error;
        }
    }
}