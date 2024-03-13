
document.getElementById('registerForm').addEventListener("submit", async (event) => { 
    event.preventDefault()
    console.log("Logging...")
    const username = document.getElementById('usernameField').value
    const email = document.getElementById('emailField').value
    const pwd = document.getElementById('pwdField').value
    const user = {username, email, pwd}
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    
    const fetchNewUserReg = await fetch('/registerNewUser', options)
    const resJson = await fetchNewUserReg.json()
    console.log(resJson)

    if(resJson.exist == false){
        const toastLiveExample = document.getElementById('sucLiveToast')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
        location.href = '/'
    }else if(resJson.exist == true){
        const toastLiveExample = document.getElementById('failLiveToast')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
    
})
