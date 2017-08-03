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
const path = require('path');

module.exports = class reactCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'react',
            group: 'reactions',
            memberName: 'react',
            description: 'React with an image',
            examples: ['react cry'],
            guildOnly: false,

            args: [{
                key: 'image',
                prompt: 'What image do you want to react with?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const image = args.image;
        await msg.channel.send({
            file: path.join(__dirname, `/images/${image}.jpg`)
        });
        await msg.delete();
    }
};