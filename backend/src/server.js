import "dotenv/config";
import "./config/db.js";
import Room from "./models/roomModel.js";

import app from "./app.js";

import {
  handleUncaughtException,
  handleUnhandledRejection,
} from "./errorHandlers.js";
import activeRoom from "./activeRoom.js";

process.on("uncaughtException", (err) => {
  handleUncaughtException(err);
});

process.on("unhandledRejection", (err) => {
  handleUnhandledRejection(err);
});

async function periodicTask() {
  console.log("Running periodic task...");
  const currentTime = Date.now();
  console.log(activeRoom);

  for (let i = 0; i < activeRoom.length; i++) {
    const room = activeRoom[i];

    if (room.gameState === "waiting") {
      const timeDifference = currentTime - room.owner_last_fetch;
      const ownerDifference = timeDifference / 1000;
      console.log(ownerDifference);

      if (ownerDifference > 10) {
        if (!isNaN(room.player_last_fetch)) {
          const playerDifference =
            (currentTime - room.player_last_fetch) / 1000;
          if (playerDifference < 10) {
            const updatedRoom = await Room.findById(room.roomid);
            console.log("updated");
            if (updatedRoom) {
              await Room.findByIdAndUpdate(room.roomid, {
                ownerId: updatedRoom.playerId,
                ownerName: updatedRoom.playerName,
                playerId: "NaN",
                playerName: "null",
                gameState: "waiting",
              });
              break;
            }
          } else {
          }
        }

        console.log(`Removing room ${room.roomid} due to timeout.`);
        await Room.findByIdAndRemove(room.roomid);
        activeRoom.splice(i, 1);
        i--;
      }
    }
  }
}

const interval = setInterval(periodicTask, 5000);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`=============================================`);
  console.log(`Backend Server ready at http://localhost:${PORT}`);
  console.log(`=============================================`);
  process.on("SIGINT", () => {
    clearInterval(interval);
    console.log("Server is shutting down...");
    process.exit(0);
  });
});
