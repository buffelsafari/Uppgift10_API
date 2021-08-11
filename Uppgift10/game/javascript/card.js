"use strict";
export class Card
{
    #valueImage;
    #cardDiv;
    #value;
    #suit;
    #link;

    #yOffset;
    #xOffset;

    #x;
    #y;
    #z;
    #width;
    #height;

    #isRoot;
    #isFlipped;

    #rootType;
    
    get element()
    {
        return this.#cardDiv;
    }

    get value()
    {
        return this.#value;
    }

    get suit()
    {
        return this.#suit;
    }

    get x()
    {
        return this.#x;        
    }
    get y()
    {
        return this.#y;
    }

    get isRoot()
    {
        return this.#isRoot;
    }
    get isFlipped()
    {
        return this.#isFlipped;
    }
    get rootType()
    {
        return this.#rootType;
    }

    setImage(frontUrl)
    {
        this.#valueImage=document.createElement("img");
        this.#valueImage.setAttribute("src", frontUrl);        
        this.#valueImage.setAttribute("height", "100%");
        this.#valueImage.setAttribute("width", "100%");        
        this.#cardDiv.appendChild(this.#valueImage);
        return this;
    }

    setValueAndSuit(value, suit)
    {   
        // translating the values to a math friendly format
        switch(value)
        {
            case "ACE":
                value=1;
                break;
            case "2":
                value=2;
                break;
            case "3":
                value=3;
                break;
            case "4":
                value=4;
                break;
            case "5":
                value=5;
                break;
            case "6":
                value=6;
                break;
            case "7":
                value=7;
                break;
            case "8":
                value=8;
                break;
            case "9":
                value=9;
                break;
            case "10":
                value=10;
                break;
            case "JACK":
                value=11;
                break;
            case "QUEEN":
                value=12;
                break;
            case "KING":
                value=13;
                break;
        }

        switch(suit)
        {
            case "HEARTS":
                suit=0;
                break;
            case "CLUBS":
                suit=1;
                break;
            case "DIAMONDS":
                suit=2;
                break;
            case "SPADES":
                suit=3;
                break;
        } 
        
        this.#value=value;
        this.#suit=suit;
        return this;
    }

    // makes the front image invisible
    setSide(flipped)
    {
        this.#isFlipped=flipped;
        if(flipped)
        {
            this.#valueImage.style.display="block";
        }
        else
        {
            this.#valueImage.style.display="none";
        }
        return this;
    }    

    constructor()
    { 
        this.#isRoot=false;

        this.#xOffset=0;
        this.#yOffset=40;        

        this.#width=125;  // todo softkoda
        this.#height=175;
        
        this.#cardDiv=document.createElement("div");
        this.#cardDiv.classList.add("card");

        let car=document.getElementById("table");
        car.appendChild(this.#cardDiv);
        
    }

    setAsRoot(type)
    {
        this.#rootType=type;
        this.#isRoot=true;
        return this;
    }

    setPosition(x,y,z)
    { 
        this.#x=x;
        this.#y=y;
        this.#z=z;
        this.#cardDiv.style.left=x+"px";
        this.#cardDiv.style.top=y+"px";
        this.#cardDiv.style.zIndex=z;
        
        if(this.#link)
        {
            let xOff=0;
            let yOff=0;
                        
            if(!this.#isRoot)
            {
                switch(this.#rootType)      // todo elegantare
                {
                    case "tableau":
                        yOff=10;               
                        if(this.#isFlipped)
                        {
                            yOff=35;
                        }
                        break;
                    case "foundation":
                        yOff=5;
                        break;
                    case "talon":
                        xOff=0;
                        yOff=0;
                        break;
                    case "waste":
                        xOff=0;
                        yOff=0;
                        break;        

                }
            } 
            this.#link.setPosition(x+xOff, y+yOff, z+1);            
        }

        return this;
    }

    link(childCard)
    {
                
        if(this.#link)
        {
            return this.#link.link(childCard);
        }
        else
        {            
            this.#link=childCard;            
            this.setRootType(this.#rootType);
            this.setPosition(this.#x, this.#y, this.#z);
            return false;            
        }        
    }

    validateLink(childCard)
    {
        let lastNode=this.getTopCard();
        
        switch(this.#rootType)
        {
            case "foundation":
                if(lastNode.isRoot && childCard.value===1)
                {
                    return true;
                }
                if((lastNode.value+1) == childCard.value && lastNode.suit==childCard.suit)
                {
                    return true;
                }
                return false; 

            case "tableau":
                if(lastNode.isRoot && childCard.value===13)
                {
                    return true;
                }
                if((lastNode.value-1) == childCard.value && (lastNode.suit+childCard.suit)%2!==0)
                {
                    return true;
                }

                return false;
            case "talon":
                return false;
            case "waste":
                return false;        
        }

        return false;
    }

    hasChild()
    {
        if(this.#link)
        {
            return true;
        }
        return false;     
    }


    setRootType(type)
    {        
        this.#rootType=type;
        if(this.#link)
        {
            this.#link.setRootType(type);
        }
    }

    

    split(splitCard)  //
    {
        if(this.#link==splitCard)
        {            
            this.#link=null;
            return this;
            
        }
        if(this.#link)
        {
            return this.#link.split(splitCard);
        }
        
    }

    getCardAt(x,y)
    {        
        let ret=null;        
        if(this.#link)
        {
            ret= this.#link.getCardAt(x, y);
        }
        if(!ret)
        {
            if(x>this.#x && x<this.#x+this.#width && y>this.#y && y<this.#y+this.#height)
            {
                if(this.#isRoot)
                {
                    return null;
                }

                if(this.#link && this.#rootType!=="tableau")  // only tableau allows multipick, todo move somewhere else?
                {
                    return false;
                }
                return this;
            }
        }
        return ret;

    }

    getOverlap(selectedCard)
    {
        let intersectX=this.#width-Math.abs(this.#x-selectedCard.x);        
        if(intersectX<=0)
        {
            return 0;
        }

        var intersectY=this.#height-Math.abs(this.#y-selectedCard.y);        
        if(intersectY<=0)
        {
            return 0;
        }
        return intersectX*intersectY;
    }

    getTopCard()
    {
        if(this.#link)
        {
            return this.#link.getTopCard();
        }
        return this;        
    }

    pressSingleInstance(x,y)  // made only for talon
    {
        if(x>this.#x && x<this.#x+this.#width && y>this.#y && y<this.#y+this.#height)
        {
            return true;
        }
        return false;
    }
}


   