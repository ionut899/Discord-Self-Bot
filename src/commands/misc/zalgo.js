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

const zalgo = require('zalgotxt');
const commando = require('discord.js-commando');

module.exports = class zalgoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'zalgo',
            group: 'misc',
            memberName: 'zalgo',
            description: 'F*ck up text using Zalgo',
            examples: ['zalgo {message}','zalgo HE COMES'],
            guildOnly: false,

            args: [{
                key: 'txt',
                prompt: 'What should I zalgolize?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        msg.delete();
        msg.say(zalgo(args.txt));
    };
};