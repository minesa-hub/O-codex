import moment from 'moment-timezone';
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Create a giveaway by events.')
        .addStringOption((option) =>
            option.setName('name').setDescription('Event name.').setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('description').setDescription('Event description.').setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('location').setDescription('Write down the location.').setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('The duration of event')
                .setRequired(true)
                .addChoices(
                    { name: '1 minute', value: 'min' },
                    { name: '1 hour', value: 'hour' },
                    { name: '1 day', value: 'day' },
                ),
        ),
    async execute({ interaction }) {
        await interaction.deferReply();

        const eventName = interaction.options.getString('name');
        const eventDescription = interaction.options.getString('description');
        const eventLocation = interaction.options.getString('location');
        const duration = interaction.options.getString('duration');

        let seconds;
        switch (duration) {
            case 'min':
                seconds = 60;
                break;
            case 'hour':
                seconds = 60 * 60;
                break;
            case 'day':
                seconds = 24 * 60 * 60;
                break;
            default:
                return await interaction.followUp('Invalid duration selected.');
        }

        const timezone = 'Europe/Istanbul';
        const scheduledStartTime = moment().tz(timezone).add(seconds, 'seconds');
        const scheduledEndTime = moment(scheduledStartTime).add(60, 'minutes');

        interaction.guild.scheduledEvents.create({
            name: eventName,
            description: eventDescription,
            scheduledStartTime: scheduledStartTime.format(),
            scheduledEndTime: scheduledEndTime.format(),
            privacyLevel: 2,
            entityType: 3,
            entityMetadata: {
                location: eventLocation,
            },
        });

        return interaction.editReply({
            content: `Created an event starting at ${scheduledStartTime.format(
                'lll',
            )} and ending at ${scheduledEndTime.format('lll')} in ${timezone}`,
        });
    },
};
