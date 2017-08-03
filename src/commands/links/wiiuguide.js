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
const Discord = require("discord.js");

module.exports = class wiiUGuideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'wiiuguide',
            aliases: ['rednand', 'mocha'],
            group: 'links',
            memberName: 'wiiuguide',
            description: 'A link to plailect\'s Nintendo WiiU Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let wiiuguideEmbed = new Discord.RichEmbed();

        wiiuguideEmbed
            .setColor("#00ACCA")
            .setTitle("A one stop guide for Wii U")
            .setDescription("Want to run game backups on your WiiU? Need instructions on how to set up haxchi, mocha and rednand? Follow this guide")
            .addField("\u200b", "https://wiiu.guide")
            .setFooter("Nintendo WiiU Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png")
            .setThumbnail("http://i68.tinypic.com/2zizozn.png")
        await msg.embed(wiiuguideEmbed)
    };
};