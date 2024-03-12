import discordRPC from "discord-rpc";
const { Client, register } = discordRPC;
const CLIENT_ID = "736561919292473454";

const RPC = new Client({ transport: "ipc" });

register(CLIENT_ID);

async function activity() {
    if (!RPC) return;

    RPC.setActivity({
        details: "Feel free to support my Kaeru” project!",
        state: "solo”",
        largeImageKey: "kaeru_bg",
        largeImageText: "kaeru-chan",
        smallImageKey: "checkmark_seal_fill",
        smallImageText: "on the way to verify⟣",
        instance: false,
        startTimestamp: Date.now(),
        buttons: [
            {
                label: `Invite Kaeru”`,
                url: `https://minesa.live/users/ita.html`,
            },
            {
                label: `Join Minesa Hub™️`,
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

    RPC.login({ clientId: CLIENT_ID });
}
