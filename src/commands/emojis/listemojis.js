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
	{deleteCommandMessages, momentFormat} = require('../../util.js');
	
module.exports = class listEmojisCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'listemojis',
			'memberName': 'listemojis',
			'group': 'emojis',
			'aliases': ['listemo', 'emolist', 'listemoji'],
			'description': 'Gets all available custom emojis from a server',
			'format': 'ServerID|ServerName(partial or full)',
			'examples': ['emojis Favna\'s Selfbot'],
			'guildOnly': false,
			'args': [
				{
					'key': 'server',
					'prompt': 'What server would you like the emojis from?',
					'type': 'guild'
				}
			]
		});
	}

	run (msg, args) {
		const emojisEmbed = new Discord.MessageEmbed(),
			emojisFirst = [],
			emojisSecond = [],
			emojisThird = [],
			guildMojiNames = args.server.emojis.map(gmoji => gmoji.name);

		for (let index = 0; index < guildMojiNames.length; index += 1) {
			if (emojisFirst.toString().length <= 900) {
				emojisFirst.push(`\`:${guildMojiNames[index]}:\` for ${args.server.emojis.find('name', guildMojiNames[index])}`);
			} else if (emojisSecond.toString().length <= 900) {
				emojisSecond.push(`\`:${guildMojiNames[index]}:\` for ${args.server.emojis.find('name', guildMojiNames[index])}`);
			} else {
				emojisThird.push(`\`:${guildMojiNames[index]}:\` for ${args.server.emojis.find('name', guildMojiNames[index])}`);
			}
		}

		emojisEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setFooter(`Command issued at ${momentFormat(new Date(), this.client)}`)
			.setDescription(`Emojis from the server \`${args.server.name}\``);
		emojisFirst.length !== 0 ? emojisEmbed.addField('\u200b', emojisFirst, true) : emojisEmbed.addField('This server has no custom emojis', 'Although they should totally get some', true); // eslint-disable-line max-len
		emojisSecond.length !== 0 ? emojisEmbed.addField('\u200b', emojisSecond, true) : null;
		emojisThird.length !== 0 ? emojisEmbed.addField('\u200b', emojisThird, true) : null;

		deleteCommandMessages(msg, this.client);

		return msg.embed(emojisEmbed);
	}
};