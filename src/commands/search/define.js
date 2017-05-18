const Discord = require("discord.js");
const commando = require('discord.js-commando');
const superagent = require('superagent');

module.exports = class defineCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'define',
            group: 'search',
            aliases: ['def'],
            memberName: 'define',
            description: 'Find definitions on glosbe',
            examples: ['define pixel', 'def pixel'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What word do you want to define?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let defineEmbed = new Discord.RichEmbed();
        superagent.get(`https://glosbe.com/gapi/translate?from=en&dest=en&format=json&phrase=${args.query}`)
            .then((res) => res.body)
            .then((res) => {
                if (res.tuc == undefined) {
                    return msg.reply(`**No results found!**`)
                }
                const final = [`**Definitions for __${args.query}__:**`];
                for (let [index, item] of Object.entries(res.tuc.filter(t => t.meanings)[0].meanings.slice(0, 5))) {

                    item = item.text
                        .replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '_')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, `'`)
                        .replace(/<b>/g, '[')
                        .replace(/<\/b>/g, ']')
                        .replace(/<i>|<\/i>/g, '_');
                    final.push(`**${(parseInt(index) + 1)}:** ${item}`);
                }
                defineEmbed
                    .setColor("#FF0000")
                    .setDescription(final)
                    .setFooter("PyrrhaBot", "http://i.imgur.com/4U9oMS0.png")
                msg.embed(defineEmbed);
            })
            .catch((err) => {
                console.error(err);
                msg.reply(`**No results found!**`)
            });

    };
};