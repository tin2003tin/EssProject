document.addEventListener("DOMContentLoaded", () => {
    const home = document.getElementById("Navbar-Button-Home-Text");
    home.addEventListener("click", () => {
        window.location.href = "/";
    });
    
    const create = document.getElementById("Create-Button");
    create.addEventListener("click", () => {
        var joinButtonList = document.getElementById("Joining-Room");
        var newRoomButton = document.createElement("Button");
        var span1 = document.createElement("span");
        var span2 = document.createElement("span");
        var span3 = document.createElement("span");

        newRoomButton.className = "Joining-Button";
        span1.textContent = "Room1";
        span1.className ="Room";
        span2.textContent = "Player1 : tin";
        span2.className ="Player";
        span3.textContent = "Player2 : -";
        span3.className = "Player";
        newRoomButton.appendChild(span1);
        newRoomButton.appendChild(document.createElement('br'));
        newRoomButton.appendChild(span2);
        newRoomButton.appendChild(document.createElement('br'));
        newRoomButton.appendChild(span3);
        newRoomButton.addEventListener("click",() =>{
            window.location.href = "/game";
        });
        joinButtonList.appendChild(newRoomButton);
        
        /*window.location.href = "/game";*/
       
    });
    
    var join = document.getElementsByClassName("Joining-Button");
    
    for(var i = 0;i<join.length;i++ ){
        join[i].addEventListener("click",()=>{
            
            window.location.href = "/game";
            
        });
    }
    
  });