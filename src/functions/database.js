import fs from "fs";
import path from "path";

const currentFilePath = import.meta.url;
const currentDirPath = path.dirname(
    currentFilePath.replace(/^file:[/][/]/, "")
);
const dataDirectory = path.resolve(currentDirPath, "../../data");
const usersDirectory = path.resolve(dataDirectory, "users");

// Ensure data directories exist
[usersDirectory, dataDirectory].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Helper function to read and parse a JSON file
const readJsonFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
    }
};

// Helper function to write JSON data to a file
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
};

const filePath = (guildId) => path.resolve(dataDirectory, `${guildId}.json`);

// Staff Role
export function saveStaffRoleId(guildId, roleId) {
    const file = filePath(guildId);
    const guildData = readJsonFile(file) || {};
    guildData.staffRoleId = roleId;
    writeJsonFile(file, guildData);
}

export function getStaffRoleId(guildId) {
    const file = filePath(guildId);
    const guildData = readJsonFile(file);
    return guildData ? guildData.staffRoleId || null : null;
}

// Warning System
export function addWarning(guildId, userId) {
    const file = filePath(guildId);
    const userData = readJsonFile(file) || {};

    userData[userId] = userData[userId] || { warnings: 0 };
    userData[userId].warnings++;

    writeJsonFile(file, userData);
}

export function checkWarnings(guildId, userId) {
    const file = filePath(guildId);
    const userData = readJsonFile(file) || {};
    return userData[userId]?.warnings || 0;
}

// Logging Channel
export function setupLoggingChannel(guildId, channelId) {
    const file = filePath(guildId);
    const guildData = readJsonFile(file) || {};
    guildData.loggingChannelId = channelId;
    writeJsonFile(file, guildData);
}

export function checkLoggingChannel(guildId) {
    const file = filePath(guildId);
    const guildData = readJsonFile(file);
    return guildData ? guildData.loggingChannelId || null : null;
}

// Linked roles
export async function saveStaffs(client, guildId, roleId) {
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
    const guildData = readJsonFile(file) || {};
    guildData.staffMembers = membersWithStaffRole;
    writeJsonFile(file, guildData);
}

export async function getStaffUserId(guildId, userId) {
    const file = filePath(guildId);
    const guildData = readJsonFile(file);
    const staffMembers = guildData?.staffMembers || [];
    return staffMembers.includes(userId);
}

// Save message count
export function saveMessageCount(guildId, userId) {
    const filePath = path.join(usersDirectory, `${userId}.json`);
    const userData = readJsonFile(filePath) || {};

    userData.latestServer = guildId;
    userData.messageCount = userData.messageCount || {};
    userData.messageCount[guildId] = (userData.messageCount[guildId] || 0) + 1;

    writeJsonFile(filePath, userData);
}
