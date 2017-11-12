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

module.exports = class avatarCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['ava'],
            group: 'info',
            memberName: 'avatar',
            description: 'Gets the avatar from a user',
            examples: ['avatar {member name or ID}', 'avatar Favna'],
            guildOnly: true,

            args: [{
                key: 'member',
                prompt: 'What user would you like to get the avatar from?',
                type: 'member',
                label: 'member name or ID'
            }]
        });
    }

    async run(msg, args) {
        const member = args.member;
        const user = member.user;
        await msg.say(user.displayAvatarURL());
    }
};