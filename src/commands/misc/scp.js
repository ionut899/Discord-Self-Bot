// Copyright (C) 2017 Ev1l0rd
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

module.exports = class embedCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'scp',
            group: 'misc',
            memberName: 'scp',
            description: 'Get an SCP from the SCP foundation website',
            examples: ['scp 173', 'scp 000-j'],
            guildOnly: false,

            args: [{
                key: 'scparticle',
                prompt: 'Please enter the SCP you\'d like an URL for.',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
	let scpNo = args.scparticle
	msg.delete();
	let scpEmbed = new Discord.RichEmbed();

	scpEmbed
		.setTitle("SCP-"+scpNo)
		.setFooter("SCP Foundation","http://scp-wiki.wdfiles.com/local--files/component%3Atheme/logo.png")
		.setDescription("http://www.scp-wiki.net/scp-"+scpNo)

	await msg.embed(scpEmbed)
    }
};
