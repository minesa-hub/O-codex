import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js';

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (interaction.isButton()) {
            let client = interaction.client;
            const args = interaction.customId.split('_');

            // ———————————————[MEMBER AVATAR]——————————————— //
            if (args[0] === 'ShowMemberAvatar') {
                await interaction.deferUpdate();

                const member = interaction.guild.members.cache.get(args[1]);

                const memberAvatar = member.avatarURL({
                    dynamic: true,
                    size: 4096,
                });

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('disabled')
                        .setLabel('Displaying Member Avatar')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('<:git_eye:992920314172424242>')
                        .setDisabled(true),
                );

                const nullButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('disabled')
                        .setLabel('No Avatar Settled')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('<:git_eye:992920314172424242>')
                        .setDisabled(true),
                );

                return interaction.editReply({
                    content: memberAvatar
                        ? `${memberAvatar}`
                        : 'They do not have a profile picture for this server.',
                    components: [memberAvatar ? button : nullButton]
                });
            }

            // ———————————————[POLL BUTTON]——————————————— //
            if (interaction.customId === 'poll-discussion') {
                if (interaction.channel.type !== ChannelType.GuildText)
                    return interaction.reply({
                        content: 'You **can not** create a discussion in this channel.',
                        ephemeral: true,
                    });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('disabled')
                        .setLabel('— Created a discussion')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                        .setEmoji('<:commentdiscussion:1020408196743037039>'),
                );

                interaction.channel.threads
                    .create({
                        name: '— Discussion',
                        autoArchiveDuration: 60,
                        type: ChannelType.PublicThread,
                        reason: 'For Discussing the Poll',
                        startMessage: interaction.message.id,
                    })
                    .then((poll) => {
                        poll.members.add(interaction.user);

                        interaction.update({ components: [row] });
                    });
            }

            // ———————————————[RULES BUTTON]——————————————— //
            if (interaction.customId === 'Rules') {
                await interaction.deferReply({ ephemeral: true });

                const embed1 = new EmbedBuilder()
                    .setDescription(
                        '<:interface:1026230825697689740> **· Age Requirements!**\n> ➜ You __must be 13+ years of the age__ to be a member of Minesa Hub. If you are under the age of 13, please let us know.',
                    )
                    .setColor('#303136');

                const embed2 = new EmbedBuilder()
                    .setDescription(
                        "<:interface:1026230825697689740> **· No Earrape, Troll, Spoilers or Raiding!**\n>>> ➜ It's not funny. If you do any of these you will get __kick/ban.__\n\n➜ No spamming either. This includes chains, chat flood, copy pastas, excessive keyboard spamming, large blocks of texts and spam pinging mods or members.",
                    )
                    .setColor('#303136');

                const embed3 = new EmbedBuilder()
                    .setDescription(
                        '<:interface:1026230825697689740> **· No NSFW Content!**\n>>> ➜ No NSFW content is allowed in any channel. This includes any form of nudity, sexual content, gore, etc. This also includes any form of sexual harassment, sexual jokes, etc.',
                    )
                    .setColor('#303136');

                const embed4 = new EmbedBuilder()
                    .setDescription(
                        '<:interface:1026230825697689740> **· No Advertising!**\n>>> ➜ Advertisement will result a __ban__. If you want to advertise your server, the FAIR way, is to ask **partnership managers** or **boost** the server.',
                    )
                    .setColor('#303136');

                const embed5 = new EmbedBuilder()
                    .setDescription(
                        "<:interface:1026230825697689740> **· Be respectful to staffs.**\n>>> ➜ If you do something that is against the rules or that isn't allowed by staff, and the staff tells you not to even though it isn't explicitly listed here, you are still __breaking the rules__, and do not try to impersonate or act as if you're a part of staff.",
                    )
                    .setColor('#303136');

                const embed6 = new EmbedBuilder()
                    .setDescription(
                        "<:interface:1026230825697689740> **· Following Discord Term of Service.**\n>>> ➜ Minesa Hub follows Discord's ToS. If you don't want to get ban, read those lessons before you look around.\n\n<:book:1026219326803542036>・__[Discord Terms of Service](https://discord.com/terms)__\n<:book:1026219326803542036>・__[Discord Community Guidelines](https://discord.com/guidelines)__\n\n➜ You are responsible for all actions done on your discord account, even if someone who isn’t you uses it excluding getting hacked. It is possible to provide proof that this was not you.",
                    )
                    .setColor('#303136');

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Term of Service')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/terms'),
                    new ButtonBuilder()
                        .setLabel('Guidelines')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/guidelines'),
                );

                await interaction.followUp({
                    content:
                        "**__Server Rules:__**\n>>> ➜ Please read rules carefully, otherwise we will take action to give you punishment. *(we hope, you're not masochist...)*\n\n ➜ If you have any questions, please contact the staffs.",
                    embeds: [embed1, embed2, embed3, embed4, embed5, embed6],
                    components: [row],
                    ephemeral: true,
                });
            }

            // ———————————————[GET ROLES]——————————————— //

            if (interaction.customId === 'ColorRoles') {
                await interaction.deferUpdate({ ephemeral: true });

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'Color Roles',
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setDescription(
                        '<@&801612652920438784>\n<@&993254456277868544>\n<@&801613602440216617>\n<@&801615185096867871>\n<@&805430953958309908>\n<@&805433136615653416>\n<@&805435812786470932>\n<@&959044181190381609>',
                    )
                    .setColor('#303136');

                const row1 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ColorRolesMenu')
                        .setPlaceholder('Select a color role')
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ sunset')
                                .setDescription('Red')
                                .setValue('801612652920438784'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ caramel')
                                .setDescription('Brown')
                                .setValue('993254456277868544'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ pineapple')
                                .setDescription('Orange')
                                .setValue('801613602440216617'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ banana')
                                .setDescription('Yellow')
                                .setValue('801615185096867871'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ palm')
                                .setDescription('Green')
                                .setValue('805430953958309908'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ ocean')
                                .setDescription('Blue')
                                .setValue('805433136615653416'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ sandy')
                                .setDescription('Purple')
                                .setValue('805435812786470932'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('⠀୭ shelly')
                                .setDescription('Pink')
                                .setValue('959044181190381609'),
                        ]),
                );

                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Back')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('GetRoles2'),
                );

                await interaction.editReply({
                    content:
                        '**<:paint:1027815202571423814> Color Roles**\n>>> Pick a color role you want! Your username will change into whichever color you choose.',
                    embeds: [embed],
                    components: [row1, row2],
                });
            }

            // ———————————————[GET ROLES BUTTON]——————————————— //

            if (interaction.customId === 'OtherRoles') {
                await interaction.deferUpdate({ ephemeral: true });

                // Genders
                const row1 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('OtherRolesMenu1')
                        .setPlaceholder('Gender')
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel('he/him')
                                .setValue('801610025558081567'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('she/her')
                                .setValue('801609422438006794'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('they/them')
                                .setValue('801610167606706186'),
                        ]),
                );

                // Personality
                const row2 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('OtherRolesMenu2')
                        .setPlaceholder('Personality')
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Introvert')
                                .setValue('959009541167648808'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Extrovert')
                                .setValue('959009466509049896'),
                        ]),
                );

                // Notifications
                const row3 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('OtherRolesMenu3')
                        .setPlaceholder('Notifications')
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Server Updates')
                                .setDescription(
                                    'Get notified when a new post is made about the server.',
                                )
                                .setValue('801618406817136651'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Community Events')
                                .setDescription('Get notified when a new event is made.')
                                .setValue('801618365231398912'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Dev Updates')
                                .setDescription(
                                    'Get notified when a new post is made about the developer.',
                                )
                                .setValue('940881871624089600'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('Extras')
                                .setDescription(
                                    'Get notified when a new post is made about the server extras.',
                                )
                                .setValue('836338427578286111'),
                        ]),
                );

                // Age
                const row4 = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('OtherRolesMenu4')
                        .setPlaceholder('Age')
                        .addOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel('minor')
                                .setValue('958997694897082418'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel('adult')
                                .setValue('958997737439911947'),
                        ]),
                );

                // Back Button
                const row5 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Back')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('GetRoles2'),
                );

                await interaction.editReply({
                    content:
                        '**<:mention:1027815155804938311> Other Roles**\n>>> Pick a role you want! You can pick multiple roles.',
                    components: [row1, row2, row3, row4, row5],
                });
            }

            // ———————————————[GET ROLES]——————————————— //
            if (interaction.customId === 'GetRoles') {
                await interaction.deferReply({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Color Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('ColorRoles')
                        .setEmoji('<:paint:1027815202571423814>'),
                    new ButtonBuilder()
                        .setLabel('Other Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('OtherRoles')
                        .setEmoji('<:mention:1027815155804938311>'),
                );

                await interaction.editReply({
                    content:
                        '**Customize your roles!**\n>>> Use the __role-categories__ below to add the roles that apply to you to spice up your profile. It could be color roles, notification pings, or even some fun roles. Simply experiment with it as you see fit!',
                    components: [row],
                });
            }

            // ———————————————[GET ROLES]——————————————— //
            if (interaction.customId === 'GetRoles2') {
                await interaction.deferUpdate({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Color Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('ColorRoles')
                        .setEmoji('<:paint:1027815202571423814>'),
                    new ButtonBuilder()
                        .setLabel('Other Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('OtherRoles')
                        .setEmoji('<:mention:1027815155804938311>'),
                );

                await interaction.editReply({
                    content:
                        '**Customize your roles!**\n>>> Use the __role-categories__ below to add the roles that apply to you to spice up your profile. It could be color roles, notification pings, or even some fun roles. Simply experiment with it as you see fit!',
                    embeds: [],
                    components: [row],
                });
            }

            // ———————————————[INFO OF ROLES]——————————————— //
            if (interaction.customId === 'GetInfo') {
                await interaction.deferReply({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('important-roles')
                        .setLabel('Start Guide')
                        .setStyle(ButtonStyle.Primary),
                );

                await interaction.editReply({
                    content: `**Getting started on __MinesaHub__**\n> Refer to this guide to understand how the server works! This "Info" section was added as a means to help new members get started on the server. If you have any questions, feel free to ask in <#1019645269740097647>!\n\n> Just press the \`Start guide\` button below.`,
                    components: [row],
                });
            }

            // Important Roles
            if (interaction.customId === 'important-roles') {
                await interaction.deferUpdate({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('important-roles')
                        .setLabel('Important Roles')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('important-channels')
                        .setLabel('Important Channels')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('getting-support')
                        .setLabel('Getting Support')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                );

                await interaction.editReply({
                    content: `**Important Roles**\nHere's a overview of all the important roles!\n\n> __<@&801606644001013760>__\n> Server owners, Mica-Neo-Saku.\n\n> __<@&801606706374639666>__\n> Moderators and maintainers of our server! Staff is responsible for keeping the server peaceful and user-friendly, as well as updating the server with new features as needed.\n\n> __<@&969643043059793980>__\n> Extremely helpful people who are very active in <#1019645269740097647>. The Support Team contributes equally in making this server a more user-friendly space.\n> — *Staff will assign you this role at their discretion if you are deserving.*\n\n> __<@&970996897382801438>__\n> The Youtubers who upload content about gaming, development and Discord bot developers.\n> — *Please contact a moderator for more info.*\n\n> __<@&751418618763280427>__\n> The lovely people who are helping tremendously in keeping the server alive. They're the members helping us. So, to repay back for the boosts, here are some perks that the server boosters get on boosting our server:\n> • Embed Perms\n> • A role __only for you__\n> • Image perms in <#722267447935238215>\n> • An emoji of your liking will be __added to the server__\n>  \n> *These permissions are not permanent and will last as long as you're boosting the server.*\n\n`,
                    components: [row],
                });
            }

            // Important Channels
            if (interaction.customId === 'important-channels') {
                await interaction.deferUpdate({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('important-roles')
                        .setLabel('Important Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('important-channels')
                        .setLabel('Important Channels')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('getting-support')
                        .setLabel('Getting Support')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                );

                await interaction.editReply({
                    content: `**Important Channels**\nNavigating through the various channels on this server can be difficult. So, the channels listed below should help you better understand the server and get things started!\n\n>>> • <#722040388030038078>\n• <#722267447935238215>\n• <#1021527613598085170>\n• <#925677111782551603>\n`,
                    components: [row],
                });
            }

            // Geting Support
            if (interaction.customId === 'getting-support') {
                await interaction.deferUpdate({ ephemeral: true });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('important-roles')
                        .setLabel('Important Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('important-channels')
                        .setLabel('Important Channels')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('getting-support')
                        .setLabel('Getting Support')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                );

                await interaction.editReply({
                    content: `**Getting Support**\n> If you need help regarding on something or need help with something else in general, coding; feel free to pop in and ask in our <#1019645269740097647> channel.`,
                    components: [row],
                });
            }
        }
    },
};
