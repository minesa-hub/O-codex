import { Collection } from "discord.js";

let voiceManager = new Collection();

export default {
    name: "voiceStateUpdate",
    once: false,
    execute: async (oldState, newState) => {
        const { member, guild } = oldState;
        const newChannel = newState.channel;
        const oldChannel = oldState.channel;
        const JTC = "1023709989606527088";

        // if user join voice channel
        if (oldChannel !== newChannel && newChannel && newChannel.id === JTC) {
            const voiceChannel = await guild.channels.create({
                name: `— ${member.user.username}`,
                type: 2,
                parent: newChannel.parent,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: ["Connect", "ManageChannels"],
                    },
                    {
                        id: guild.id,
                        allow: ["Connect"],
                    },
                ],
                userLimit: 10,
            });

            voiceManager.set(member.id, voiceChannel.id);
            // for spam protection
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => {
                newChannel.permissionOverwrites.delete(member);
            }, 1 * 1000);

            return setTimeout(() => {
                member.voice.setChannel(voiceChannel);
            }, 100);
        }

        // if user leave or switch
        const JTCCHANNEL = voiceManager.get(member.id);
        const members = oldChannel?.members.filter(m => !m.user.bot).map(m => m.id);
        if (JTCCHANNEL && oldChannel.id === JTCCHANNEL && (!newChannel || newChannel.id !== JTCCHANNEL)) {
            if (members.length > 0) {
                // code
                let randomID = members[Math.floor(Math.random() * members.length)];
                let randomMember = guild.members.cache.get(randomID);
                randomMember.voice.setChannel(oldChannel).then(v => {
                    oldChannel.setName(`— ${randomMember.user.username}`).catch(e => null);
                    oldChannel.permissionOverwrites.edit(randomMember, {
                        Connect: true,
                        ManageChannels: true,
                    });
                });
                voiceManager.set(member.id, null);
                voiceManager.set(randomMember.id, oldChannel.id);
            } else {
                voiceManager.set(member.id, null);
                oldChannel.delete().catch(e => null);
            }
        }
    },
};
