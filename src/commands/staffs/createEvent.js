import moment from "moment-timezone";
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    SlashCommandBuilder,
    bold,
} from "discord.js";
import {
    timezoneChecking,
    timeChecking,
} from "../../shortcuts/timeChecking.js";
export default {
    data: new SlashCommandBuilder()
        .setName("create-event")
        .setDescription("Create an event")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Event name.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("description")
                .setDescription("Event description.")
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
                .setDescription("Event image.")
                .setRequired(false),
        ),
    async execute({ interaction }) {
        await interaction.deferReply({ ephemeral: true });

        const eventName = interaction.options.getString("name"),
            eventDescription = interaction.options.getString("description"),
            eventImage = interaction.options.getAttachment("image"),
            eventLocation = interaction.options.getString("location"),
            duration = interaction.options.getString("duration");

        let seconds;
        seconds = timeChecking(duration);

        let timezone = interaction.guild.preferredLocale;
        timezone = timezoneChecking(timezone);

        let scheduledStartTime = moment().tz(timezone).add(seconds, "seconds"),
            scheduledEndTime = moment(scheduledStartTime).add(30, "minutes");

        await interaction.guild.scheduledEvents.create({
            name: eventName,
            description: eventDescription,
            image: eventImage ? eventImage.url : null,
            scheduledStartTime: scheduledStartTime.format(),
            scheduledEndTime: scheduledEndTime.format(),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: {
                location: eventLocation,
            },
            reason: `Event created by ${interaction.user.tag} for ${eventName}.`,
        });

        return interaction.editReply({
            content: `# Created the event ${bold(
                eventName,
            )}!\nEvent results will be shown after the event is __happening__. Winner will be picked randomly and displayed on the event.`,
        });
    },
};
