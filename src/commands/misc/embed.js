const Discord = require("discord.js");
const commando = require('discord.js-commando');

module.exports = class mathCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'misc',
            memberName: 'embed',
            description: 'Create custom RichEmbeds on the fly',
            examples: ['embed FieldName:Value1;Value2,FieldName2:Value1;Value2'],
            guildOnly: false,

            args: [{
                key: 'embedContent',
                prompt: 'What should the content of the embed be?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let paramString = args.embedContent
        let customEmbed = new Discord.RichEmbed();

        let fields = paramString.split(',');
        fields.forEach(field => {
            let chunks = field.split(':');
            let header = chunks[0];
            let values = chunks[1].split(';');
            customEmbed.addField(header, values.join('\n'), true);
        });

        customEmbed
            .setColor("#e52431")
            .setFooter("A selfbot by Favna", "https://i.imgur.com/Ylv4Hdz.jpg")
            .setAuthor("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png");

        await msg.embed(customEmbed)
        await msg.delete()
    }
};