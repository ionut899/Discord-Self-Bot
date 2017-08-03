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

module.exports = class multiSenderCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'multi',
            group: 'misc',
            aliases: ['sender'],
            memberName: 'multisender',
            description: 'Send a message to multiple servers',
            examples: ['multi 123 This is my message', 'sender 12 this is my message'],
            guildOnly: false,

            args: [{
                    key: 'servers',
                    prompt: 'To what servers should we send the message (1 for Sky Tower, 2 for Populous Gaming and 3 for ChaosGamez)',
                    type: 'string'
                },
                {
                    key: 'body',
                    prompt: 'Content of the message to send?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        let servers = args.servers.split('');
        let multiMessage = args.body

        for (let index in servers) {
            multiMessage.slice(0, 4) !== 'http' ? multiMessage = `${args.body.slice(0,1).toUpperCase()}${args.body.slice(1)}` : null
            msg.attachments.first() !== undefined && msg.attachments.first().url !== undefined ? multiMessage += `\n${msg.attachments.first().url}` : null
            switch (servers[index]) {
                case '1':
                    msg.client.channels.get('199537212348432384').send(multiMessage);
                    break;
                case '2':
                    msg.client.channels.get('152464629753315328').send(multiMessage);
                    break;
                case '3':
                    msg.client.channels.get('210739929758695425').send(multiMessage);
                    break;
                default:
                    return;
            }
        }
    };
};