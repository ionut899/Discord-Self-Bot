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

const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = class quoteCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'misc',
            aliases: ['quoter', 'q'],
            memberName: 'quote',
            description: 'Quote someone else\'s message into a RichEmbed',
            examples: ['quote channel messageID exta_content'],
            guildOnly: false,

            args: [{
                    key: 'channel',
                    prompt: 'Which channel from the server?',
                    type: 'channel'
                },
                {
                    key: 'message',
                    prompt: 'And what message?',
                    type: 'string'
                },
                {
                    key: 'content',
                    prompt: 'What content would you like to send along with the quote?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {


        msg.guild.channels.get(args.channel.id)
            .fetchMessage(args.message)
            .then(quote => {

                const quoteEmbed = new Discord.RichEmbed();
                quoteEmbed
                    .setAuthor(`Quoting ${quote.member.displayName}`, quote.author.displayAvatarURL)
                    .setColor(msg.channel.type === 'text' ? quote.member.displayHexColor : '#FF0000')
                    .setFooter(`Message dates from ${moment(msg.createdAt).format('MMMM Do YYYY | HH:mm:ss')}`)
                    .addField('Message Content', quote.cleanContent, false)
                    .addField('Channel', args.channel.name, false)
                    .addField('Attachements', quote.attachments.first() !== undefined && quote.attachments.first().url !== undefined ? quote.attachments.map(qu => qu.url) : 'None', false);

                msg.embed(quoteEmbed, args.content);
                msg.delete();
            })
            .catch(err => {
                console.error(err)
                return msg.reply('Something went wrong')
            })


        // msg.client.guilds.get(args.guild.id).channels.get(args.channel)
        //     .fetchMessage(args.message)
        //     .then(quote => console.log(quote.content))
        //     .catch(err => console.error(err))
    };
};