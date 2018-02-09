/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const Discord = require('discord.js'),
	commando = require('discord.js-commando'),
	{deleteCommandMessages} = require('../../util.js');

module.exports = class embedValsCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'embedvals',
			'memberName': 'embedvals',
			'group': 'info',
			'aliases': ['valsofembed', 'vals'],
			'description': 'Shows how a Discord MessageEmbed is build up',
			'guildOnly': false
		});
	}

	run (msg) {
		const valsOfEmbed = new Discord.MessageEmbed();

		valsOfEmbed
			.setAuthor('This is the author', 'https://i.imgur.com/cgr5eSk.png')
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setDescription('This is the description')
			.setFooter('This is the footer', 'https://i.imgur.com/kPNjOuJ.png')
			.setImage('https://i.imgur.com/l32vg3M.png')
			.setThumbnail('https://i.imgur.com/IQVvBcn.png')
			.setTimestamp()
			.setTitle('This is the title')
			.setURL('https://www.google.com')
			.addField('FieldName', 'FieldValue', true);

		deleteCommandMessages(msg, this.client);

		return msg.embed(valsOfEmbed);
	}
};