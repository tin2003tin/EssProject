import { deleteRoom, getRoom, kickRoom } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem("playerID");
  const roomId = urlParams.get("roomid");
  //Get Room
  const room = await getRoom(roomId, userId);

  //Pop Up
  const modal = document.getElementById("myModal");
  modal.style.display = "none";

});
