import fs from "fs";
import path from "path";
import { Client } from "discord.js";

const currentDirPath = __dirname;
const dataDirectory = path.resolve(currentDirPath, "../../data");

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

const filePath = (guildId: string): string =>
    path.resolve(dataDirectory, `${guildId}.json`);

interface GuildData {
    staffRoleId?: string;
    loggingChannelId?: string;
    staffMembers?: string[];
    [key: string]: any;
}

// Utility function to read JSON files safely
function readJsonFile<T>(file: string): T | null {
    try {
        const data = fs.readFileSync(file, "utf8");
        return JSON.parse(data) as T;
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
            console.error("Error reading JSON file:", err);
        }
        return null;
    }
}

// Utility function to write JSON files safely
function writeJsonFile<T>(file: string, data: T): void {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

// Staff Role
export function saveStaffRoleId(guildId: string, roleId: string): void {
    const file = filePath(guildId);
    const guildData: GuildData = readJsonFile<GuildData>(file) || {};
    guildData.staffRoleId = roleId;
    writeJsonFile(file, guildData);
}

export function getStaffRoleId(guildId: string): string | null {
    const guildData = readJsonFile<GuildData>(filePath(guildId));
    return guildData?.staffRoleId || null;
}

// Warning System
export function addWarning(guildId: string, userId: string): void {
    const file = filePath(guildId);
    const userData =
        readJsonFile<Record<string, { warnings: number }>>(file) || {};
    userData[userId] = userData[userId] || { warnings: 0 };
    userData[userId].warnings++;
    writeJsonFile(file, userData);
}

export function checkWarnings(guildId: string, userId: string): number {
    const userData = readJsonFile<Record<string, { warnings: number }>>(
        filePath(guildId)
    );
    return userData?.[userId]?.warnings || 0;
}

// Logging Channel
export function setupLoggingChannel(guildId: string, channelId: string): void {
    const file = filePath(guildId);
    const guildData: GuildData = readJsonFile<GuildData>(file) || {};
    guildData.loggingChannelId = channelId;
    writeJsonFile(file, guildData);
}

export function checkLoggingChannel(guildId: string): string | null {
    const guildData = readJsonFile<GuildData>(filePath(guildId));
    return guildData?.loggingChannelId || null;
}

// Linked Roles
export async function saveStaffs(
    client: Client,
    guildId: string,
    roleId: string
): Promise<void> {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        console.error("Guild not found.");
        return;
    }

    const staffRole = guild.roles.cache.get(roleId);
    if (!staffRole) {
        console.error("Staff role not found in the guild.");
        return;
    }

    const membersWithStaffRole = staffRole.members.map(
        (member) => member.user.id
    );
    const file = filePath(guildId);
    const guildData: GuildData = readJsonFile<GuildData>(file) || {};
    guildData.staffMembers = membersWithStaffRole;
    writeJsonFile(file, guildData);
    console.log("Staff role ID and members have been saved in the database.");
}

export function getStaffUserId(guildId: string, userId: string): boolean {
    const guildData = readJsonFile<GuildData>(filePath(guildId));
    return guildData?.staffMembers?.includes(userId) || false;
}

export function saveMessageCount(guildId: string, userId: string): void {
    const userFilePath = path.join(dataDirectory, `./users/${userId}.json`);
    const userData: Record<string, any> = readJsonFile(userFilePath) || {};
    userData.latestServer = guildId;
    userData.messageCount = userData.messageCount || {};
    userData.messageCount[guildId] = (userData.messageCount[guildId] || 0) + 1;
    writeJsonFile(userFilePath, userData);
}
