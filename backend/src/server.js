import "dotenv/config";
import "./config/db.js" ;

import app from "./app.js";

import {
  handleUncaughtException,
  handleUnhandledRejection,
} from "./errorHandlers.js";

process.on("uncaughtException", (err) => {
  handleUncaughtException(err);
});

process.on("unhandledRejection", (err) => {
  handleUnhandledRejection(err);
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`=============================================`);
  console.log(`Backend Server ready at http://localhost:${PORT}`);
  console.log(`=============================================`);
});
