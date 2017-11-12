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

module.exports = class dndCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dnd',
            group: 'status',
            aliases: ['busy', 'red'],
            memberName: 'dnd',
            description: 'Set your status to Do Not Disturb',
            examples: ['dnd'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.client.user.setPresence({
                status: "dnd"
            }).then(msg.reply('Status set to do not disturb'))
            .catch((e) => console.error(e));
    };
};