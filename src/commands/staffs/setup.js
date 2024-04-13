import {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    underscore,
    bold,
} from "discord.js";
import {
    button_emoji,
    ticket_created,
    ticket_emoji,
    exclamationmark_triangleEmoji,
    checkmark_emoji,
} from "../../shortcuts/emojis.js";
import { EMBED_COLOR } from "../../config.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import {
    saveStaffRoleId,
    setupLoggingChannel,
    setupWarningRoles,
} from "../../shortcuts/database.js";

export default {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("setup")
        .setNameLocalizations({
            tr: "kur",
            it: "impostare",
            "zh-CN": "设置",
        })
        .setDescription("Setup things!")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ticket")
                .setNameLocalizations({
                    "zh-CN": "票",
                    it: "biglietto",
                    tr: "bilet",
                })
                .setDescription("Setup ticket system with threads!")
                .setDescriptionLocalizations({
                    "zh-CN": "使用线程设置票证系统。",
                    it: "Configurazione del sistema di ticket con thread.",
                    tr: "Alt başlıklarla bilet sistemi kurulumunu yap.",
                })
                .addRoleOption((option) =>
                    option
                        .setName("staff_role")
                        .setNameLocalizations({
                            "zh-CN": "员工角色",
                            it: "ruolo_del_personale",
                            tr: "personel_rolü",
                        })
                        .setDescription(
                            "Role to be tagged when ticket channel is created"
                        )
                        .setDescriptionLocalizations({
                            "zh-CN": "创建工单通道时要标记的角色",
                            it: "Ruolo da taggare quando viene creato il canale ticket",
                            tr: "Bilet kanalı oluşturulduğunda etiketlenecek rol",
                        })
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .addChannelTypes(ChannelType.GuildText)
                        .setName("channel")
                        .setNameLocalizations({
                            "zh-CN": "渠道",
                            it: "canale",
                            tr: "kanal",
                        })
                        .setDescription("Please select a channel")
                        .setDescriptionLocalizations({
                            "zh-CN": "选择要将消息发送到的频道",
                            it: "Seleziona un canale a cui inviare il messaggio",
                            tr: "Mesajın gönderileceği kanalı seçin",
                        })
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("description")
                        .setNameLocalizations({
                            "zh-CN": "描述",
                            it: "descrizione",
                            tr: "açıklama",
                        })
                        .setDescription("Set description of embed message")
                        .setDescriptionLocalizations({
                            "zh-CN": "设置嵌入消息的描述",
                            it: "Imposta la descrizione del messaggio incorporato",
                            tr: "Zengin mesajının açıklamasını ayarlayın",
                        })
                        .setRequired(false)
                )
                .addAttachmentOption((option) =>
                    option
                        .setName("image")
                        .setNameLocalizations({
                            ChineseCN: "图片",
                            it: "immagine",
                            tr: "resim",
                            "pt-BR": "imagem",
                            ro: "imagine",
                            el: "εικόνα",
                        })
                        .setDescription(
                            "Upload your own banner for ticket message!"
                        )
                        .setDescriptionLocalizations({
                            ChineseCN: "为工单消息上传您自己的图片！",
                            it: "Carica la tua immagine per il messaggio del ticket!",
                            tr: "Ticket mesajı için kendi resminizi yükleyin!",
                            "pt-BR":
                                "Faça o upload da sua própria imagem para a mensagem do ticket!",
                            ro: "Încărcați propria imagine pentru mesajul biletului!",
                            el: "Μεταφορτώστε τη δική σας εικόνα για το μήνυμα του εισιτηρίου!",
                        })
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName("color")
                        .setNameLocalizations({
                            "zh-CN": "颜色",
                            it: "colore",
                            tr: "renk",
                        })
                        .setDescription("🔴🟠🟡🟢🔵🟣⚫️⚪️")
                        .setRequired(false)
                        .addChoices(
                            {
                                name: "Lilac",
                                value: "#D9B2FF",
                                name_localizations: {
                                    "zh-CN": "丁香色",
                                    it: "Lilla",
                                    tr: "Lila",
                                    "pt-BR": "Lilás",
                                    ro: "Liliac",
                                    el: "Λιλά",
                                },
                            },
                            {
                                name: "Powder Blue",
                                value: "#BFEFFF",
                                name_localizations: {
                                    "zh-CN": "粉蓝色",
                                    it: "Celeste in polvere",
                                    tr: "Toz Mavisi",
                                    "pt-BR": "Azul-pó",
                                    ro: "Albastru Pulbere",
                                    el: "Σκόνη Μπλε",
                                },
                            },
                            {
                                name: "Mauve",
                                value: "#FFB6C1",
                                name_localizations: {
                                    "zh-CN": "粉紫色",
                                    it: "Malva",
                                    tr: "Eflatun",
                                    "pt-BR": "Malva",
                                    ro: "Mov",
                                    el: "Μαύρο",
                                },
                            },
                            {
                                name: "Pale Green",
                                value: "#C8FFB0",
                                name_localizations: {
                                    "zh-CN": "苍白绿色",
                                    it: "Verde pallido",
                                    tr: "Soluk Yeşil",
                                    "pt-BR": "Verde Pálido",
                                    ro: "Verde Pal",
                                    el: "Ανοιχτό Πράσινο",
                                },
                            },
                            {
                                name: "Ivory",
                                value: "#FFFFF0",
                                name_localizations: {
                                    "zh-CN": "象牙白",
                                    it: "Avorio",
                                    tr: "Fildişi",
                                    "pt-BR": "Marfim",
                                    ro: "Ivoriu",
                                    el: "Κρεμ",
                                },
                            },
                            {
                                name: "Slate",
                                value: "#B0C4DE",
                                name_localizations: {
                                    "zh-CN": "青石色",
                                    it: "Ardesia",
                                    tr: "Arduvaz",
                                    "pt-BR": "Pardacento",
                                    ro: "Ardezie",
                                    el: "Σχιστόλιθος",
                                },
                            },
                            {
                                name: "Mint",
                                value: "#BDFCC9",
                                name_localizations: {
                                    "zh-CN": "薄荷绿色",
                                    it: "Menta",
                                    tr: "Nane",
                                    "pt-BR": "Hortelã",
                                    ro: "Mentă",
                                    el: "Δροσιά",
                                },
                            },
                            {
                                name: "Lavender Gray",
                                value: "#C4C3D0",
                                name_localizations: {
                                    "zh-CN": "薰衣草灰色",
                                    it: "Lavanda grigio",
                                    tr: "Beyaz Lavanta",
                                    "pt-BR": "Lavanda Cinza",
                                    ro: "Levănțică Gri",
                                    el: "Γκρίζος λεβάντα",
                                },
                            },
                            {
                                name: "Pink",
                                value: "#FFC0CB",
                                name_localizations: {
                                    "zh-CN": "粉红色",
                                    it: "Rosa",
                                    tr: "Pembe",
                                    "pt-BR": "Rosa",
                                    ro: "Roz",
                                    el: "Ροζ",
                                },
                            },
                            {
                                name: "Silver",
                                value: "#C0C0C0",
                                name_localizations: {
                                    "zh-CN": "银色",
                                    it: "Argento",
                                    tr: "Gümüş",
                                    "pt-BR": "Prata",
                                    ro: "Argint",
                                    el: "Ασημί",
                                },
                            },
                            {
                                name: "Peach",
                                value: "#FFE5B4",
                                name_localizations: {
                                    "zh-CN": "桃色",
                                    it: "Pesca",
                                    tr: "Şeftali",
                                    "pt-BR": "Pêssego",
                                    ro: "Piersic",
                                    el: "Ροδάκινο",
                                },
                            },
                            {
                                name: "Pale Yellow",
                                value: "#FFFFB2",
                                name_localizations: {
                                    "zh-CN": "苍白黄色",
                                    it: "Giallo pallido",
                                    tr: "Soluk Sarı",
                                    "pt-BR": "Amarelo Pálido",
                                    ro: "Galben Pal",
                                    el: "Ανοιχτό Κίτρινο",
                                },
                            },
                            {
                                name: "Light Gray",
                                value: "#D3D3D3",
                                name_localizations: {
                                    "zh-CN": "浅灰色",
                                    it: "Grigio chiaro",
                                    tr: "Açık Gri",
                                    "pt-BR": "Cinza Claro",
                                    ro: "Gri deschis",
                                    el: "Ανοιχτό Γκρίζο",
                                },
                            },
                            {
                                name: "Lavender",
                                value: "#E6E6FA",
                                name_localizations: {
                                    "zh-CN": "薰衣草色",
                                    it: "Lavanda",
                                    tr: "Beyaz Lavanta",
                                    "pt-BR": "Lavanda",
                                    ro: "Levănțică",
                                    el: "Λεβάντα",
                                },
                            },
                            {
                                name: "Sky Blue",
                                value: "#87CEEB",
                                name_localizations: {
                                    "zh-CN": "天蓝色",
                                    it: "Azzurro cielo",
                                    tr: "Gökyüzü Mavisi",
                                    "pt-BR": "Azul-celeste",
                                    ro: "Albastru cer",
                                    el: "Ουρανίσιο Μπλε",
                                },
                            },
                            {
                                name: "Beige",
                                value: "#F5F5DC",
                                name_localizations: {
                                    "zh-CN": "米色",
                                    it: "Beige",
                                    tr: "Bej",
                                    "pt-BR": "Bege",
                                    ro: "Bej",
                                    el: "Μπεζ",
                                },
                            },
                            {
                                name: "Salmon",
                                value: "#FFA07A",
                                name_localizations: {
                                    "zh-CN": "鲑鱼色",
                                    it: "Salmone",
                                    tr: "Somon",
                                    "pt-BR": "Salmão",
                                    ro: "Somon",
                                    el: "Σολομός",
                                },
                            },
                            {
                                name: "Platinum",
                                value: "#E5E4E2",
                                name_localizations: {
                                    "zh-CN": "铂金色",
                                    it: "Platino",
                                    tr: "Platin",
                                    "pt-BR": "Platina",
                                    ro: "Platină",
                                    el: "Πλατίνα",
                                },
                            },
                            {
                                name: "Misty Rose",
                                value: "#FFE4E1",
                                name_localizations: {
                                    "zh-CN": "粉玫瑰色",
                                    it: "Rosa nebbia",
                                    tr: "Dumanlı Gül",
                                    "pt-BR": "Rosa Orvalhado",
                                    ro: "Roz cețos",
                                    el: "Ροζ ομίχλης",
                                },
                            },
                            {
                                name: "Light Cyan",
                                value: "#E0FFFF",
                                name_localizations: {
                                    "zh-CN": "淡青色",
                                    it: "Ciano chiaro",
                                    tr: "Açık Mavi",
                                    "pt-BR": "Ciano Claro",
                                    ro: "Cyan Deschis",
                                    el: "Ανοιχτό Κυανό",
                                },
                            },
                            {
                                name: "Light Pink",
                                value: "#FFB6C1",
                                name_localizations: {
                                    "zh-CN": "浅粉色",
                                    it: "Rosa chiaro",
                                    tr: "Açık Pembe",
                                    "pt-BR": "Rosa Claro",
                                    ro: "Roz deschis",
                                    el: "Ανοιχτό Ροζ",
                                },
                            },
                            {
                                name: "Pale Turquoise",
                                value: "#AFEEEE",
                                name_localizations: {
                                    "zh-CN": "苍白蓝绿色",
                                    it: "Turchese pallido",
                                    tr: "Soluk Turkuaz",
                                    "pt-BR": "Turquesa Pálida",
                                    ro: "Turcoaz Pal",
                                    el: "Ανοιχτό Τυρκουάζ",
                                },
                            },
                            {
                                name: "Light Salmon",
                                value: "#FFA07A",
                                name_localizations: {
                                    "zh-CN": "浅鲑鱼色",
                                    it: "Salmone chiaro",
                                    tr: "Açık Somon",
                                    "pt-BR": "Salmão Claro",
                                    ro: "Somon deschis",
                                    el: "Ανοιχτό Σολομός",
                                },
                            },
                            {
                                name: "Black",
                                value: "#000000",
                                name_localizations: {
                                    "zh-CN": "黑色",
                                    it: "Nero",
                                    tr: "Siyah",
                                    "pt-BR": "Preto",
                                    ro: "Negru",
                                    el: "Μαύρο",
                                },
                            },
                            {
                                name: "White",
                                value: "#FFFFFF",
                                name_localizations: {
                                    "zh-CN": "白色",
                                    it: "Bianco",
                                    tr: "Beyaz",
                                    "pt-BR": "Branco",
                                    ro: "Alb",
                                    el: "Λευκό",
                                },
                            }
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("logs")
                .setNameLocalizations({
                    "zh-CN": "记录",
                    it: "registrazione",
                    tr: "kayıt",
                })
                .setDescription("Loggin' everything!")
                .setDescriptionLocalizations({
                    "zh-CN": "记录一切！",
                    it: "Registrando tutto!",
                    tr: "Her şeyi günlüğe kaydediyorum!",
                })
                .addChannelOption((option) =>
                    option
                        .addChannelTypes(ChannelType.GuildText)
                        .setName("channel")
                        .setNameLocalizations({
                            "zh-CN": "渠道",
                            it: "canale",
                            tr: "kanal",
                        })
                        .setDescription("Please select a channel")
                        .setDescriptionLocalizations({
                            "zh-CN": "请选择频道",
                            it: "Seleziona un canale",
                            tr: "Lütfen bir kanal seçin",
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("warning")
                .setNameLocalizations({
                    tr: "uyarı",
                    it: "avviso",
                    "zh-CN": "警告",
                    el: "προειδοποίηση",
                    "pt-BR": "aviso",
                    ro: "avertizare",
                })
                .setDescription("Set warning roles for punishment system.")
                .setDescriptionLocalizations({
                    tr: "Cezalandırma sistemi için uyarı rollerini ayarlayın.",
                    it: "Imposta i ruoli di avviso per il sistema di punizione.",
                    "zh-CN": "设置惩罚系统的警告角色。",
                    el: "Ορίστε ρόλους προειδοποίησης για το σύστημα τιμωρίας.",
                    "pt-BR":
                        "Defina os cargos de aviso para o sistema de punição.",
                    ro: "Setați rolurile de avertizare pentru sistemul de pedeapsă.",
                })
                .addRoleOption((option) =>
                    option
                        .setName("warning_1")
                        .setNameLocalizations({
                            tr: "uyarı_1",
                            it: "avviso_1",
                            "zh-CN": "警告_1",
                            el: "προειδοποίηση_1",
                            "pt-BR": "aviso_1",
                            ro: "avertizare_1",
                        })
                        .setDescription("Set a role for first warning.")
                        .setDescriptionLocalizations({
                            tr: "İlk uyarı için bir rol belirleyin.",
                            it: "Imposta un ruolo per il primo avviso.",
                            "zh-CN": "设置第一个警告的角色。",
                            el: "Ορίστε έναν ρόλο για την πρώτη προειδοποίηση.",
                            "pt-BR": "Defina um cargo para o primeiro aviso.",
                            ro: "Setați un rol pentru prima avertizare.",
                        })
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("warning_2")
                        .setNameLocalizations({
                            tr: "uyarı_2",
                            it: "avviso_2",
                            "zh-CN": "警告_2",
                            el: "προειδοποίηση_2",
                            "pt-BR": "aviso_2",
                            ro: "avertizare_2",
                        })
                        .setDescription("Set a role for second warning.")
                        .setDescriptionLocalizations({
                            tr: "İkinci uyarı için bir rol belirleyin.",
                            it: "Imposta un ruolo per il secondo avviso.",
                            "zh-CN": "设置第二个警告的角色。",
                            el: "Ορίστε έναν ρόλο για τη δεύτερη προειδοποίηση.",
                            "pt-BR": "Defina um cargo para o segundo aviso.",
                            ro: "Setați un rol pentru a doua avertizare.",
                        })
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("warning_3")
                        .setNameLocalizations({
                            tr: "uyarı_3",
                            it: "avviso_3",
                            "zh-CN": "警告_3",
                            el: "προειδοποίηση_3",
                            "pt-BR": "aviso_3",
                            ro: "avertizare_3",
                        })
                        .setDescription("Set a role for third warning.")
                        .setDescriptionLocalizations({
                            tr: "Üçüncü uyarı için bir rol belirleyin.",
                            it: "Imposta un ruolo per il terzo avviso.",
                            "zh-CN": "设置第三个警告的角色。",
                            el: "Ορίστε έναν ρόλο για την τρίτη προειδοποίηση.",
                            "pt-BR": "Defina um cargo para o terceiro aviso.",
                            ro: "Setați un rol pentru a treia avertizare.",
                        })
                        .setRequired(true)
                )
        ),
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.EmbedLinks
            )
        )
            return;

        const guild = interaction.guild;

        // ticket system
        if (interaction.options.getSubcommand() == "ticket") {
            const embedDescription =
                interaction.options.getString("description");
            const embedColor = interaction.options.getString("color");
            const staffRole = interaction.options.getRole("staff_role").id;
            const banner = interaction.options.getAttachment("image");
            const sendingChannel = interaction.options.getChannel("channel");

            const embed = new EmbedBuilder()
                .setDescription(
                    embedDescription
                        ? embedDescription
                        : `# ${button_emoji} Create a Ticket\nIf you're experiencing an ticket with our product or service, please use the "Create ticket" button to report it. This includes any server-related tickets you may be encountering in our Discord server.`
                )
                .setColor(embedColor ? embedColor : EMBED_COLOR)
                .setImage(
                    banner
                        ? banner.url
                        : "https://cdn.discordapp.com/attachments/736571695170584576/1217221352134807613/IMG_0212.png?ex=66033cb9&is=65f0c7b9&hm=aef4f257a97c8abf645a4e5d7294ca3dec849b46b36afe8ee324d62615ad780d&"
                )
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL(),
                });

            const createticketButton = new ButtonBuilder()
                .setCustomId(`create-ticket`)
                .setLabel("Create ticket")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(ticket_emoji);

            const row = new ActionRowBuilder().addComponents(
                createticketButton
            );

            await interaction.reply({
                content: `${ticket_created} Created the ticket system succesfully!`,
                ephemeral: true,
            });

            saveStaffRoleId(guild.id, staffRole);

            await sendingChannel.send({
                embeds: [embed],
                components: [row],
            });

            if (
                !interaction.guild.members.me.permissions.has(
                    PermissionFlagsBits.ManageMessages
                )
            )
                return interaction.followUp({
                    content: `## ${
                        exclamationmark_triangleEmoji +
                        " " +
                        underscore("Recommending")
                    }\nIf Kaeru has ${bold(
                        "Manage Messages"
                    )} permission, it will be very easy to reach at first message with pinned messages for staff members.`,
                    ephemeral: true,
                });
        }
        // logs system
        if (interaction.options.getSubcommand() == "logs") {
            const logginChannel = interaction.options.getChannel("channel");

            setupLoggingChannel(guild.id, logginChannel.id);

            await logginChannel.send({
                content: "Successfully setup the loggin channel",
            });

            return interaction.reply({
                content: `${checkmark_emoji} Done!\nI will log stuffs in there, so you see them instead going to Audit Logs! Easy, peasy! ☕️`,
                ephemeral: true,
            });
        }
        // warning system
        if (interaction.options.getSubcommand() == "warning") {
            const warning_1 = interaction.options.getRole("warning_1");
            const warning_2 = interaction.options.getRole("warning_2");
            const warning_3 = interaction.options.getRole("warning_3");

            setupWarningRoles(
                guild.id,
                warning_1.id,
                warning_2.id,
                warning_3.id
            );

            return interaction.reply({
                content: `## ${checkmark_emoji} Done!\nThese roles will be logged to members who does bad bad stuffs!`,
                ephemeral: true,
            });
        }
    },
};
