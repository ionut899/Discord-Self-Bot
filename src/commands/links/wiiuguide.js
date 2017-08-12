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
            .setColor("#FF0000")
            .setTitle("A one stop guide for Wii U")
            .setDescription("Want to run game backups on your WiiU? Need instructions on how to set up Haxchi, Mocha and RedNAND? Follow this guide")
            .addField("\u200b", "https://wiiu.guide")
            .setThumbnail("https://favna.s-ul.eu/dy0mg0XC.png")
        await msg.embed(wiiuguideEmbed, 'https://wiiu.guide')
    };
};