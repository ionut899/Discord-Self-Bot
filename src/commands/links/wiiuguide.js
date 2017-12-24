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
	commando = require('discord.js-commando');

module.exports = class wiiUGuideCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'wiiuguide',
			'aliases': ['rednand', 'mocha'],
			'group': 'links',
			'memberName': 'wiiuguide',
			'description': 'A link to plailect\'s Nintendo WiiU Guide',
			'guildOnly': false
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	run (msg) {
		const wiiuGuideEmbed = new Discord.MessageEmbed();

		wiiuGuideEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setTitle('A one stop guide for Wii U')
			.setDescription('Want to run game backups on your WiiU? Need instructions on how to set up Haxchi, Mocha and RedNAND? Follow this guide')
			.addField('\u200b', 'https://wiiu.guide')
			.setThumbnail('https://favna.s-ul.eu/dy0mg0XC.png');

		this.deleteCommandMessages(msg);

		return msg.embed(wiiuGuideEmbed, 'https://wiiu.guide');
	}
};