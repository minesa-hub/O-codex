import { botLogin } from "./config/Configs.js";
import { loadHandlers } from "./functions/loadHandlers.js";

await loadHandlers();
await botLogin();
