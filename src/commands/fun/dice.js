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
const Discord = require('discord.js');
const xdicey = require('xdicey');

module.exports = class diceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dice',
            aliases: ['xdicey', 'roll', 'dicey', 'die'],
            group: 'fun',
            memberName: 'dice',
            description: 'Sends contents of a copypasta file to the chat',
            examples: ['dice <sides_on_die> <amount_of_rolls>', 'dice 6 5'],
            guildOnly: false,

            args: [{
                key: 'sides',
                prompt: 'How many sides does your die have?',
                type: 'integer',
                label: 'Amount of sides the dice have'
            }, {
                key: 'rolls',
                prompt: 'How many times should the die be rolled?',
                type: 'integer',
                label: 'The amount of times the die is rolled'
            }]
        });
    }

    run(msg, args) {
        const throwDice = xdicey(args.rolls, args.sides);
        const res = [];
        for (let i in throwDice.individual) {
            res.push(`🎲: ${throwDice.individual[i]}`)
        }
        const diceEmbed = new Discord.MessageEmbed();
        diceEmbed
            .setColor('#EA596E')
            .addField('Dice result', res, false)
            .addField('Total', throwDice.total, false);
        return msg.embed(diceEmbed);
    };
};