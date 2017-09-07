// Copyright (C) 2017 Favna
// 
// This file is part of PyrrhaBot.
// 
// PyrrhaBot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// PyrrhaBot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with PyrrhaBot.  If not, see <http://www.gnu.org/licenses/>.
// 

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
            examples: ['urban {word}', 'urban ugt'],
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
                await msg.say(`**No Results Found!**`);
            }
            let urbanEmbed = new Discord.RichEmbed;
            urbanEmbed
                .setAuthor(`Urban Search - ${json.word}`, `https://i.imgur.com/miYLsGw.jpg`)
                .setColor("#E86121")
                .addField("Definition", json.definition.length <= 1024 ? json.definition : `Truncated due to exceeding maximum length\n${json.definition.slice(0,970)}`, false)
                .addField("Example", json.example.length <= 1024 ? json.example : `Truncated due to exceeding maximum length\n${json.example.slice(0,970)}`, false)
                .addField("Permalink", json.permalink, false)
            await msg.embed(urbanEmbed);
        });
    };
};