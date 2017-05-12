const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class CommandInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '3dsguide',
            alias: ['plaiguide'],
            group: 'links',
            memberName: '3dsguide',
            description: 'A link to plailect\'s Nintendo 3DS Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let plaiGuideEmbed = new Discord.RichEmbed();

        plaiGuideEmbed
            .setColor("#CF010E")
            .setTitle("A one stop guide for (New) Nintendo 3DS (XL)")
            .setDescription("Want to get Custom Firmware on your Nintendo 3DS? Need instructions on how to set up Arm9loaderhax, Luma3DS and other homebrew? Follow this guide")
            .addField("\u200b", "https://3ds.guide")
            .setFooter("Nintendo 3DS Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png")
            .setThumbnail("https://s-media-cache-ak0.pinimg.com/736x/6d/75/88/6d7588481517a4c959bab8e3df39c92a.jpg")
        await msg.embed(plaiGuideEmbed)
    };
};