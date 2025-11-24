import * as signalR from "@microsoft/signalr";

let connection = null;

export async function startConnection() {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/locationHub", {
      accessTokenFactory: () => localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .build();

  connection.onclose(() => {
    console.log("Connection closed. Reconnecting...");
    startConnection();
  });

  await connection.start();
  console.log("SignalR connection started");
}

export async function joinOrderGroup(orderId) {
  if (!connection) throw new Error("Connection not started");
  await connection.invoke("JoinGroup", `order-${orderId}`);
}

export function onLocationUpdate(callback) {
  if (!connection) throw new Error("Connection not started");
  connection.on("ReceiveLocation", (data) => {
    callback(data.latitude, data.longitude);
  });
}

export async function stopConnection() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
