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

module.exports = class lmgtfyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'lmgtfy',
            group: 'search',
            aliases: ['dumb'],
            memberName: 'lmgtfy',
            description: 'Produce a lmgtfy (let me google that for you) URL',
            examples: ['lmgtfy {query}', 'lmgtfy is it legal to kill an ant???', 'lmgtfy are there birds in canada?'],
            guildOnly: false,

            args: [{
                key: 'question',
                prompt: 'What does the idiot want to find?',
                type: 'string',
                label: 'Search query to lmgtfy'
            }]
        });
    }

    async run(msg, args) {
        msg.say(`https://lmgtfy.com/?q=${replaceAll(args.question,/ /,'+')}`)
    }
};

function replaceAll(string, pattern, replacement) {
    return string.replace(new RegExp(pattern, "g"), replacement);
}