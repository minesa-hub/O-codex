import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    time,
    userMention,
} from "discord.js";
import {
    addWarning,
    checkLoggingChannel,
    checkWarnings,
} from "../../shortcuts/database.js";
import {
    exclamationmark_circleEmoji,
    exclamationmark_triangleEmoji,
    timeout_emoji,
} from "../../shortcuts/emojis.js";

export default {
    data: new SlashCommandBuilder()
        .setName("punishment")
        .setNameLocalizations({
            "pt-BR": "punição",
            ro: "pedepsire",
            el: "τιμωρία",
            "zh-CN": "惩罚",
            it: "punizione",
            tr: "ceza",
        })
        .setDescription(
            "Punish the member by timing them out. This will also give them a warning."
        )
        .setDescriptionLocalizations({
            "pt-BR":
                "Pune o membro com um timeout. Isso também enviará um aviso para eles.",
            ro: "Pedeapsă cu restricționare și avertizare.",
            el: "Τιμωρήστε το μέλος με την αποκλεισμό του. Αυτό θα του δώσει επίσης προειδοποίηση.",
            "zh-CN": "通过对其计时来惩罚会员。 这也会向他们发出警告。",
            it: "Punire il membro cronometrandoli. Questo darà loro anche un avvertimento.",
            tr: "Üyeyi zaman aşımı ile cezalandırın. Bu aynı zamanda onlara bir uyarı verecektir.",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("target")
                .setNameLocalizations({
                    "pt-BR": "alvo",
                    ro: "țintă",
                    el: "στόχος",
                    "zh-CN": "目标",
                    it: "obiettivo",
                    tr: "hedef",
                })
                .setDescription("The user you want to timeout")
                .setDescriptionLocalizations({
                    "pt-BR": "O usuário que você deseja dar timeout",
                    ro: "Utilizatorul căruia dorești să îți aplici restricționarea",
                    el: "Ο χρήστης που θέλετε να απενεργοποιήσετε",
                    "zh-CN": "你想超时的用户",
                    it: "L'utente a cui vuoi dare il timeout",
                    tr: "Zaman aşımı yapmak istediğiniz kullanıcı",
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setNameLocalizations({
                    "pt-BR": "motivo",
                    ro: "motiv",
                    el: "λόγος",
                    "zh-CN": "原因",
                    it: "motivo",
                    tr: "neden",
                })
                .setDescription("Reason for timeout")
                .setDescriptionLocalizations({
                    "pt-BR": "Motivo para o timeout",
                    ro: "Motivul pentru restricționare",
                    el: "Λόγος για απενεργοποίηση",
                    "zh-CN": "超时的原因",
                    it: "Motivo per il timeout",
                    tr: "Zaman aşımı için neden",
                })
                .setRequired(true)
                .addChoices(
                    {
                        name: "Spamming",
                        value: "spam",
                        name_localizations: {
                            "pt-BR": "Spam",
                            ro: "Spam",
                            el: "Ανεπιθύμητη αλληλογραφία",
                            "zh-CN": "垃圾邮件",
                            it: "Spam",
                            tr: "Spam",
                        },
                    },
                    {
                        name: "Harassment/Bullying",
                        value: "harassment",
                        name_localizations: {
                            "pt-BR": "Assédio/Bullying",
                            ro: "Hărțuire/Bullying",
                            el: "Παρενόχληση/Εκφοβισμός",
                            "zh-CN": "骚扰/欺凌",
                            it: "Molestie/Bullismo",
                            tr: "Taciz/Zorbalık",
                        },
                    },
                    {
                        name: "Inappropriate Content",
                        value: "inappropriate",
                        name_localizations: {
                            "pt-BR": "Conteúdo Inapropriado",
                            ro: "Conținut inadecvat",
                            el: "Ακατάλληλο περιεχόμενο",
                            "zh-CN": "不适当内容",
                            it: "Contenuto Inappropriato",
                            tr: "Uygunsuz İçerik",
                        },
                    },
                    {
                        name: "Advertising",
                        value: "advertising",
                        name_localizations: {
                            "pt-BR": "Publicidade",
                            ro: "Publicitate",
                            el: "Διαφήμιση",
                            "zh-CN": "广告",
                            it: "Pubblicità",
                            tr: "Reklam",
                        },
                    },
                    {
                        name: "Impersonation",
                        value: "impersonation",
                        name_localizations: {
                            "pt-BR": "Impersonação",
                            ro: "Impersonare",
                            el: "Προσωποποίηση",
                            "zh-CN": "冒充",
                            it: "Imitazione",
                            tr: "Taklit",
                        },
                    },
                    {
                        name: "Trolling",
                        value: "trolling",
                        name_localizations: {
                            "pt-BR": "Trollagem",
                            ro: "Trolling",
                            el: "Τρολλάρισμα",
                            "zh-CN": "嘲讽",
                            it: "Trollaggio",
                            tr: "Troll",
                        },
                    },
                    {
                        name: "Violation of Server Rules",
                        value: "server_rules",
                        name_localizations: {
                            "pt-BR": "Violação das Regras do Servidor",
                            ro: "Încălcarea regulilor serverului",
                            el: "Παραβίαση των κανόνων του διακομιστή",
                            "zh-CN": "违反服务器规则",
                            it: "Violazione delle Regole del Server",
                            tr: "Sunucu Kurallarının İhlali",
                        },
                    },
                    {
                        name: "Offensive Behavior",
                        value: "offensive_behavior",
                        name_localizations: {
                            "pt-BR": "Comportamento Ofensivo",
                            ro: "Comportament ofensator",
                            el: "Προσβλητική συμπεριφορά",
                            "zh-CN": "攻击性行为",
                            it: "Comportamento Offensivo",
                            tr: "Saldırgan Davranış",
                        },
                    },
                    {
                        name: "Breaking Discord's Terms of Service",
                        value: "breaking_tos",
                        name_localizations: {
                            "pt-BR":
                                "Violação dos Termos de Serviço do Discord",
                            ro: "Încălcarea termenilor de serviciu ai Discord-ului",
                            el: "Παραβίαση των όρων χρήσης του Discord",
                            "zh-CN": "违反 Discord 的服务条款",
                            it: "Violazione dei Termini di Servizio di Discord",
                            tr: "Discord Hizmet Şartları'nın İhlali",
                        },
                    },
                    {
                        name: "Repeated Infractions",
                        value: "repeated_infractions",
                        name_localizations: {
                            "pt-BR": "Infrações Repetidas",
                            ro: "Încălcări repetate",
                            el: "Επανειλημμένες παραβάσεις",
                            "zh-CN": "重复违规行为",
                            it: "Violazioni Ripetute",
                            tr: "Tekrarlayan İhlaller",
                        },
                    },
                    {
                        name: 'Other (Please use it with "additional" parameter)',
                        value: "other",
                        name_localizations: {
                            "pt-BR":
                                'Outro (Por favor, use com o parâmetro "adicional")',
                            ro: 'Altele (Vă rugăm să-l folosiți cu parametrul "suplimentar")',
                            el: 'Άλλο (Παρακαλώ χρησιμοποιήστε το με το παράμετρο "επιπρόσθετο")',
                            "zh-CN": '其他（请与 "additional" 参数一起使用）',
                            it: 'Altro (Per favore, usalo con il parametro "aggiuntivo")',
                            tr: 'Diğer (Lütfen "ek" parametresi ile kullanın)',
                        },
                    }
                )
        )
        .addStringOption((option) =>
            option
                .setName("additional_reason")
                .setNameLocalizations({
                    "pt-BR": "razão_adicional",
                    ro: "motiv_suplimentar",
                    el: "επιπρόσθετος_λόγος",
                    "zh-CN": "附加原因",
                    it: "motivo_aggiuntivo",
                    tr: "ek_neden",
                })
                .setDescription('Please prefer to use it with "Other" choice')
                .setDescriptionLocalizations({
                    "pt-BR": "Por favor, prefira usá-lo com a escolha 'Outro'.",
                    ro: "Vă rugăm să-l folosiți cu opțiunea 'Altele'.",
                    el: "Παρακαλώ προτιμήστε να το χρησιμοποιήσετε με την επιλογή 'Άλλο'.",
                    "zh-CN": '请优先使用"其他"选项。',
                    it: 'Si prega di preferire l\'utilizzo con la scelta "Altro".',
                    tr: '"Diğer" seçeneğiyle kullanmayı tercih edin, lütfen.',
                })
                .setRequired(false)
        )
        .addNumberOption((option) =>
            option
                .setName("duration")
                .setNameLocalizations({
                    "pt-BR": "duração",
                    ro: "durată",
                    el: "διάρκεια",
                    "zh-CN": "持续时间",
                    it: "durata",
                    tr: "süre",
                })
                .setDescription(
                    "Set a custom duration as minutes (Only works with other reason)"
                )
                .setDescriptionLocalizations({
                    "pt-BR":
                        "Define uma duração personalizada (só funciona com outros motivos)",
                    ro: "Setează o durată personalizată (funcționează doar cu alte motive)",
                    el: "Ορίστε μια προσαρμοσμένη διάρκεια (λειτουργεί μόνο με άλλο λόγο)",
                    "zh-CN": "设置自定义持续时间（仅与其他原因一起使用）",
                    it: "Imposta una durata personalizzata in minuti (Funziona solo con altri motivi)",
                    tr: "Diğer nedenler için özel süre belirleyin (Sadece dakika).",
                })
                .setRequired(false)
        ),
    execute: async ({ client, interaction }) => {
        const target = interaction.options.getUser("target");
        let reason = interaction.options.getString("reason");
        let customReason =
            interaction.options.getString("additional_reason") ||
            "No reason provided.";
        let duration = interaction.options.getNumber("duration") || 60; // Default duration: 1 minute
        const guild = interaction.guild;
        const guildMember = guild.members.cache.get(target.id);
        // const channel = guild.channels.cache.get("961144092782374942");
        const author = interaction.user;

        switch (reason) {
            case "spam":
                reason = "Member was spamming messages.";
                duration = 5;
                break;
            case "harassment":
                reason =
                    "Member was engaging in harassment or bullying behavior.";
                duration = 10;
                break;
            case "inappropriate":
                reason = "Member was posting inappropriate content.";
                duration = 15;
                break;
            case "advertising":
                reason =
                    "Member was advertising external products, services, or communities.";
                duration = 20;
                break;
            case "impersonation":
                reason = "Member was impersonating someone else.";
                duration = 10;
                break;
            case "trolling":
                reason = "Member was trolling or provoking others.";
                duration = 10;
                break;
            case "server_rules":
                reason = "Member violated server rules.";
                duration = 10;
                break;
            case "offensive_behavior":
                reason = "Member displayed offensive behavior.";
                duration = 10;
                break;
            case "breaking_tos":
                reason = "Member broke Discord's Terms of Service.";
                duration = 180;
                break;
            case "repeated_infractions":
                reason = "Member committed repeated infractions.";
                duration = 30;
                break;
            default:
                reason = customReason;
                break;
        }

        addWarning(guild.id, target.id);

        const warnings = checkWarnings(guild.id, target.id);
        if (warnings >= 4) {
            // Ban the user
            await guild.members.ban(target.id, {
                reason: "Exceeded warning limit",
            });
            return interaction.reply({
                content: `User banned because they received 4 warnings.`,
                ephemeral: true,
            });
        }

        if (warnings == 2) {
            duration = duration * 2;
        } else if (warnings >= 3) {
            duration = duration * 4 + 24 * 60;
        }

        const expiryTime = new Date(Date.now() + duration * 60 * 1000);

        await interaction.guild.members.fetch(guildMember);
        try {
            const loggingChannelId = await checkLoggingChannel(guild.id);

            if (loggingChannelId) {
                const channel = await client.channels.fetch(loggingChannelId);

                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Timed out`,
                                iconURL:
                                    "https://cdn3.emoji.gg/emojis/3769-timeout-clock.png",
                            })
                            .setThumbnail(
                                target.displayAvatarURL({
                                    format: "png",
                                    dynamic: true,
                                }) || ""
                            )
                            .setColor(0xfcbfcb)
                            .addFields(
                                {
                                    name: "Member",
                                    value: `${target}`,
                                    inline: true,
                                },
                                {
                                    name: "Time out will be removed",
                                    value: `${time(expiryTime, "R")}`,
                                    inline: true,
                                },
                                {
                                    name: "Moderated by",
                                    value: `${userMention(author.id)}`,
                                    inline: true,
                                },
                                {
                                    name: "Warnings",
                                    value: `${checkWarnings(
                                        guild.id,
                                        target.id
                                    )} warnings / 4 warnings`,
                                    inline: false,
                                },
                                {
                                    name: "Reason",
                                    value: `${reason}`,
                                    inline: false,
                                }
                            )
                            .setTimestamp(),
                    ],
                });

                if (duration <= 40320) {
                    guildMember
                        .disableCommunicationUntil(
                            expiryTime,
                            `${reason} Moderated by ${author.username}.`
                        )
                        .catch(console.error);
                    return interaction.reply({
                        content: `# ${timeout_emoji} Time-outed\n> **Target:** ${target}\n> **Duration:** ${time(
                            expiryTime,
                            "R"
                        )}\n> "${reason}" reason.\n\nNow they have **${checkWarnings(
                            guild.id,
                            target.id
                        )}** warnings.`,
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `${exclamationmark_circleEmoji} I cannot timeout more than 28 days. Can you?`,
                        ephemeral: true,
                    });
                }
            } else {
                if (duration <= 40320) {
                    guildMember
                        .disableCommunicationUntil(
                            expiryTime,
                            `${reason} Moderated by ${author.username}.`
                        )
                        .catch(console.error);

                    return interaction.reply({
                        content: ` # ${timeout_emoji} Time-outed\n> **Target:** ${target}\n> **Duration:** ${time(
                            expiryTime,
                            "R"
                        )}\n> "${reason}" reason.\n\nNow they have ${checkWarnings(
                            guild.id,
                            target.id
                        )} warnings.\n\n> _${exclamationmark_triangleEmoji} Logs channel has not been settled. Please use </setup logs:1223975368138952826> command._`,
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `${exclamationmark_circleEmoji} I cannot timeout more than 28 days. Can you?`,
                        ephemeral: true,
                    });
                }
            }
        } catch (err) {
            console.log(err);
            return interaction.reply({
                content: `Something went wrong, please contact with Neo.`,
                ephemeral: true,
            });
        }
    },
};
