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

const Discord = require("discord.js");
const commando = require('discord.js-commando');
const coin = require('flipacoin');

module.exports = class coinCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            group: 'fun',
            aliases: ['flip'],
            memberName: 'coin',
            description: 'Flip a coin',
            examples: ['flip'],
            guildOnly: false,
        });
    }

    async run(msg, args) {
        let coinEmbed = new Discord.RichEmbed();
        let res = coin();
        coinEmbed
            .setColor('#FF0000')
            .setImage(res === 'head' ? 'https://favna.s-ul.eu/8ZKmpiKO.png' : 'https://favna.s-ul.eu/NTsDbSUo.png')
            .setTitle(`Flipped ${res}s`)

        msg.embed(coinEmbed)
    };
};