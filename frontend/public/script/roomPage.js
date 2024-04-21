import { createRoom, getAllRoom, gethealthCheck, joinRoom } from "./api.js";
import { BACKEND_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  //User Name
  const storedName = localStorage.getItem("playerName");
  if (storedName) {
    document.getElementById("Navbar-User").textContent = storedName;
  } else {
    document.getElementById("Navbar-User").textContent = "Guest";
  }

  //Home Button
  const homeButton = document.getElementById("Navbar-Button-Home-Text");

  homeButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  //Create Button & Pop Up
  const modal = document.getElementById("myModal");
  const nameForm = document.getElementById("nameForm");
  const nameInput = document.getElementById("nameInput");
  const createButton = document.getElementById("Create-Button");
  createButton.addEventListener("click", () => {
    modal.style.display = "block";
  });
  const closeBtn = document.getElementsByClassName("close")[0];
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  //Create Room
  nameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const roomName = nameInput.value.trim();
    if (roomName) {
      if (roomName.length > 15) {
        alert("Please enter a name with 15 characters or less.");
        nameInput.value = "";
        return;
      }

      const room = await createRoom(
        localStorage.getItem("playerID"),
        localStorage.getItem("playerName"),
        roomName
      );

      modal.style.display = "none";
      nameInput.value = "";
      window.location.href = `/game?roomid=${room._id}`;
    } else {
      alert("Please enter a room name.");
    }
  });

  //Show all Rooms
  async function showAllRooms() {
    const joiningRoomContainer = document.getElementById(
      "joiningRoomContainer"
    );

    const rooms = await getAllRoom();

    console.log(rooms);
    rooms.forEach((room) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "Joining-Button";

      const name = document.createElement("span");
      name.className = "Room";
      name.textContent = room.name;

      const playerContainer1 = document.createElement("div");
      playerContainer1.className = "player-container";
      button.appendChild(name);
      const player1 = document.createElement("div");
      player1.className = "Player";
      player1.textContent = "Player 1: ";

      const player1name = document.createElement("div");
      player1name.className = "Player";
      player1name.textContent = room.ownerName;

      playerContainer1.appendChild(player1);
      playerContainer1.appendChild(player1name);
      button.appendChild(playerContainer1);

      if (room.playerName == "null") {
        const playerContainer2 = document.createElement("div");
        playerContainer2.className = "player-container";

        const player2 = document.createElement("div");
        player2.className = "Player";
        player2.textContent = "Player 2: ";

        const player2name = document.createElement("div");
        player2name.className = "Player";
        player2name.textContent = room.playerName;

        playerContainer2.appendChild(player2);
        playerContainer2.appendChild(player2name);
        button.appendChild(playerContainer2);
      }

      button.onclick = function () {
        jointargetRoom(room._id);
      };

      joiningRoomContainer.appendChild(button);
    });
  }
  window.onload = showAllRooms;

  //Join Room
  function jointargetRoom(roomId) {
    joinRoom(roomId);
    window.location.href = `/game?roomid=${roomId}`;
  }
});
