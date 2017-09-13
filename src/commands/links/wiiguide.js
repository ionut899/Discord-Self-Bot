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

module.exports = class wiiGuideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'wiiguide',
            aliases: ['cios', 'letterbomb'],
            group: 'links',
            memberName: 'wiiguide',
            description: 'A link to plailect\'s Nintendo Wii Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let wiiGuideEmbed = new Discord.RichEmbed();

        wiiGuideEmbed
            .setColor("#FF0000")
            .setTitle("A one stop guide for Wii")
            .setDescription("Want to run game backups on your Wii? Need instructions on how to set up Priiloader, Homebrew Launcher and cios? Follow this guide")
            .addField("\u200b", "https://wii.guide")
            .setThumbnail("https://silento.s-ul.eu/g9QiwTgG")
        await msg.embed(wiiGuideEmbed, 'https://wii.guide')
    };
};
