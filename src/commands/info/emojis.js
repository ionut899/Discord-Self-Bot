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

const commando = require('discord.js-commando');
const Discord = require("discord.js");
const moment = require('moment');

module.exports = class emojisCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'emojis',
            aliases: ['moji', 'mojis', 'emoji'],
            group: 'info',
            memberName: 'emoji',
            description: 'Gets emojis from a server given its ID',
            examples: ['emojis 246821351585742851', 'moji 246821351585742851'],
            guildOnly: false,

            args: [{
                key: 'server',
                label: 'ID',
                prompt: 'What server would you like the emojis from?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const server = args.server;
        let client = msg.member.user.client;
        let guildMojiNames = client.guilds.get(server).emojis.map(gmoji => gmoji.name);
        let emojisSetOne = [];
        let emojisSetTwo = [];
        let emojisSetThree = [];
        let emojisEmbed = new Discord.RichEmbed();
        for (let i = 0; i < guildMojiNames.length; i++) {

            if (emojisSetOne.toString().length <= 900) {
                emojisSetOne.push(`\`:${guildMojiNames[i]}:\` for ${client.guilds.get(server).emojis.find('name', guildMojiNames[i])}`)
            } else if (emojisSetTwo.toString().length <= 900) {
                emojisSetTwo.push(`\`:${guildMojiNames[i]}:\` for ${client.guilds.get(server).emojis.find('name', guildMojiNames[i])}`)
            } else {
                emojisSetThree.push(`\`:${guildMojiNames[i]}:\` for ${client.guilds.get(server).emojis.find('name', guildMojiNames[i])}`)
            }
        }
        emojisEmbed
            .setColor('#FF0000')
            .setFooter(`A Selfbot by Favna | Command issued at ${moment().format('MMMM Do YYYY HH:mm:ss')}`, 'http://i.imgur.com/4U9oMS0.png')
            .setDescription(`Emojis from the server \`${client.guilds.get(server).name}\``);
        emojisSetOne.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetOne, true) : emojisEmbed.addField('This server has no custom emojis', 'Although they should totally get some', true);
        emojisSetTwo.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetTwo, true) : null;
        emojisSetThree.length !== 0 ? emojisEmbed.addField('\u200b', emojisSetThree, true) : null;
        await msg.embed(emojisEmbed);
    };
};