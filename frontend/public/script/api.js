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
