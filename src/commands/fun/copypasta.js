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
const Matcher = require('did-you-mean');
const path = require('path');
const fs = require('fs');
var match = new Matcher();

module.exports = class copypastaCommand extends commando.Command {
        constructor(client) {
            super(client, {
                name: 'copypasta',
                aliases: ['cp', 'pasta'],
                group: 'fun',
                memberName: 'copypasta',
                description: 'Sends contents of a copypasta file to the chat',
                examples: ['copypasta <file_name>', 'copypasta navy'],
                guildOnly: false,

                args: [{
                    key: 'name',
                    prompt: 'Send which copypasta?',
                    type: 'string',
                    label: 'Name of the file that has your copypasta content'
                }]
            });
        }

        run(msg, args) {
            match.values = fs.readdirSync(path.join(__dirname, 'pastas'));

                fs.readFile(path.join(__dirname, `pastas/${args.name}.txt`), (err, data) => {
                    if (!err) {
                        if (data.length <= 1024) {
                            const cpEmbed = new MessageEmbed();
                            cpEmbed.setDescription(data)
                            return msg.embed(cpEmbed);
                        };

                        return msg.say(data, {
                            split: true
                        });
                    }
                    let dym = match.get(`${args.name}.txt`),
                        dymString = dym !== null ? `Did you mean \`${dym}\`?` : 'You can save it with `$copypastaadd <filename> <content>` or verify the file name manually';
                    msg.reply(`⚠ That copypata does not exist! ${dymString}`);
                });
            };
        };