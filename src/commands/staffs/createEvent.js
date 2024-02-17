import moment from "moment-timezone";
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    SlashCommandBuilder,
    underscore,
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
                    { name: "15 Minutes", value: "900000" },
                    { name: "30 Minutes", value: "1800000" },
                    { name: "45 Minutes", value: "2700000" },
                    { name: "6 Hours", value: "21600000" },
                    { name: "12 Hours", value: "43200000" },
                    { name: "1 Day", value: "86400000" },
                    { name: "2 Days", value: "172800000" },
                    { name: "3 Days", value: "259200000" },
                    { name: "4 Days", value: "345600000" },
                    { name: "5 Days", value: "432000000" },
                    { name: "6 Days", value: "518400000" },
                    { name: "7 Days", value: "604800000" },
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
            reason: `Giveaway created by ${interaction.user.tag} for ${eventName}.`,
        });

        return interaction.editReply({
            content: `# Created the Giveaway ${underscore(
                eventName,
            )}!\nGiveaway results will be shown after the event is ${underscore(
                "happening",
            )}. Winner will be picked randomly and displayed on the event.`,
        });
    },
};
