async function loadAllDecks(){

    const haveDbBool = await fetch('/doesUserHaveSet')
    const resJson = await haveDbBool.json()
    console.log(resJson)
    
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