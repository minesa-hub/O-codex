export default {
    name: "messageCreate",
    once: false,
    execute: async message => {
        if (message.content.toLowerCase().includes("neo"))
            return message.react("<:mns_neoWhyTho:1030121682712662088>");
        if (message.content.toLowerCase().includes("mica"))
            return message.react("<:mns_micaPain:1025347274856992788>");
        if (
            message.content.toLowerCase().includes("saku") ||
            message.content.toLowerCase().includes("daph")
        )
            return message.react("<:mns_sakuSimp2:961241395379720212>");
        if (message.content.toLowerCase().includes("sato"))
            return message.react("<:mns_satou_reaver:1031551310669025340>");
        if (
            message.content.includes("24") ||
            message.content.toLowerCase().includes("twenty four")
        )
            return message.react("💀");
        if (message.content.toLowerCase().includes("xd"))
            return message.react("<:mns_neoLoli:1030121214938718278>");
        if (message.content.toLowerCase().includes("mango"))
            return message.channel.send(
                "https://cdn.discordapp.com/attachments/736571695170584576/788883258120994876/IMG_20201217_003942.jpg",
            );
    },
};
