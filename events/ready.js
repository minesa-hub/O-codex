export const name = "ready";
export const once = true;
export async function execute(client) {
    // The bot starts, and logs in, successfully.
    console.log(`[READY] Logged in as ${client.user.tag}!`);

    // Fetching the message on rules channel to bot does not die from restart.
    client.channels.cache.get("889266702620176434").messages.fetch("1030252706696269854");
}
