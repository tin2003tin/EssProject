import { gethealthCheck } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  button.addEventListener("click", () => {
    gethealthCheck();
  });
  const roomButton = document.getElementById("room-page-button");
  roomButton.addEventListener("click", () => {
    window.location.href = "/room";
  });
});
