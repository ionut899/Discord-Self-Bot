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

module.exports = class pspGuideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'pspguide',
            aliases: ['psp'],
            group: 'links',
            memberName: 'pspguide',
            description: 'A link to the hackinformer PSP Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let pspGuideEmbed = new Discord.RichEmbed();
        pspGuideEmbed
            .setColor("#FF0000")
            .setTitle("A one stop guide for PSP")
            .setDescription("Want to get Custom Firmware on your PSP? Need instructions on how to set up ProCFW? Follow this guide")
            .addField("\u200b", "https://psp.guide")
            .setThumbnail("https://silento.s-ul.eu/YlvnMCOl")
        await msg.embed(pspGuideEmbed, 'https://psp.guide')
    };
};
