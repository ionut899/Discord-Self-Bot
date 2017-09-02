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

module.exports = class destroyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'destroy',
            group: 'status',
            aliases: ['kill', 'logoff', 'reboot', 'exit'],
            memberName: 'destroy',
            description: 'Kills the bot. If using pm2 to manage your process this will ensure it reboots',
            examples: ['destroy'],
            guildOnly: false
        });
    }

    async run(msg) {
        msg.reply("NOOOOOOOOOOOOOOOO I DON'T WANT TO DI.... bzzzzzzzzzzzzzzz");
        msg.client.destroy();
    }

};