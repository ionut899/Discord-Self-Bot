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

module.exports = class vitaGuideCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'vitaguide',
			'aliases': ['henkaku', 'molecule'],
			'group': 'links',
			'memberName': 'vitaguide',
			'description': 'A link to a PSVita Hacking Guide',
			'guildOnly': false
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	run (msg) {
		const vitaGuideEmbed = new Discord.MessageEmbed();

		vitaGuideEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setTitle('A one stop guide for PSVita')
			.setDescription('Want to run game backups on your PSVita? Need instructions on how to set up Henkaku? Go here!')
			.addField('\u200b', 'http://cfw.guide/vita/')
			.setThumbnail('https://silento.s-ul.eu/PIKf4IQR');

		this.deleteCommandMessages(msg);

		return msg.embed(vitaGuideEmbed, 'http://cfw.guide/vita/');
	}
};