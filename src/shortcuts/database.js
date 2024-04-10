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

function getUserInfo(guildId, userId) {
    try {
        // Construct the path to the user's JSON file
        const filePath = path.join(dataDirectory, `./users/${userId}.json`);

        // Read the user data from the file with utf-8 encoding
        const data = fs.readFileSync(filePath, { encoding: "utf-8" });

        // Parse the JSON data and return
        const userData = JSON.parse(data);

        // Return message count for the specified guild or null if not found
        return userData[guildId] || null;
    } catch (error) {
        // Handle errors, such as file not found
        console.error("Error reading user data:", error);
        return null;
    }
}

function saveMessageCount(guildId, userId) {
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

        // Increment message count for the specific guild or set it to 1 if it doesn't exist
        userData[guildId] = (userData[guildId] || 0) + 1;

        // Write the updated user data back to the file
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    } catch (error) {
        console.error("Error updating message count:", error);
    }
}

// Staff Role
function saveStaffRoleId(guildId, roleId) {
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

function getStaffRoleId(guildId) {
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
function addWarning(guildId, userId) {
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

function checkWarnings(guildId, userId) {
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
function setupLoggingChannel(guildId, channelId) {
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

function checkLoggingChannel(guildId) {
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

export {
    getUserInfo,
    saveMessageCount,
    saveStaffRoleId,
    getStaffRoleId,
    addWarning,
    checkWarnings,
    setupLoggingChannel,
    checkLoggingChannel,
};
