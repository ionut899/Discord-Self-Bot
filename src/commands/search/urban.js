const Discord = require("discord.js");
const commando = require('discord.js-commando');
const urban = require('urban');

module.exports = class urbanCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'search',
            aliases: ['ub', 'ud'],
            memberName: 'urban',
            description: 'Find definitions on urban dictionary',
            examples: ['urban everclear', 'ub everclear', 'ud everclear'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What word do you want to define?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        urban(args.query).first(async function (json) {
            if (json == undefined) {
                await msg.edit(`**No Results Found!**\nOriginal Message: ${msg.content.slice(9)}`);
            }
            let urbanEmbed = new Discord.RichEmbed;
            urbanEmbed
                .setAuthor(`Urban Search - ${json.word}`, `https://i.imgur.com/miYLsGw.jpg`)
                .setColor("#E86121")
                .setFooter(`${json.word} defined by PyrrhaBot`, "http://i.imgur.com/4U9oMS0.png")
                .addField("Definition", json.definition, false)
                .addField("Example", json.example, false)
                .addField("Permalink", json.permalink, false)
            await msg.embed(urbanEmbed);
        });
    };
};