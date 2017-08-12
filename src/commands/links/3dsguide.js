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

module.exports = class threeDSguideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '3dsguide',
            aliases: ['plaiguide'],
            group: 'links',
            memberName: '3dsguide',
            description: 'A link to plailect\'s Nintendo 3DS Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let plaiGuideEmbed = new Discord.RichEmbed();
        plaiGuideEmbed
            .setColor("#FF0000")
            .setTitle("A one stop guide for (New) Nintendo 3DS (XL) / (New) Nintendo 2DS (XL)")
            .setDescription("Want to get Custom Firmware on your Nintendo 3DS? Need instructions on how to set up Boot9Strap, Luma3DS and other homebrew? Follow this guide")
            .addField("\u200b", "https://3ds.guide")
            .setThumbnail("https://favna.s-ul.eu/d0bn8E0M.png")
        await msg.embed(plaiGuideEmbed, 'https://3ds.guide')
    };
};