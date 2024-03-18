initialCardCounter = 0

async function loadAllDecks(){

    const deckname = localStorage.getItem("selectedDeck")

    const requestedDeck = {deckname}
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestedDeck)
    }
    
    const haveDbBool = await fetch('/requestFromDeck', options)
    const resJson = await haveDbBool.json()

    const {verifiedUserusername, searcDeckName, termArray, defArray} = resJson


    document.getElementById("profileNameShower").innerHTML = verifiedUserusername

    document.getElementById("deckNameh1").innerHTML = searcDeckName

    if (termArray.length == defArray.length)

        for (let x = 0; x < termArray.length; x++){
            createPreviewCard(termArray[x], defArray[x])
        }

    

    console.log(resJson)
    
}

loadAllDecks()

let oldTermValue, oldDefValue

function createPreviewCard(preTerm, preDef) {
    initialCardCounter++
    const singlePreCardHolder = document.getElementById("cardPreviewHolder")
    var singlePreCard = document.createElement("div")
    singlePreCard.classList.add("card", "container", "p-2", "_cardPreview")
    singlePreCard.innerHTML = `
    <div class="card-body">
        <div class="d-flex flex-wrap align-items-center justify-content-between column-gap-3 _innerCardPreviewHolder">
            <div class="d-flex p-2">
                <h2 class="me-3 mb-0">${initialCardCounter}</h2>
            <div class="vr"></div>
        </div>
        <div class="d-flex justify-content-between flex-grow-1 _twoInfoShower">
            <div class="flex-grow-1 p-2">
                <h6 class="card-text m-0 text-body-secondary">Fogalom</h6>
                <h3 class="card-title m-0" id="termText">${preTerm}</h3> 
            </div>
            <div class="flex-grow-1 p-2 d-flex flex-column align-items-end">
                <h6 class="card-text m-0 text-body-secondary text-align-end">Definíció</h6>
                <h3 class="card-title m-0" id="defText">${preDef}</h3>
            </div>
        </div>
        <button type="button" class="btn" data-bs-toggle="modal" id="openChangeDataModalBtn" data-bs-target="#changeCardInfos">
            <img src="public/img/editCardLogo.svg" alt="">
        </button>
    </div>
    `

    singlePreCardHolder.appendChild(singlePreCard)

    const openChangeDataModalBtn = singlePreCard.querySelector("#openChangeDataModalBtn");
    openChangeDataModalBtn.addEventListener("click", () => {
        oldTermValue = singlePreCard.querySelector("#termText").innerText;
        oldDefValue = singlePreCard.querySelector("#defText").innerText; 
        
    
        document.getElementById("changeTermModalInput").value = oldTermValue;
        document.getElementById("changeDefModalInput").value = oldDefValue;
    });
    
}

document.getElementById("saveChangeModalBtn").addEventListener("click", async () => {
    const newTermValue = document.getElementById("changeTermModalInput").value;
    const newDefValue = document.getElementById("changeDefModalInput").value;
    const changeData = { oldTermValue, oldDefValue, newTermValue, newDefValue };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(changeData)
    }

    const requestCardChaneg = await fetch("/changeCard", options)
    console.log(changeData);
})