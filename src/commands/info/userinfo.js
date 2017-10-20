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

module.exports = class userInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            aliases: ['user', 'uinfo'],
            group: 'info',
            memberName: 'userinfo',
            description: 'Gets information about a user.',
            examples: ['uinfo {user}', 'uinfo Favna'],
            guildOnly: true,

            args: [{
                key: 'member',
                label: 'user',
                prompt: 'What user would you like to snoop on?',
                type: 'member',
                label: 'member name or ID'
            }]
        });
    }

    async run(msg, args) {
        const member = args.member;
        const user = member.user;
        const uinfoEmbed = new Discord.RichEmbed();

        uinfoEmbed
            .setAuthor(user.tag)
            .setImage(user.displayAvatarURL)
            .setColor(member.displayHexColor)
            .addField('ID', user.id, true)
            .addField('Name', user.username, true)
            .addField('Nickname', member.nickname !== null ? member.nickname : 'No Nickname', true)
            .addField('Status', user.presence.status, true)
            .addField('Playing', user.presence.game !== null ? user.presence.game.name : 'Nothing', true)
            .addField('Display Color', member.displayHexColor, true)
            .addField('Account created at', moment(user.createdAt).format('MMMM Do YYYY'), true)
            .addField('Joined server at', moment(member.joinedAt).format('MMMM Do YYYY'), true)
            .addField('Roles', member.roles.size > 1 ? member.roles.map(r => r.name).slice(1) : 'None', true);
        member.roles.size >= 1 ? uinfoEmbed.setFooter(`has ${member.roles.size - 1} role(s)`) : uinfoEmbed.setFooter(`has 0 roles`)

        await msg.embed(uinfoEmbed);
    }
};