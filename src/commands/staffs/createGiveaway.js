import moment from "moment-timezone";
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    bold,
    underscore,
    userMention,
} from "discord.js";
import {
    timezoneChecking,
    timeChecking,
} from "../../shortcuts/timeChecking.js";
import { gift_card } from "../../shortcuts/emojis.js";

export default {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .setDMPermission(false)
        .setName("create-giveaway")
        .setDescription("Create a giveaway")
        .setNameLocalizations({
            tr: "çekiliş-oluştur",
            it: "crea-concorso",
            "zh-CN": "创建抽奖",
        })
        .setDescriptionLocalizations({
            tr: "Bir çekiliş oluşturun",
            it: "Crea un concorso",
            "zh-CN": "创建抽奖活动",
        })
        .addStringOption((option) =>
            option
                .setName("prize")
                .setNameLocalizations({
                    tr: "ödül",
                    it: "premio",
                    "zh-CN": "奖品",
                })
                .setDescription("What will be the prize?")
                .setDescriptionLocalizations({
                    tr: "Ödül nedir?",
                    it: "Qual è il premio?",
                    "zh-CN": "奖品是什么？",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setNameLocalizations({
                    tr: "süre",
                    it: "durata",
                    "zh-CN": "持续时间",
                })
                .setDescription("The duration of event")
                .setDescriptionLocalizations({
                    tr: "Etkinliğin süresi",
                    it: "La durata dell'evento",
                    "zh-CN": "活动持续时间",
                })
                .setRequired(true)
                .addChoices(
                    {
                        name: "1 minute",
                        value: "1m",
                        name_localizations: {
                            tr: "1 dakika",
                            it: "1 minuto",
                            "zh-CN": "1分钟",
                        },
                    },
                    {
                        name: "10 minutes",
                        value: "10m",
                        name_localizations: {
                            tr: "10 dakika",
                            it: "10 minuti",
                            "zh-CN": "10分钟",
                        },
                    },
                    {
                        name: "30 minutes",
                        value: "30m",
                        name_localizations: {
                            tr: "30 dakika",
                            it: "30 minuti",
                            "zh-CN": "30分钟",
                        },
                    },
                    {
                        name: "1 hour",
                        value: "1h",
                        name_localizations: {
                            tr: "1 saat",
                            it: "1 ora",
                            "zh-CN": "1小时",
                        },
                    },
                    {
                        name: "2 hours",
                        value: "2h",
                        name_localizations: {
                            tr: "2 saat",
                            it: "2 ore",
                            "zh-CN": "2小时",
                        },
                    },
                    {
                        name: "3 hours",
                        value: "3h",
                        name_localizations: {
                            tr: "3 saat",
                            it: "3 ore",
                            "zh-CN": "3小时",
                        },
                    },
                    {
                        name: "4 hours",
                        value: "4h",
                        name_localizations: {
                            tr: "4 saat",
                            it: "4 ore",
                            "zh-CN": "4小时",
                        },
                    },
                    {
                        name: "5 hours",
                        value: "5h",
                        name_localizations: {
                            tr: "5 saat",
                            it: "5 ore",
                            "zh-CN": "5小时",
                        },
                    },
                    {
                        name: "6 hours",
                        value: "6h",
                        name_localizations: {
                            tr: "6 saat",
                            it: "6 ore",
                            "zh-CN": "6小时",
                        },
                    },
                    {
                        name: "1 day",
                        value: "1d",
                        name_localizations: {
                            tr: "1 gün",
                            it: "1 giorno",
                            "zh-CN": "1天",
                        },
                    },
                    {
                        name: "2 days",
                        value: "2d",
                        name_localizations: {
                            tr: "2 gün",
                            it: "2 giorni",
                            "zh-CN": "2天",
                        },
                    },
                    {
                        name: "3 days",
                        value: "3d",
                        name_localizations: {
                            tr: "3 gün",
                            it: "3 giorni",
                            "zh-CN": "3天",
                        },
                    }
                )
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setNameLocalizations({
                    tr: "açıklama",
                    it: "descrizione",
                    "zh-CN": "描述",
                })
                .setDescription("Giveaway description.")
                .setDescriptionLocalizations({
                    tr: "Çekiliş açıklaması.",
                    it: "Descrizione del concorso.",
                    "zh-CN": "抽奖描述。",
                })
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setNameLocalizations({
                    tr: "resim",
                    it: "immagine",
                    "zh-CN": "图片",
                })
                .setDescription("Giveaway image.")
                .setDescriptionLocalizations({
                    tr: "Çekiliş resmi.",
                    it: "Immagine del concorso.",
                    "zh-CN": "抽奖图片。",
                })
                .setRequired(false)
        ),

    execute: async ({ client, interaction }) => {
        await interaction.deferReply({ ephemeral: true });

        const giveawayName = interaction.options.getString("prize"),
            giveawayDescription =
                interaction.options.getString("description") ||
                "Feel free to join <:ita_happy:1170847735008739408>",
            giveawayImage = interaction.options.getAttachment("image"),
            duration = interaction.options.getString("duration");

        let seconds;
        seconds = timeChecking(duration);

        let timezone = interaction.guild.preferredLocale;
        timezone = timezoneChecking(timezone);

        let scheduledStartTime = moment().tz(timezone).add(seconds, "seconds"),
            scheduledEndTime = moment(scheduledStartTime).add(1, "hours");

        const giveaway = await interaction.guild.scheduledEvents.create({
            name: giveawayName,
            description:
                giveawayDescription +
                ` ${gift_card} \n${bold("Giveaway created by:")} ${userMention(
                    interaction.user.id
                )}`,
            image: giveawayImage
                ? giveawayImage.url
                : "https://i.ibb.co/yPc75Qs/Giveaway-Card.jpg",
            scheduledStartTime: scheduledStartTime.format(),
            scheduledEndTime: scheduledEndTime.format(),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: {
                location: interaction.guild.name,
            },
            reason: `Giveaway created by ${interaction.user.tag} for ${giveawayName}.`,
        });

        let inviteLink;

        client.guilds.cache
            .get(interaction.guild.id)
            .scheduledEvents.cache.get(giveaway.id)
            .createInviteURL({ channel: interaction.channel.id })
            .then((url) => {
                inviteLink = url;

                setTimeout(async () => {
                    try {
                        const subscribers = await client.guilds.cache
                            .get(interaction.guild.id)
                            .scheduledEvents.cache.get(giveaway.id)
                            .fetchSubscribers();

                        let winner = "";
                        let description = "";
                        if (subscribers.size > 0) {
                            const subscriberUsernames = Array.from(
                                subscribers.values()
                            ).map((subscriber) => subscriber.user);

                            const shuffledUsernames =
                                shuffleSubscribers(subscriberUsernames);

                            winner = shuffledUsernames[0];
                            description = `a winner! ${gift_card}\n${userMention(
                                winner.id
                            )} please create a ticket to contact with us! <:ita_happy:1170847735008739408>`;
                        } else {
                            winner =
                                "no winner is chosen since no one joined. <:ita_happy:1170847735008739408>";
                            description = winner;
                        }

                        await giveaway.edit({
                            name: `Giveaway Ended! — ${giveawayName}`,
                            description: `**${giveawayName}** giveaway has ${description}`,
                        });
                    } catch (error) {
                        console.error("Error fetching subscribers:", error);
                    }
                }, scheduledStartTime.diff(moment(), "milliseconds"));

                interaction.editReply({
                    content: gift_card + " Creating the giveaway...",
                });
                interaction.editReply({
                    content: `# ${gift_card} Giveaway has been created: ${underscore(
                        giveawayName
                    )}\nGiveaway's winner ${bold(
                        "will be shown"
                    )} after the giveaway is on ${underscore(
                        "happening"
                    )} state!
                    \n${inviteLink}`,
                });
            })
            .catch((error) => {
                console.error("Error creating invite link:", error);
            });
    },
};

function shuffleSubscribers(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
