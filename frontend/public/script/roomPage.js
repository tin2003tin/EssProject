import { gethealthCheck } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  button.addEventListener("click", () => {
    gethealthCheck();
  });
  const homeButton = document.getElementById("home-page-button");
  homeButton.addEventListener("click", () => {
    window.location.href = "/";
  });
  const gameButton = document.getElementById("game-page-button");
  gameButton.addEventListener("click", () => {
    window.location.href = "/game";
  });
});
