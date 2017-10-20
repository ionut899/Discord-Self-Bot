// Copyright (C) 2017 Favna
// 
// This file is part of Discord-Self-Bot.
// 
// Discord-Self-Bot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Discord-Self-Bot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Discord-Self-Bot.  If not, see <http://www.gnu.org/licenses/>.
// 

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
            description: 'Gets the definition on a word on glosbe',
            examples: ['define {word}', 'define pixel'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What word do you want to define?',
                type: 'string',
                label: 'Word to define'
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
                msg.embed(defineEmbed);
            })
            .catch((err) => {
                console.error(err);
                msg.reply(`**No results found!**`)
            });

    };
};