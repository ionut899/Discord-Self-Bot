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

const predict = require('eightball');
const Discord = require("discord.js");
const commando = require('discord.js-commando');

module.exports = class eightBallCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'fun',
            aliases: ['eightball'],
            memberName: '8ball',
            description: 'Roll a magic 8ball',
            examples: ['8ball {question}', '8ball is Favna a genius coder?'],
            guildOnly: false,

            args: [{
                key: 'question',
                prompt: '8ball what?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let eightBallEmbed = new Discord.RichEmbed();
        eightBallEmbed
            .setColor('#71CD40')
            .addField(':question: Question', args.question, false)
            .addField(':8ball: 8ball', predict(), false)
        msg.embed(eightBallEmbed)
    };
};