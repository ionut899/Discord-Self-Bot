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
const moment = require('moment');

module.exports = class fyidmCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'fyidm',
            group: 'info',
            aliases: ['dm', 'discmatch', 'dmatch'],
            memberName: 'fyidm',
            description: 'Returns a list of users who have the same discriminator (the 4 digits after the username) as you. fyidm is short for "Find your ID Mate"',
            examples: ['fyidm {4 digit discriminator}', 'fyidm 0000'],
            guildOnly: false,

            args: [{
                key: 'discrim',
                prompt: 'Check which discriminator',
                type: 'string',
                default: 'self',
                max: 4,
                min: 4,
                label: 'The custom input discriminator'
            }]
        });
    }

    async run(msg, args) {
        const fyidmEmbed = new Discord.MessageEmbed();
        const discrim = args.discrim === 'self' ? msg.author.discriminator : args.discrim;

        var discrimMatches = this.client.users.filter(u => u.discriminator === discrim);
        discrimMatches.delete(msg.author.id);
        var matchEntries = discrimMatches.entries()

        fyidmEmbed
            .setColor('#FF0000')
            .setTitle('Uses with matching discriminator')
            .setFooter(`Discriminator match checked on ${moment().format('MMMM Do YYYY HH:mm:ss')}`);

        for (let i = 0; i < discrimMatches.size; i++) {
            var match = matchEntries.next().value[1];
            if (discrimMatches.size <= 8) {
                fyidmEmbed.addField('Username', match.username, true)
                fyidmEmbed.addField('Discriminator', match.discriminator, true)
                fyidmEmbed.addField('UserID', match.id, true)
            } else {
                fyidmEmbed.addField('Username || Discriminator || UserID', `${match.username} || ${match.discriminator} || ${match.id}`, false);
            }
        }

        msg.embed(fyidmEmbed);
    };
};