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
const pornsearch = require('pornsearch');
const random = require('node-random');

module.exports = class porngifsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'porngifs',
            group: 'nsfw',
            aliases: ['gifs', 'nsfwgifs'],
            memberName: 'porngifs',
            description: 'Search porn gifs',
            examples: ['porngifs {pornograpgy query}', 'porngifs babe'],
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

        searchUnit.gifs()
            .then((gifs) => {
                random.integers({
                    number: 1,
                    minimum: 0,
                    maximum: gifs.length - 1
                }, async function (error, data) {
                    if (error) {
                        console.error(error);
                        return msg.reply('An error occured while drawing a random number. Check your error log.');
                    }

                    const pornEmbed = new Discord.RichEmbed();
                    pornEmbed
                        .setURL(gifs[data].url)
                        .setTitle(gifs[data].title)
                        .setImage(gifs[data].url)
                        .setColor('#F780B8')
                        .addField('Gif webm', `[Click Here](${gifs[data].webm})`, true)
                    await msg.embed(pornEmbed, gifs[data].webm)
                });
            });
    }
};