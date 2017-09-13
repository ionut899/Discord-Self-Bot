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
const YouTube = require('youtube-node');
const moment = require('moment');
const auth = require('../../auth.json');
const youtube = new YouTube();
youtube.setKey(auth.googleapikey);
youtube.addParam('type', 'video');
youtube.addParam('relevanceLanguage', 'en');
youtube.addParam('safeSearch', 'moderate');
youtube.addParam('regionCode', 'NL');


module.exports = class youtubeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'youtube',
            group: 'search',
            aliases: ['yt', 'tube'],
            memberName: 'youtube',
            description: 'Find videos on youtube',
            examples: ['youtube {videoName}', 'youtube RWBY Volume 4'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What kind of video do you want to find?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const query = args.query

        var youtubeEmbed = new Discord.RichEmbed();
        youtubeEmbed.setColor("#ff0000");
        youtube.search(args.query, 1, async function (error, result) {
            if (error) {
                console.error(error);
                msg.say('An error occurred')
                await msg.delete(1000);
            } else {
                if (!result || !result.items || result.items.length < 1) {
                    msg.say("No Results found");
                    await msg.delete(1000);
                } else {
                    youtubeEmbed.setAuthor(`Youtube Search Result for: ${args.query}`, 'https://i.imgur.com/BPFqnxz.png');
                    youtubeEmbed.setImage(result.items[0].snippet.thumbnails.high.url);
                    youtubeEmbed.setURL(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`)
                    youtubeEmbed.addField('Title', result.items[0].snippet.title, true);
                    youtubeEmbed.addField('URL', `[Click Here](https://www.youtube.com/watch?v=${result.items[0].id.videoId})`, true)
                    youtubeEmbed.addField('Channel', `[${result.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${result.items[0].snippet.channelId})`, true);
                    youtubeEmbed.addField('Published Date', moment(result.items[0].snippet.publishedAt).format('MMMM Do YYYY'), true);
                    result.items[0].snippet.description !== '' ? youtubeEmbed.addField('Description', result.items[0].snippet.description, false) : youtubeEmbed.addField('Description', 'No description', false);

                    await msg.embed(youtubeEmbed, `https://www.youtube.com/watch?v=${result.items[0].id.videoId}`);
                }
            }
        });
    }
};