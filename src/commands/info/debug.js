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

module.exports = class debugCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'debug',
            aliases: ['bug'],
            group: 'info',
            memberName: 'debug',
            description: 'Gets the channel or role names and their matching IDs on a server',
            examples: ['debug {bugType}', 'debug roles'],
            guildOnly: true,

            args: [{
                key: 'buggerType',
                prompt: 'Do you want to debug `channels` or `roles`?',
                type: 'string',
                label: 'channels or roles to debug'
            }]
        });
    }

    async run(msg, args) {
        let bugger = args.buggerType

        let debugEmbed = new Discord.MessageEmbed();
        debugEmbed.setColor("#FF0000")
        debugEmbed.setTitle(`The ${bugger} on this server are as follows`);

        if (bugger === "channels") {
            let channelNames = msg.guild.channels.filter(function (textFilter) {
                return textFilter.type === 'text';
            }).map(cn => cn.name);
            let channelIDs = msg.guild.channels.filter(function (textFilter) {
                return textFilter.type === 'text';
            }).map(cid => cid.id);

            debugEmbed.addField("Channel name", channelNames, true);
            debugEmbed.addBlankField(true);
            debugEmbed.addField("channel ID", channelIDs, true);

        } else if (bugger === "roles") {
            let roleIDs = msg.guild.roles.map(rid => rid.id);
            let roleNames = msg.guild.roles.map(rn => rn.name).slice(1);
            roleNames.unshift("Everyone");
            debugEmbed.addField("Role name", roleNames, true);
            debugEmbed.addBlankField(true);
            debugEmbed.addField("Role ID", roleIDs, true);
        } else {
            msg.reply('That is not a valid debugger option. Either `channels` or `roles`')
        };
        msg.embed(debugEmbed);
    };
};