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

module.exports = class dsiGuideCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dsiguide',
            aliases: ['dsi'],
            group: 'links',
            memberName: 'dsiguide',
            description: 'A link to a Nintendo DSi Guide',
            guildOnly: false
        });
    }

    async run(msg) {
        let dsiGuideEmbed = new Discord.RichEmbed();

        dsiGuideEmbed
            .setColor("#FF0000")
            .setTitle("A one stop guide for DSI")
            .setDescription("Want to do a thing on your DSI? Need instructions on how to set up DSI hacks? Follow this guide")
            .addField("\u200b", "http://cfw.guide/dsi/")
            .setThumbnail("https://silento.s-ul.eu/1RKVHclC")
        await msg.embed(dsiGuideEmbed, 'http://cfw.guide/dsi/')
    };
};
