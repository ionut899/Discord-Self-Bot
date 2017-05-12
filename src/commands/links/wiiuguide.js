const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class CommandInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'wiiuguide',
            alias: ['rednand', 'mocha'],
            group: 'links',
            memberName: 'wiiuguide',
            description: 'A link to plailect\'s Nintendo WiiU Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let wiiuguideEmbed = new Discord.RichEmbed();

        wiiuguideEmbed
            .setColor("#00ACCA")
            .setTitle("A one stop guide for Wii U")
            .setDescription("Want to run game backups on your WiiU? Need instructions on how to set up haxchi, mocha and rednand? Follow this guide")
            .addField("\u200b", "https://wiiu.guide")
            .setFooter("Nintendo WiiU Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png")
            .setThumbnail("http://i68.tinypic.com/2zizozn.png")
        await msg.embed(wiiuguideEmbed)
    };
};