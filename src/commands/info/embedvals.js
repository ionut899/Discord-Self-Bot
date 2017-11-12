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

module.exports = class embedValsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'embedvals',
            aliases: ['valsofembed', 'vals'],
            group: 'info',
            memberName: 'embedvals',
            description: 'Shows how a Discord MessageEmbed is build up',
            guildOnly: false
        });
    }

    async run(msg) {
        var valsOfEmbed = new Discord.MessageEmbed();
        valsOfEmbed
            .setAuthor("This is the author", "https://i.imgur.com/cgr5eSk.png")
            .setColor("#ffffff")
            .setDescription("This is the description")
            .setFooter("This is the footer", "https://i.imgur.com/kPNjOuJ.png")
            .setImage("https://i.imgur.com/l32vg3M.png")
            .setThumbnail("https://i.imgur.com/IQVvBcn.png")
            .setTimestamp()
            .setTitle("This is the title")
            .setURL("https://www.google.com")
            .addField("FieldName", "FieldValue", true);
        await msg.embed(valsOfEmbed)
    }
};