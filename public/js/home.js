async function loadAllDecks(){
    const haveDbBool = await fetch('/doesUserHaveSet')
    const resJson = await haveDbBool.json()

    document.getElementById("profileNameShower").innerHTML = resJson.username
    //console.log(resJson)
    
    if(resJson.haveDb == true){
        // Referencia a container div-re
        const cardsContainer = document.getElementById('allDeckContainer');
        const placeHolderContainer = document.getElementById('placeholderContainer');

        // Módosítás a display property-n keresztül
        cardsContainer.style.display = 'block';
        placeHolderContainer.style.display = 'none'

        // Adjunk hozzá egy saját CSS-szabályt a container div-hez
        cardsContainer.style.cssText += 'display: block !important;';
        placeHolderContainer.style.cssText += 'display: none !important;';

        console.log(resJson.cardCount)
        for(var x = 0; x < resJson.cardCount.length; x++){
            var displayCard = document.createElement("div")
            displayCard.classList.add('g-col');

            displayCard.innerHTML = `
            <div class="card _dbCardBody" style="width: 18rem;">
                <div class="card-body" role="button">
                  <h5 class="card-title">${resJson.cardCount[x].deck_name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary"></h6>
                  <div class="">
                    <div class="d-flex align-items-center gap-2">
                      <img src="/public/img/cardsIcon.svg" style="width: 25px;" alt="">
                      <p class="card-text text-center text-primary-emphasis pt-1">${resJson.cardCount[x].cardCount}db</p>
                    </div>
                  </div>
                </div>
              </div>
            `

            document.getElementById("displayCardHolder").appendChild(displayCard)
        }
    }else{
        // Referencia a container div-re
        const cardsContainer = document.getElementById('allDeckContainer');
        const placeHolderContainer = document.getElementById('placeholderContainer');

        // Módosítás a display property-n keresztül
        cardsContainer.style.display = 'none';
        placeHolderContainer.style.display = 'block'

        // Adjunk hozzá egy saját CSS-szabályt a container div-hez
        cardsContainer.style.cssText += 'display: none !important;';
        placeHolderContainer.style.cssText += 'display: block !important;';
    }
}

loadAllDecks()


document.getElementById("createNewDeckDirecter").addEventListener("click", (e) => {
    e.preventDefault()


    window.location.href = '/newDeck';
})

document.getElementById("logout_aTag").addEventListener("click", (e) => {
    
})