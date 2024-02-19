import moment from "moment-timezone";
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    underscore,
} from "discord.js";
import {
    timezoneChecking,
    timeChecking,
} from "../../shortcuts/timeChecking.js";
import {
    defaultBotPermError,
    defaultUserPermError,
} from "../../shortcuts/defaultPermissionsErrors.js";

export default {
    data: new SlashCommandBuilder()
        .setName("create-giveaway")
        .setDescription("Create a giveaway")
        .addStringOption((option) =>
            option
                .setName("prize")
                .setDescription("What will be the prize?")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("Giveaway description.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("location")
                .setDescription("Write down the location.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setDescription("The duration of event")
                .setRequired(true)
                .addChoices(
                    { name: "1 minutes", value: "1m" },
                    { name: "10 minutes", value: "10m" },
                    { name: "30 minutes", value: "30m" },
                    { name: "1 hour", value: "1h" },
                    { name: "2 hours", value: "2h" },
                    { name: "1 day", value: "1d" },
                    { name: "2 days", value: "2d" },
                    { name: "7 days", value: "3d" },
                ),
        )
        .addAttachmentOption((option) =>
            option
                .setName("image")
                .setDescription("Giveaway image.")
                .setRequired(false),
        ),
    async execute({ client, interaction }) {
        // If permission is missing
        if (
            (await defaultBotPermError(
                interaction,
                PermissionFlagsBits.ManageEvents,
            )) ||
            (await defaultUserPermError(
                interaction,
                PermissionFlagsBits.ManageEvents,
            ))
        ) {
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const giveawayName = interaction.options.getString("prize"),
            giveawayDescription = interaction.options.getString("description"),
            giveawayImage = interaction.options.getAttachment("image"),
            giveawayLocation = interaction.options.getString("location"),
            duration = interaction.options.getString("duration");

        let seconds;
        seconds = timeChecking(duration);

        let timezone = interaction.guild.preferredLocale;
        timezone = timezoneChecking(timezone);

        let scheduledStartTime = moment().tz(timezone).add(seconds, "seconds"),
            scheduledEndTime = moment(scheduledStartTime).add(30, "minutes");

        const giveaway = await interaction.guild.scheduledEvents.create({
            name: giveawayName,
            description: giveawayDescription,
            image: giveawayImage ? giveawayImage.url : null,
            scheduledStartTime: scheduledStartTime.format(),
            scheduledEndTime: scheduledEndTime.format(),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: {
                location: giveawayLocation,
            },
            reason: `Giveaway created by ${interaction.user.tag} for ${giveawayName}.`,
        });

        function shuffleSubscribers(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        setTimeout(async () => {
            try {
                const subscribers = await client.guilds.cache
                    .get(interaction.guild.id)
                    .scheduledEvents.cache.get(giveaway.id)
                    .fetchSubscribers();

                // Convert subscribers Map to an array of usernames
                const subscriberUsernames = shuffleSubscribers(
                    Array.from(subscribers.values()),
                ).map((subscriber) => subscriber.user.username);

                // Pick the first username as the winner
                const winnerUsername = subscriberUsernames[0];

                console.log(
                    `The event ${giveawayName} has been updated with the winner's name: ${winnerUsername}`,
                );

                await giveaway.edit({
                    name: `${giveawayName}\nWinner: ${winnerUsername}`,
                });
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            }
        }, scheduledStartTime.diff(moment(), "milliseconds"));

        return interaction.editReply({
            content: `# Giveaway has been created: ${underscore(
                giveawayName,
            )}\nGiveaway's winners will be shown after the giveaway is on ${underscore(
                "happening",
            )} state.`,
        });
    },
};
