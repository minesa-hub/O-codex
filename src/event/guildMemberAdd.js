export default {
    name: "guildMemberAdd",
    once: false,
    execute: async member => {
        // Declaring the role
        const role = "805451556081500220";
        // Declaring the guild
        const guild = client.guilds.cache.get("697039582922801182");
    
        // Adding role to new joined member
        await member.roles.add(role);
    },
};
