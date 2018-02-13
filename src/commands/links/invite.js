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

module.exports = class inviteCommnad extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'invite',
			'memberName': 'invite',
			'group': 'links',
			'aliases': ['inv', 'shill', 'plug', 'links'],
			'description': 'Link to Favna\'s discord-self-bot',
			'examples': ['invite'],
			'guildOnly': false
		});
	}

	run (msg) {
		const shillEmbed = new Discord.MessageEmbed();

		shillEmbed
			.setTitle('Discord-Self-Bot by Favna')
			.setDescription('Empower your Discord experience with a fully modular and expansive set of commands')
			.setThumbnail('https://favna.xyz/images/appIcons/selfbot.png')
			.setURL('https://favna.xyz/selfbot')
			.addField('​', '[Website](https://favna.xyz/selfbot) | [GitHub](https://github.com/Favna/Discord-Self-Bot) | [Wiki](https://github.com/Favna/Discord-Self-Bot/wiki)');

		deleteCommandMessages(msg, this.client);

		return msg.embed(shillEmbed, 'Find information on the bot here https://favna.xyz/selfbot');
	}
};