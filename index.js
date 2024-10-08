import express from "express";
import expressWs from "express-ws";

const app = express();
const wss = expressWs(app);

let userCount = 0;

app.ws("/", (ws) => {
    ws.on("message", (msg) => {
        // console.log(msg);
        const { type, payload } = JSON.parse(msg);

        if (type === "NEW_USER") {
            const { username } = payload;

            wss.getWss().clients.forEach((client) =>
                client.send(
                    JSON.stringify({
                        type: "USER_STATE",
                        payload: {
                            username,
                            state: "JOIN",
                        },
                    })
                )
            );
        }

        if (type === "NEW_MESSAGE") {
            wss.getWss().clients.forEach((client) => client.send(msg));
        }
    });

    ws.on("close", () => {
        // console.log("Someone Disconnected?");
        userCount--;

        wss.getWss().clients.forEach((client) => {
            client.send(
                JSON.stringify({
                    type: "UPDATE_USERCOUNT",
                    payload: userCount,
                })
            );
        });
    });
});

wss.getWss().on("connection", () => {
    // console.log("Someone Connected?");
    userCount++;

    wss.getWss().clients.forEach((client) =>
        client.send(
            JSON.stringify({
                type: "UPDATE_USERCOUNT",
                payload: userCount,
            })
        )
    );
});

app.listen(7277);
