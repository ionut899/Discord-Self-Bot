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

const scalc = require('scalc');
const commando = require('discord.js-commando');

module.exports = class mathCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'math',
            aliases: ['calc'],
            group: 'misc',
            memberName: 'math',
            description: 'Calculate anything',
            examples: ['math {equation to solve}', 'math -10 - abs(-3) + 2^5'],
            guildOnly: false,

            args: [{
                key: 'equation',
                prompt: 'What is the equation to solve?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let toCalc = args.equation;
        msg.delete();
        await msg.say(`\`The answer to ${toCalc} is ${scalc(toCalc)}\``)
    }
};