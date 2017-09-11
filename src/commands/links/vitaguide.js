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

module.exports = class vitaGuideEmbed extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'vitaguide',
            aliases: ['henkaku', 'molecule'],
            group: 'links',
            memberName: 'vitaguide',
            description: 'A link to a PSVita Hacking Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let vitaGuideEmbed = new Discord.RichEmbed();

        vitaGuideEmbed
            .setColor("#FF0000")
            .setTitle("A one stop guide for PSVita")
            .setDescription("Want to run game backups on your PSVita? Need instructions on how to set up Henkaku? Go here!")
            .addField("\u200b", "http://cfw.guide/vita/")
            .setThumbnail("https://silento.s-ul.eu/PIKf4IQR")
        await msg.embed(vitaGuideEmbed, 'http://cfw.guide/vita/')
    };
};
