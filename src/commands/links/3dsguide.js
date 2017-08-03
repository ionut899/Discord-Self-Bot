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
            .setColor("#CF010E")
            .setTitle("A one stop guide for (New) Nintendo 3DS (XL)")
            .setDescription("Want to get Custom Firmware on your Nintendo 3DS? Need instructions on how to set up Arm9loaderhax, Luma3DS and other homebrew? Follow this guide")
            .addField("\u200b", "https://3ds.guide")
            .setFooter("Nintendo 3DS Guide provided by Favna's selfbot", "http://i.imgur.com/4U9oMS0.png")
            .setThumbnail("https://s-media-cache-ak0.pinimg.com/736x/6d/75/88/6d7588481517a4c959bab8e3df39c92a.jpg")
        await msg.embed(plaiGuideEmbed)
    };
};