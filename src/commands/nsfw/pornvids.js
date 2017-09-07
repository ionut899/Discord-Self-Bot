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
const pornsearch = require('pornsearch');
const random = require('node-random');

module.exports = class pornvidsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'pornvids',
            group: 'nsfw',
            aliases: ['porn', 'nsfwvids'],
            memberName: 'pornvids',
            description: 'Search porn videos',
            examples: ['pornvids {pornography query}', 'pornvids babe'],
            guildOnly: false,

            args: [{
                key: 'pornInput',
                prompt: 'What pornography do you want to find?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var searchUnit = new pornsearch(args.pornInput)

        searchUnit.videos()
            .then((videos) => {
                random.integers({
                    number: 1,
                    minimum: 0,
                    maximum: videos.length - 1
                }, async function (error, data) {
                    if (error) {
                        console.error(error);
                        return msg.reply('An error occured while drawing a random number. Check your error log.');
                    }
                    const pornEmbed = new Discord.RichEmbed();
                    pornEmbed
                        .setURL(videos[data].url)
                        .setTitle(videos[data].title)
                        .setImage(videos[data].thumb)
                        .setColor('#F780B8')
                        .addField('Porn video URL', `[Click Here](${videos[data].url})`, true)
                        .addField('Porn video duration', videos[data].duration == !'' ? videos[data].url : 'unknown', true);
                    await msg.embed(pornEmbed, videos[data].url)
                });
            });
    }
};