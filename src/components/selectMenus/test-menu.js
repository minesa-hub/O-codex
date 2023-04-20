export default {
    data: {
        customId: 'test-menu',
    },
    execute: async ({ interaction }) => {
        await interaction.reply({ content: `You selected: ${interaction.values[0]}` });
    },
};
