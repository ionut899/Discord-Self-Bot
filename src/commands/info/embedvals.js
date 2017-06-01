const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class embedValsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'valsofembed',
            aliases: ['embedvals', 'vals'],
            group: 'info',
            memberName: 'valsofembed',
            description: 'For showing how a RichEmbed is build up',
            guildOnly: false
        });
    }

    async run(msg) {
        var valsOfEmbed = new Discord.RichEmbed();
        valsOfEmbed
            .setAuthor("This is the author", "https://i.imgur.com/cgr5eSk.png")
            .setColor("#ffffff")
            .setDescription("This is the description")
            .setFooter("This is the footer", "https://i.imgur.com/kPNjOuJ.png")
            .setImage("https://i.imgur.com/l32vg3M.png")
            .setThumbnail("https://i.imgur.com/IQVvBcn.png")
            .setTimestamp()
            .setTitle("This is the title")
            .setURL("https://www.google.com")
            .addField("FieldName", "FieldValue", true);
        await msg.embed(valsOfEmbed)
    }
};