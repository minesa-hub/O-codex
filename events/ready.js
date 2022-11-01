export const name = "ready";
export const once = true;
export async function execute(client) {
    await client.application.fetch();
    client.user.setActivity("/help", { type: "LISTENING" });
    console.log(`Bot is now online! Logged in as ${client.user.tag}.`);
    // Fetching the message on rules channel to bot does not die from restart.
    client.channels.cache.get("889266702620176434").messages.fetch("1030252706696269854");
}
