window.addEventListener("load",(event)=>
{

    document.getElementById("button").addEventListener("click", (event)=>
    {
        event.preventDefault();
        console.log(event);
        getApi(document.getElementById("input").value);
    })
    
    



})


function getApi(name)
{

    fetch("https://www.swapi.tech/api/people/?name="+name)
    .then(res => res.json())
    .then(data => 
    {
        let prop=data.result[0].properties;
        let s = `name: ${name}, height: ${prop.height}, mass: ${prop.mass}, gender: ${prop.gender}, hair color: ${prop.hair_color}`+String.fromCharCode(13, 10);

        

        let node=document.getElementById("textArea");
        node.value+=s;
        
        
    })
    .catch(err =>
    {
        let node=document.getElementById("textArea");
        node.value+="!error!"+String.fromCharCode(13, 10);
    })
        
}



