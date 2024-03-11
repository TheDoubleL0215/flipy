document.getElementById('loginForm').addEventListener("submit", async (event) => { 
    event.preventDefault()
    //console.log("Logging...")
    const username = document.getElementById('usernameField').value
    const pwd = document.getElementById('pwdField').value
    const user = {username, pwd}
    console.log("Ezt köldöm: ", user)
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    
    const fetchNewUserLogin = await fetch('/loginUser', options)
    const resJson = await fetchNewUserLogin.json()
    console.log(resJson)
    //Expected: {exist: BOOL, pwd_valid: BOOL}

    const { exist, pwd_valid, jwt_token } = resJson;

    switch (true) {
        case exist && pwd_valid:
            location.href = '/home'
            break;
        case exist && !pwd_valid:
            console.log("Sikertelen jelszó a frontenden.");
            document.getElementById("toastMessage").innerHTML = "Helytelen jelszó!"
            document.getElementById("loginStatusToast").classList = "toast text-bg-danger"
            const toastLiveExampleFail = document.getElementById('loginStatusToast')
            const toastBootstrapFail = bootstrap.Toast.getOrCreateInstance(toastLiveExampleFail)
            toastBootstrapFail.show()
            break;
        case !exist:
            console.log("A felhasználó nem létezik a frontenden.");
            document.getElementById("toastMessage").innerHTML = "A felhasználó nem létezik!"
            document.getElementById("loginStatusToast").classList = "toast text-bg-danger"
            const toastLiveExampleNotExist = document.getElementById('loginStatusToast')
            const toastBootstrapNotExist = bootstrap.Toast.getOrCreateInstance(toastLiveExampleNotExist)
            toastBootstrapNotExist.show()
            break;
    }

    

    
})