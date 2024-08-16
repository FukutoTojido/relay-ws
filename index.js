import express from "express";
import expressWs from "express-ws";

const app = express();
const wss = expressWs(app);

app.ws("/", (ws) => ws.on("message", (msg) => wss.getWss().clients.forEach((client) => client.send(msg))));

app.listen(7277);
