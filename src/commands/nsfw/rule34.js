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
const booru = require('booru');

module.exports = class rule34Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'rule34',
            group: 'nsfw',
            aliases: ['r34'],
            memberName: 'rule34',
            description: 'Find NSFW Content on Rule34',
            examples: ['rule34 {NSFW Query}', 'rule34 Pyrrha Nikos'],
            guildOnly: false,
            nsfw: true,

            args: [{
                key: 'nsfwtags',
                prompt: 'What do you want to find NSFW for?',
                type: 'string',
                label: 'Search query'
            }]
        });
    }

    async run(msg, args) {

        booru.search("r34", args.nsfwtags.split(' '), {
                limit: 1,
                random: true
            })
            .then(booru.commonfy)
            .then(images => {
                // Show juicy NSFW image
                for (let image of images) {
                    msg.say(`Score: ${images[0].common.score}\nImage: ${images[0].common.file_url}`);
                };
            }).catch(err => {
                if (err.name === 'booruError') {
                    console.error(err.message);
                    return msg.reply('No juicy images found 😦')
                } else {
                    console.error(err);
                    return msg.reply('An error occured 😦. This message has notified Favna')
                };
            });
    }
};