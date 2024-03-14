import fs from "fs";
import path from "path";

const currentFilePath = import.meta.url;
const currentDirPath = path.dirname(
    currentFilePath.replace(/^file:[/][/]/, "")
);
const filePath = path.resolve(currentDirPath, "../../data.json");

export const saveStaffRoleId = (guildId, roleId) => {
    try {
        let guildData = {};
        try {
            const data = fs.readFileSync(filePath);
            guildData = JSON.parse(data);
        } catch (err) {
            console.error("Error reading JSON file:", err);
        }

        guildData[guildId] = guildData[guildId] || { staffRoleId: roleId };

        try {
            fs.writeFileSync(filePath, JSON.stringify(guildData, null, 2));
            console.log(`Staff role ID ${roleId} saved for guild ${guildId}`);
        } catch (err) {
            console.error("Error writing JSON file:", err);
        }
    } catch (err) {
        console.error(err);
    }
};

export const getStaffRoleId = (guildId) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const guildData = JSON.parse(data);

        if (
            guildData.hasOwnProperty(guildId) &&
            guildData[guildId].hasOwnProperty("staffRoleId")
        ) {
            return guildData[guildId].staffRoleId;
        } else {
            return null;
        }
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return null;
    }
};
