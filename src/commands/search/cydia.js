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
const moment = require('moment');
const cydia = require('cydia-api-node');

module.exports = class cydiaCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cydia',
            group: 'search',
            aliases: ['cy'],
            memberName: 'cydia',
            description: 'Find cydia tweak info',
            examples: ['cydia anemone', 'cy anemone'],
            guildOnly: false,

            args: [{
                key: 'packageName',
                prompt: 'Please supply package name',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let cydiaEmbed = new Discord.RichEmbed();

        cydiaEmbed
            .setColor("#5D2E1F")
            .setAuthor("Tweak Info", "http://i.imgur.com/OPZfdht.png")

        cydia.getAllInfo(args.packageName).then((res) => {
            if (res === false) {
                return msg.say(`**Tweak/Theme \`${args.packageName}\` not found!**`);
            }
            let pkgPrice = res.price === 0 ? "Free" : res.price;

            cydiaEmbed
                .addField("Display Name", res.display, true)
                .addField("Package Name", res.name, true)
                .addField("Description", res.summary, true)
                .addField("Version", res.version, true)
                .addField("Section", res.section, true)
                .addField("Price", pkgPrice, true)
                .addField("Link", `[Click Here](http://cydia.saurik.com/package/${res.name})`, true)
                .addField("Repo", `[${res.repo.name}](https://cydia.saurik.com/api/share#?source=${res.repo.link})`, true)

            msg.embed(cydiaEmbed);
        });
    };
};