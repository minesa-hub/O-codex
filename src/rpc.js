const ID = "736561919292473454";
import discordRPC from "discord-rpc";
const { Client, register } = discordRPC;

const RPC = new Client({ transport: "ipc" });

register(ID);

async function activity() {
    if (!RPC) return;

    RPC.setActivity({
        details: "Feel free to support my Ita project!",
        state: "Coding solo",
        largeImageKey: "https://i.ibb.co/xMQ9XGy/ita-logo.webp",
        largeImageText: 'Ita "Bluefire" Sun',
        smallImageKey: "https://i.ibb.co/26J0BqS/cube20x.png",
        smallImageText: "Minesa Hub",
        instance: false,
        startTimestamp: Date.now(),
        buttons: [
            {
                label: `Invite Ita`,
                url: `https://minesa.live/users/ita.html`,
            },
            {
                label: `Join Minesa Hub`,
                url: `https://discord.gg/XCwC2vKjpj`,
            },
        ],
    });
}

export function setRPC() {
    RPC.on("ready", async () => {
        console.log("RPC Presence up");
        activity();

        setInterval(() => {
            activity();
        }, 100000000);
    });

    RPC.login({ clientId: ID });
}
