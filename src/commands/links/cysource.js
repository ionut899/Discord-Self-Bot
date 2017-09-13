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
const Discord = require("discord.js");

module.exports = class cydiaSourceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cysource',
            aliases: ['cysrc', 'source'],
            group: 'links',
            memberName: 'cysource',
            description: 'Gets the link to a cydia source using the Cydia Share URL API',
            examples: ['cysource {repo_url}', 'cypkg http://apt.thebigboss.org/repofiles/cydia/'],
            guildOnly: false,

            args: [{
                key: 'repo',
                prompt: 'What is the repo URL?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let sourceURL = args.repo;
        await msg.say(`To add this repo directly to cydia click the following URL: https://cydia.saurik.com/api/share#?source=${sourceURL}`);
    }

};