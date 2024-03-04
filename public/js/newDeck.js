let cardCounters = [2];
if(cardCounters[0] == 1){
    cardCounters.shift()
}

document.getElementById('newCardDisplayer').addEventListener('click', function() {

    var cardContainer = document.getElementById('cardContainer');
    var currentCardCounter = Math.max(...cardCounters);
    
    // Új kártya létrehozása
    var ujKartya = document.createElement('div');
    ujKartya.classList.add('card');
    
    // Tartalom hozzáadása a kártyához
    ujKartya.innerHTML = `
    <div class="card-body">
    <div class="d-flex flex-wrap align-items-center justify-content-between column-gap-3">
    <div class="d-flex p-2">
    <h2 class="me-3 mb-0">${currentCardCounter}</h2>
    <div class="vr"></div>
    </div>
    <div class="flex-grow-1 p-2">
    <input type="text" class="form-control form-control-lg text-primary" placeholder="Fogalom" aria-label="Fogalom" name="termFieldName" required aria-describedby="basic-addon1" autocomplete="off">
    </div>
    <div class="flex-grow-1 p-2">
    <input type="text" class="form-control form-control-lg text-primary" placeholder="Definíció" aria-label="Fogalom" name="defFieldName" required aria-describedby="basic-addon1" autocomplete="off">
    </div>
    <button type="button" class="btn-close removeCardBtn" aria-label="Close"></button>
    </div>
    </div>
    `;
    
    cardContainer.appendChild(ujKartya);
    cardCounters.push(currentCardCounter + 1);
    
    var removeCardBtns = document.getElementsByClassName('removeCardBtn');
    for (var i = 0; i < removeCardBtns.length; i++) {
        removeCardBtns[i].addEventListener('click', removeCard);
    }
});

function removeCard(event) {
    var cardToRemove = event.target.closest('.card');
    if (cardToRemove) {
        cardToRemove.remove();
        updateCardNumbers();
    }
    if(cardCounters[0] == 1){
        cardCounters.shift()
        cardCounters[0] = 2
    }
    //console.log(cardCounters)
}

function updateCardNumbers() {
    var cardNumbers = document.querySelectorAll('.card h2');
    cardCounters = [];
    cardNumbers.forEach(function(number, index) {
        cardCounters.push(index + 1);
        number.textContent = index + 1;
    });

}

document.getElementById("newDeckTitleDescriptionForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const termFieldValues = document.getElementsByName("termFieldName")
    for(var i = 0; i < termFieldValues.length; i++){
        console.log(termFieldValues[i].value)
    }
})
