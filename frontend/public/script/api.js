import { BACKEND_URL } from "./config.js";

export async function gethealthCheck() {
  try {
    const message = await fetch(`${BACKEND_URL}/healthCheck`).then((r) =>
      r.json()
    );
    alert("Backend server : " + message.message);
  } catch {
    alert("Backend server : unhealty!!!!!");
  }
}

export async function getAllRoom() {
  const response = await fetch(`${BACKEND_URL}/room`);
  const rooms = await response.json();
  return rooms;
}

export async function getRoom(roomId, userId) {
  try {
    const message = await fetch(
      `${BACKEND_URL}/room/${roomId}?userid=${userId}`
    ).then((r) => r.json());
    if (message.error) {
      window.location.href = "/room";
    }
    return message;
  } catch (error) {
    alert("Backend server" + error);
  }
}

export async function createRoom(ownerId, ownerName, roomName) {
  try {
    const response = await fetch(`${BACKEND_URL}/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId: localStorage.getItem("playerID"),
        ownerName: localStorage.getItem("playerName"),
        name: roomName,
      }),
    });
    if (response.ok) {
      const room = await response.json();
      return room;
    } else {
      throw new Error("Failed to create room");
    }
  } catch (error) {
    console.error("Error creating room:", error);
    alert("Failed to create room. Please try again later.");
  }
}

export async function deleteRoom(roomId) {
  fetch(`${BACKEND_URL}/room/${roomId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Room deleted successfully!");
      } else {
        throw new Error("Failed to create room");
      }
    })
    .catch((error) => {
      console.error("Error creating room:", error);
    });
}

export async function joinRoom(roomId) {
  await fetch(`${BACKEND_URL}/room/join/${roomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: localStorage.getItem("playerID"),
      playerName: localStorage.getItem("playerName"),
    }),
  });
}

export async function kickRoom(roomId) {
  await fetch(`${BACKEND_URL}/room/kick/${roomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId: localStorage.getItem("playerID"),
      playerName: localStorage.getItem("playerName"),
    }),
  });
}

export async function changeGameState(roomId, gameState) {
  await fetch(`${BACKEND_URL}/room/${roomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameState: gameState }),
  });
}

export async function updateBoard(
  roomId,
  userId,
  from,
  to,
  cupture,
  isforce,
  isking
) {
  await fetch(`${BACKEND_URL}/board/${roomId}?userid=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
      from,
      to,
      cupture,
      isforce,
      isking,
    }),
  });
}
