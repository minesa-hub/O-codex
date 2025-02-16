import fs from "fs";
import path from "path";

const currentFilePath = import.meta.url;
const currentDirPath = path.dirname(
    currentFilePath.replace(/^file:[/][/]/, "")
);
const dataDirectory = path.resolve(currentDirPath, "../../data");

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

const filePath = (guildId) => path.resolve(dataDirectory, `${guildId}.json`);

// Staff Role
export function saveStaffRoleId(guildId, roleId) {
    const file = filePath(guildId);
    try {
        let guildData = {};
        try {
            const data = fs.readFileSync(file);
            guildData = JSON.parse(data);
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error("Error reading JSON file:", err);
            }
        }

        guildData.staffRoleId = roleId;

        try {
            fs.writeFileSync(file, JSON.stringify(guildData, null, 2));
        } catch (err) {
            console.error("Error writing JSON file:", err);
        }
    } catch (err) {
        console.error(err);
    }
}

export function getStaffRoleId(guildId) {
    const file = filePath(guildId);
    try {
        const data = fs.readFileSync(file, "utf8");
        const guildData = JSON.parse(data);
        return guildData.staffRoleId || null;
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
    }
}

// Warning System
export function addWarning(guildId, userId) {
    const file = filePath(guildId);
    let userData = {};

    try {
        const data = fs.readFileSync(file);
        userData = JSON.parse(data);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("Error reading JSON file:", err);
        }
    }

    userData[userId] = userData[userId] || { warnings: 0 };
    userData[userId].warnings++;

    try {
        fs.writeFileSync(file, JSON.stringify(userData, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

export function checkWarnings(guildId, userId) {
    const file = filePath(guildId);

    try {
        const data = fs.readFileSync(file, "utf8");
        const userData = JSON.parse(data);

        if (
            userData.hasOwnProperty(userId) &&
            userData[userId].hasOwnProperty("warnings")
        ) {
            return userData[userId].warnings;
        } else {
            return 0;
        }
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error("JSON file does not exist.");
        } else if (err instanceof SyntaxError) {
            console.error("JSON file contains invalid syntax.");
        } else {
            console.error("Error reading JSON file:", err);
        }
        return 0;
    }
}

// Logging Channel
export function setupLoggingChannel(guildId, channelId) {
    const file = filePath(guildId);
    let guildData = {};

    try {
        const data = fs.readFileSync(file);
        guildData = JSON.parse(data);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("Error reading JSON file:", err);
        }
    }

    guildData.loggingChannelId = channelId;

    try {
        fs.writeFileSync(file, JSON.stringify(guildData, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

export function checkLoggingChannel(guildId) {
    const file = filePath(guildId);
    try {
        const data = fs.readFileSync(file, "utf8");
        const guildData = JSON.parse(data);
        return guildData.loggingChannelId || null;
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
    }
}

// linked roles
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

    try {
        const file = filePath(guildId);
        let guildData = {};

        try {
            const data = fs.readFileSync(file);
            guildData = JSON.parse(data);
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error("Error reading JSON file:", err);
            }
        }

        guildData.staffMembers = membersWithStaffRole;

        try {
            fs.writeFileSync(file, JSON.stringify(guildData, null, 2));
            console.log(
                "Staff role ID and members have been saved in the database."
            );
        } catch (err) {
            console.error("Error writing JSON file:", err);
        }
    } catch (err) {
        console.error(err);
    }
}
export async function getStaffUserId(guildId, userId) {
    const file = filePath(guildId);
    try {
        const data = fs.readFileSync(file, "utf8");
        const guildData = JSON.parse(data);
        const staffMembers = guildData.staffMembers || [];

        // Check if the user ID is in the list of staff members
        if (staffMembers.includes(userId)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return false;
    }
}

export function saveMessageCount(guildId, userId) {
    try {
        const filePath = path.join(dataDirectory, `./users/${userId}.json`);
        let userData = {};
        try {
            const data = fs.readFileSync(filePath, "utf8");
            userData = JSON.parse(data);
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error("Error reading user data:", error);
            }
        }

        // Update the latest server and message count
        userData.latestServer = guildId;
        userData.messageCount = userData.messageCount || {};
        userData.messageCount[guildId] =
            (userData.messageCount[guildId] || 0) + 1;

        // Write the updated user data back to the file
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    } catch (error) {
        console.error("Error updating message count:", error);
    }
}
