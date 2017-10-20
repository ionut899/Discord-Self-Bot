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
const moment = require('moment');

module.exports = class quoteCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'xquote',
            group: 'misc',
            aliases: ['xq'],
            memberName: 'xquote',
            description: 'Quote someone else\'s message into a RichEmbed. Allows for cross server quoting but IDs are required',
            examples: ['quote {server name or ID} {channelID} {messageID} {content you want to send along with the embed}'],
            guildOnly: false,

            args: [{
                    key: 'guild',
                    prompt: 'Which server?',
                    type: 'guild',
                    wait: 60,
                    label: 'Server Name or ID'
                },
                {
                    key: 'channel',
                    prompt: 'Which channel on that server?',
                    type: 'string',
                    wait: 60,
                    label: 'ChannelID'
                },
                {
                    key: 'message',
                    prompt: 'And what message?',
                    type: 'string',
                    wait: 60,
                    label: 'MessageID to quote'
                },
                {
                    key: 'content',
                    prompt: 'What content would you like to send along with the quote?',
                    type: 'string',
                    default: "",
                    wait: 60,
                    label: 'Content to send along with your quote'
                }
            ]
        });
    }

    async run(msg, args) {


        msg.client.guilds.get(args.guild.id).channels.get(args.channel)
            .fetchMessage(args.message)
            .then(quote => {

                const quoteEmbed = new Discord.RichEmbed();
                if (quote.member === null) {
                    quoteEmbed
                        .setAuthor(`Quoting ${quote.author.username}`, quote.author.displayAvatarURL)
                        .setColor('#FF0000')
                } else {
                    quoteEmbed
                        .setAuthor(`Quoting ${quote.member.displayName}`, quote.author.displayAvatarURL)
                        .setColor(quote.channel.type === 'text' ? quote.member.displayHexColor : '#FF0000')
                }
                quoteEmbed
                    .setFooter(`Message dates from ${moment(quote.createdAt).format('MMMM Do YYYY | HH:mm:ss')}`)
                    .setDescription(quote.cleanContent)

                let undefCheck = quote.attachments.first() !== undefined
                let extCheck = undefCheck == true ? quote.attachments.first().url.slice(-3) : null
                if (undefCheck && extCheck === 'peg' || undefCheck && extCheck === 'jpg' || undefCheck && extCheck === 'png' || undefCheck && extCheck === 'gif') {
                    quoteEmbed.setImage(quote.attachments.first().url)
                }

                msg.embed(quoteEmbed, args.content);
                msg.delete();
            })
            .catch(err => {
                console.error(err)
                return msg.reply('Something went wrong')
            })
    };
};