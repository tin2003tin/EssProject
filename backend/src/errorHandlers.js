export function handleUncaughtException(err) {
  console.log("UncaughtException 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
}

export function handleUnhandledRejection(err) {
  console.log("UnhandledRejection 💥 Shutting down...");
  console.log(`${err}`);
  // if (server && server.close) {
  //   server.close(() => {
  //     process.exit(1);
  //   });
  // } else {
  //   process.exit(1);
  // }
}
