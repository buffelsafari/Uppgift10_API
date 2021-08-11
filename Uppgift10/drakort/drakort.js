var deck_id;

window.addEventListener("load",(event)=>
{
    document.getElementById("button").addEventListener("click", (event)=>
    {
        getApi();
    });
    
    

    

      // https://deckofcardsapi.com/static/img/5H.png
})



function getApi()
{

    if(!deck_id)
    {
        deck_id="new";
    }

    /*Skriv din kod här*/
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
     .then(res => res.json())
     .then(data =>
     {        
        let card=document.getElementById("card");
        let image = document.createElement("img");
        image.setAttribute("src", data.cards[0].image);        
        image.setAttribute("height", "100%");
        image.setAttribute("width", "100%");
        deck_id=data.deck_id;
        card.innerHTML=""; 
        card.appendChild(image);
         

         
    /*Och här*/
     })
     .catch(err =>
     {
          console.log(err);
     })
}