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

module.exports = class gameSetCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'gameset',
            group: 'status',
            aliases: ['game', 'gs'],
            memberName: 'gameset',
            description: 'Set a fancy game status. Recommend to use 1 arg per reply to bot so you can use spaces. Can be used in pms.',
            examples: ['gameset'],
            guildOnly: false,

            args: [{
                    key: 'name',
                    prompt: 'Name of the game you are playing?',
                    type: 'string'
                },
                {
                    key: 'url',
                    prompt: 'URL of your stream?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        msg.client.user.setPresence({
            game: {
                name: args.name,
                type: 1,
                url: args.url
            }
        })
    };
};