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

module.exports = class djsguideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'djsguide',
            aliases: ['guide', 'djs'],
            group: 'links',
            memberName: 'djsguide',
            description: 'Gets the link to a specific Discord.JS class page and optionally section on that page',
            examples: ['djsguide {djs-class} {property/method/event}', 'djsguide client user'],
            guildOnly: false,

            args: [{
                key: 'class',
                prompt: 'Discord.JS class?',
                type: 'string'
            }, {
                key: 'section',
                prompt: 'Class section?',
                type: 'string',
                default: null
            }]
        });
    }

    async run(msg) {
        await msg.say(`https://discord.js.org/#/docs/main/stable/class/${args.class}?scrollTo=${args.section}`)
    };
};