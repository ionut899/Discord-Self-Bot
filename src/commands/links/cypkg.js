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

module.exports = class cydiaPackageCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cypkg',
            aliases: ['pkg'],
            group: 'links',
            memberName: 'cypkg',
            description: 'Gets the link to a cydia package using the Cydia Share URL API',
            examples: ['cypkg {repo_url} {package_name}', 'cypkg http://apt.thebigboss.org/repofiles/cydia/ com.anemonetheming.anemone'],
            guildOnly: false,

            args: [{
                    key: 'repo',
                    prompt: 'What is the repo URL?',
                    type: 'string',
                    label: 'URL of the repo'
                },
                {
                    key: 'package',
                    prompt: 'And what is the package name?',
                    type: 'string',
                    label: 'PackageName of the package'
                }
            ]
        });
    }

    async run(msg, args) {
        const sourceURL = args.repo;
        const packageName = args.package;
        await msg.say(`To find this package on Cydia follow this URL: https://cydia.saurik.com/api/share#?source=${sourceURL}/&package=${packageName}`);
    };
};