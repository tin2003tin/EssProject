const fixedEncryptionKey = "0123456789abcdef0123456789abcdef"; // 32 btyes (AES-256)

document
  .getElementById("myForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const userNameInput = document.getElementById("Get-Name-Input");
    const userName = userNameInput.value.trim();

    if (userName.length > 15) {
      alert("Please enter a name with 15 words or less.");
      userNameInput.value = ""; 
      return;
    }

    const user = {
      id: generateRandomToken(),
      name: userName,
    };

    if (user.name === "") {
      return;
    }

    localStorage.setItem("playerID", user.id);
    localStorage.setItem("playerName", user.name);

    window.location.href = "/room";
  });

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
