"use strict";
import { Card } from "./card.js";

export class Game
{
    #cards=[];

    #activeCards=[];

    #tableDiv;

    #selectedCard;
    #previousLink;
    #cardOffsetX;
    #cardOffsetY;

    #talonRoot;
    #wasteRoot;
    #emptyTalon;

    constructor()
    {
        
        this.#createDeck();  // obs async
        

    }

    async #createDeck() 
    {

        return fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=52`)
        .then(res => res.json())
        .then(data =>
        {            
            if(data.success)
            {
                this.#createCards(data);

            }
        })
        .catch(err =>
        {          
            // todo something
        })
        
    }

    #createCards(data) // missleading name so far, todo refactor
    {        
        
        for(let i=0; i<data.cards.length ;i++)  // todo remove #cards[] array?
        {            
            this.#cards[i]=new Card()
                .setImage(data.cards[i].image)
                .setValueAndSuit(data.cards[i].value, data.cards[i].suit)
                .setPosition(i*15,i*10, 0)
                .setSide(true);
        }
        

        
        this.#tableDiv=document.getElementById("table");
        
        this.#tableDiv.addEventListener("mousedown", (event)=>
        {
            event.preventDefault();

            // is talon empty recycle the wadte cards
            if(this.#emptyTalon && this.#talonRoot.pressSingleInstance(event.clientX, event.clientY))
            { 
                while(this.#wasteRoot.hasChild())
                {
                    let card=this.#wasteRoot.getTopCard();                        
                    card.setSide(false);
                    this.#wasteRoot.split(card);
                    this.#talonRoot.link(card);
                }
                this.#emptyTalon=false;
                return;                
            }


            for(let i=0;i<this.#activeCards.length;i++)
            {
                
                this.#selectedCard=this.#activeCards[i].getCardAt(event.clientX, event.clientY);                               

                if(this.#selectedCard)      
                {   
                    if(this.#selectedCard.rootType=="talon")
                    { 
                        // put a card on the waste
                        let card=this.#talonRoot.getTopCard();
                        
                        card.setSide(true);
                        this.#talonRoot.split(card);
                        this.#wasteRoot.link(card);
                       
                        
                        if(!this.#talonRoot.hasChild())
                        {
                            this.#emptyTalon=true;
                            // out of talon cards                            
                        }

                        this.#selectedCard=null;
                        return;
                    } 
                    if(!this.#selectedCard.isFlipped)
                    {
                        this.#selectedCard=null;
                        return;
                    }               
                    this.#previousLink=this.#activeCards[i].split(this.#selectedCard);                    
                    this.#cardOffsetX=this.#selectedCard.x-event.clientX;
                    this.#cardOffsetY=this.#selectedCard.y-event.clientY;                   
                    return;
                }
                this.#selectedCard=null;
            }
        });
        
        this.#tableDiv.addEventListener("mouseup", (event)=>
        {    
            // drop the card in the most overlapped and valid place       
            if(this.#selectedCard)
            {
               
                let closestCard=null;
                let biggestValue=0;
                
                for(let i=0;i<this.#activeCards.length;i++)
                { 
                    let topCard=this.#activeCards[i].getTopCard();
                    if(this.#selectedCard!==topCard && topCard.validateLink(this.#selectedCard))
                    {
                        let overlapped=topCard.getOverlap(this.#selectedCard);
                        if(overlapped > biggestValue) 
                        {
                            closestCard=topCard;
                            biggestValue=overlapped;
                        }          
                    }
                }                
                if(biggestValue>10)
                {                    
                    closestCard.link(this.#selectedCard)                    
                    if(this.#previousLink!=closestCard)
                    {
                        this.#previousLink.setSide(true);
                    }                    
                }
                else
                {
                    this.#previousLink.link(this.#selectedCard);                    
                }                
            }
            this.#selectedCard=null;
        });

        this.#tableDiv.addEventListener("mousemove", (event)=>
        {
            if(this.#selectedCard)
            {
                this.#selectedCard.setPosition(event.clientX+this.#cardOffsetX, event.clientY+this.#cardOffsetY, 100);
            }         
        });


      
        // creating the active card stacks
        //---------------------------------------------------------------------------------------------------------
        let counter=0;
        for(let i=0;i<7;i++) // the 7 tablecards
        {
            this.#activeCards.push(new Card().setImage("./img/root.png").setAsRoot("tableau").setPosition(300+i*150,300, 0));
            for(let j=0;j<i;j++)
            {
                this.#activeCards[i].link(this.#cards[counter++].setSide(false));
            }            
        } 
        
        for(let i=0;i<7;i++)
        {            
            this.#activeCards[i].link(this.#cards[counter++]);
            
        } 

        //---------------------------------------------------------------------------------------------------------

        for(let i=0;i<4;i++) // the 4 ace place
        {
            this.#activeCards.push(new Card().setImage("./img/root.png").setAsRoot("foundation").setPosition(725+i*150,25, 0));
                  
        }
        
        //---------------------------------------------------------------------------------------------------------

        this.#talonRoot=new Card().setImage("./img/root.png").setAsRoot("talon").setPosition(325,25, 0);
        this.#wasteRoot=new Card().setImage("./img/root.png").setAsRoot("waste").setPosition(475,25, 0);
        this.#activeCards.push(this.#talonRoot);
        this.#activeCards.push(this.#wasteRoot);
                  
        
        for(;counter<52;counter++) // remaining cards to draw pile
        {
            this.#activeCards[11].link(this.#cards[counter].setSide(false));
        } 
        this.#emptyTalon=false; 
        
    }    

}
