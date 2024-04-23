import { createRoom, getAllRoom, gethealthCheck, joinRoom } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  //User Name
  const storedName = localStorage.getItem("playerName");
  if (storedName) {
    document.getElementById("sidebar-user").textContent = storedName;
  } else {
    document.getElementById("sidebar-user").textContent = "Guest";
    const user = {
      id: generateRandomToken(),
      name: "Guest",
    };
    localStorage.setItem("playerID", user.id);
    localStorage.setItem("playerName", user.name);
  }

  //Home Button
  const homeButton = document.getElementById("home-pagee-button");

  homeButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  const loadingButton = document.querySelector(".loading");
  const spinner = document.querySelector(".spinner");
  const loadingText = document.querySelector(".loading-text");
  loadingButton.addEventListener("click", async function (event) {
    spinner.classList.add("visible");
    loadingText.classList.add("disable");
    const cards = document.querySelector(".cards");
    while (cards.firstChild) {
      cards.removeChild(cards.firstChild);
    }
    await showAllRooms();

    spinner.classList.remove("visible");
    loadingText.classList.remove("disable");
  });

  const createButton = document.querySelector("#Create-Button");
  const modal_bg = document.querySelector(".modal-background");
  createButton.addEventListener("click", function (event) {
    const modalClassList = document.querySelector(".modal-body").classList;

    if (modalClassList.contains("open")) {
      modalClassList.remove("open");
      modalClassList.add("closed");
    } else {
      modalClassList.remove("closed");
      modalClassList.add("open");
    }
  });
  modal_bg.addEventListener("click", function (event) {
    const modalClassList = document.querySelector(".modal-body").classList;

    if (modalClassList.contains("open")) {
      modalClassList.remove("open");
      modalClassList.add("closed");
    } else {
      modalClassList.remove("closed");
      modalClassList.add("open");
    }
  });
  const submitButton = document.querySelector("#Submit-Button");
  submitButton.addEventListener("click", async function (event) {
    const nameInput = document.querySelector("#input");
    const roomName = nameInput.value.trim();
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
    window.location.href = `/game?roomid=${room._id}`;
  });
  //Create Button & Pop Up
  // const modal = document.getElementById("myModal");
  // const nameForm = document.getElementById("nameForm");
  // const nameInput = document.getElementById("nameInput");
  // const createButton = document.getElementById("Create-Button");
  // createButton.addEventListener("click", () => {
  //   modal.style.display = "block";
  // });
  // const closeBtn = document.getElementsByClassName("close")[0];
  // closeBtn.addEventListener("click", () => {
  //   modal.style.display = "none";
  // });
  // window.addEventListener("click", (event) => {
  //   if (event.target === modal) {
  //     modal.style.display = "none";
  //   }
  // });

  //Create Room
  // nameForm.addEventListener("submit", async (event) => {
  //   event.preventDefault();

  //   const roomName = nameInput.value.trim();
  //   if (roomName) {
  //     if (roomName.length > 15) {
  //       alert("Please enter a name with 15 characters or less.");
  //       nameInput.value = "";
  //       return;
  //     }

  //     const room = await createRoom(
  //       localStorage.getItem("playerID"),
  //       localStorage.getItem("playerName"),
  //       roomName
  //     );

  //     modal.style.display = "none";
  //     nameInput.value = "";
  //     window.location.href = `/game?roomid=${room._id}`;
  //   } else {
  //     alert("Please enter a room name.");
  //   }
  // });

  //Show all Rooms
  async function showAllRooms() {
    const cards = document.querySelector(".cards");

    const rooms = await getAllRoom();

    console.log(rooms);

    for (let i = 0; i < rooms.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          addRoom(rooms[i], cards);
          resolve();
        }, 20);
      });
    }

    // Add empty rooms after all real rooms are added
    const remainingEmptyRooms = 24 - rooms.length;
    for (let i = 0; i < remainingEmptyRooms; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const empty_room = {
            name: "___",
            ownerName: "___",
            playerName: "___",
            empty: true,
          };
          addRoom(empty_room, cards);
          resolve();
        }, 20);
      });
    }
    const cardss = document.querySelectorAll(".card");
    const wrapper = document.querySelector(".cards");

    wrapper.addEventListener("mousemove", (event) => {
      cardss.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--xPos", `${x}px`);
        card.style.setProperty("--yPos", `${y}px`);
      });
    });
  }
  showAllRooms();

  //Join Room
  function jointargetRoom(roomId) {
    joinRoom(roomId);
    window.location.href = `/game?roomid=${roomId}`;
  }
});

function addRoom(room, cards) {
  const card = document.createElement("div");
  card.className = "card";

  const card_content = document.createElement("div");
  card_content.className = "card-content";

  const room_name = document.createElement("h3");
  room_name.textContent = room.name;

  const owner_name = document.createElement("h2");
  owner_name.textContent = "P1 : " + room.ownerName;

  const player_name = document.createElement("h2");
  player_name.textContent =
    "P2 : " + (room.playerName == "null" ? "____" : room.playerName);

  card_content.appendChild(room_name);
  card_content.appendChild(owner_name);
  card_content.appendChild(player_name);

  card.appendChild(card_content);
  if (!room.empty) {
    card.onclick = function () {
      jointargetRoom(room._id);
    };
  }

  cards.appendChild(card);
}

function jointargetRoom(roomId) {
  joinRoom(roomId);
  window.location.href = `/game?roomid=${roomId}`;
}

function generateRandomToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 16;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
