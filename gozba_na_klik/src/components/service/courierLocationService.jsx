import * as signalR from "@microsoft/signalr";

let connection = null;

export async function startConnection() {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5065/CourierLocationHub", {
      accessTokenFactory: () => localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .build();

  connection.onclose(() => {
    console.log("Connection closed. Reconnecting...");
  });

  await connection.start();
  console.log("SignalR connection started");
}

export async function joinOrderGroup(orderId) {
  if (!connection) throw new Error("Connection not started");
  await connection.invoke("JoinOrderGroup", `order-${orderId}`);
}

export function onLocationUpdate(callback) {
  if (!connection) throw new Error("Connection not started");
  connection.on("ReceiveLocation", (lat, lng) => {
    callback(lat, lng);
  });
}

export function onOrderCompleted(callback) {
  if (!connection) throw new Error("Connection not started");
  connection.on("OrderCompleted", callback);
}

export async function stopConnection() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
