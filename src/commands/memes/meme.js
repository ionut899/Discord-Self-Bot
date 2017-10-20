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

const Discord = require("discord.js");
const commando = require('discord.js-commando');
const path = require('path');

module.exports = class memeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            aliases: ['mem', 'maymay'],
            group: 'memes',
            memberName: 'meme',
            description: 'Send a meme image',
            examples: ['meme {imageName}', 'meme cry'],
            guildOnly: false,

            args: [{
                key: 'image',
                prompt: 'What image do you want send?',
                type: 'string',
                label: 'image name to send'
            }]
        });
    }

    async run(msg, args) {
        await msg.channel.send({
            file: path.join(__dirname, `/images/${args.image.toLowerCase()}.jpg`)
        });
        await msg.delete();
    }
};