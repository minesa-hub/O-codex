import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
    ApplicationIntegrationType,
    InteractionContextType,
    MessageFlags,
    MessageContextMenuCommandInteraction,
    Message,
} from "discord.js";
import translate from "@iamtraction/google-translate";
import { emojis } from "../../shortcuts/emojis.ts";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.ts";
import { defaultMessagePermissions } from "../../interfaces/BotPermissions.ts";
import { checkIfUserInstalledCommand } from "../../shortcuts/checkGuild-UserCommand.ts";

interface ExecuteParams {
    interaction: MessageContextMenuCommandInteraction;
}

export default {
    data: new ContextMenuCommandBuilder()
        .setName("Translate")
        .setNameLocalizations({
            it: "Traduci Messaggio",
            tr: "Mesajı Çevir",
            ro: "Traduceți Mesajul",
            el: "Μετάφραση Μηνύματος",
            "zh-CN": "翻译消息",
            "pt-BR": "Traduzir Mensagem",
        })
        .setType(ApplicationCommandType.Message)
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall,
        ])
        .setContexts([
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild,
        ]),
    execute: async ({ interaction }: ExecuteParams): Promise<void> => {
        // Checking if the command ran in a guild and if the user has the required permissions
        await checkIfUserInstalledCommand(interaction);

        const message: Message =
            (interaction.targetMessage as Message) ||
            (interaction.options?.getMessage("message") as Message);

        try {
            if (!message.content) {
                await interaction.editReply({
                    content: `${emojis.info} This message seems to hold no content—nothing to translate across the threads of time.`,
                });
                return;
            }

            const locale = !["zh-CN", "zh-TW"].includes(interaction.locale)
                ? new Intl.Locale(interaction.locale).language
                : interaction.locale;

            const translated = await translate(
                message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ""),
                { to: locale }
            );

            await interaction.editReply({
                content: `# ${emojis.translate} Translation\n-# ————————————————————\n### ${emojis.globe} Original Message\n${message.content}\n\n### ${emojis.swap} Translated Message (${locale})\n${translated.text}\n\n-# I sent it on below if you need to copy the message.`,
            });

            await interaction.followUp({
                content: `${translated.text}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.log(error);
            await interaction.editReply({
                content: `${emojis.danger} Oh no! A temporal anomaly occurred while translating. Let’s try again later, shall we?`,
            });
        }
    },
} as const;
