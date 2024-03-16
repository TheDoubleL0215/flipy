async function loadAllDecks(){
    const haveDbBool = await fetch('/doesUserHaveSet')
    const resJson = await haveDbBool.json()

    document.getElementById("profileNameShower").innerHTML = resJson.username
    console.log(resJson)
    
}

loadAllDecks()