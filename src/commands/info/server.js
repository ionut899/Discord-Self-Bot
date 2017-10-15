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

const commando = require('discord.js-commando');
const Discord = require("discord.js");
const moment = require('moment');

module.exports = class serverInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'server',
            aliases: ['serverinfo', 'sinfo'],
            group: 'info',
            memberName: 'server',
            description: 'Gets information about the server.',
            examples: ['server {serverName ID (partial or full)}', `server Favna's Selfbot`],
            guildOnly: false,

            args: [{
                key: 'server',
                prompt: 'Get info from which server?',
                type: 'guild',
                default: 'current'
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'text' && args.server === 'current') return msg.reply('An argument of server name (partial or full) or server ID is required when talking outside of a server')

        const serverEmbed = new Discord.RichEmbed();
        const guild = args.server === 'current' ? msg.guild : args.server
        const presences = guild.presences.map(st => st.status)
        const channels = guild.channels.map(ty => ty.type);
        var onlineMembers = 0;
        var guildChannels = 0;

        for (let i in presences) {
            if (presences[i] !== 'offline') {
                onlineMembers++
            }
        }
        for (let i in channels) {
            if (channels[i] === 'text') {
                guildChannels++
            }
        }

        serverEmbed
            .setColor(guild.owner.displayHexColor)
            .setAuthor('Server Info', 'https://favna.s-ul.eu/O0qc0yt7.png')
            .setThumbnail(guild.iconURL)
            .setFooter(`Server ID: ${guild.id}`)
            .addField('Server Name', guild.name, true)
            .addField('Owner', guild.owner.user.tag, true)
            .addField('Members', guild.memberCount, true)
            .addField('Currently Online', onlineMembers, true)
            .addField('Region', guild.region, true)
            .addField('Highest Role', guild.roles.sort((a, b) => a.position - b.position || a.id - b.id).last().name, true)
            .addField('Number of emojis', guild.emojis.size, true)
            .addField('Number of roles', guild.roles.size, true)
            .addField('Number of channels', guildChannels, true)

            .addField('Created At', moment(guild.createdTimestamp).format('MMMM Do YYYY [@] HH:mm:ss [UTC]Z'), false)
            .addField('Verification Level', data.verifyLevel[guild.verificationLevel], false)
            .addField('Excplicit Content Filter', data.contentFilter[guild.explicitContentFilter], false)

        guild.splashURL !== null ? serverEmbed.setImage(guild.splashURL) : null;
        await msg.embed(serverEmbed);
    }
};

data = {
    verifyLevel: {
        0: 'None - unrestricted',
        1: 'Low - must have verified email on account',
        2: 'Medium - must be registered on Discord for longer than 5 minutes',
        3: 'High - 	(╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes',
        4: 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number'
    },
    contentFilter: {
        0: 'Content filter disabled',
        1: 'Scan messages of members without a role',
        2: 'Scan messages sent by all members',
    }
}