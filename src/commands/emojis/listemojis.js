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
	{
		deleteCommandMessages,
		momentFormat
	} = require('../../util.js');

module.exports = class listEmojisCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'listemojis',
			'memberName': 'listemojis',
			'group': 'emojis',
			'aliases': ['listemo', 'emolist', 'listemoji', 'emotes'],
			'description': 'Gets all available custom emojis from a server',
			'format': 'ServerID|ServerName(partial or full)',
			'examples': ['emojis Favna\'s Selfbot'],
			'guildOnly': false,
			'args': [
				{
					'key': 'server',
					'prompt': 'What server would you like the emojis from?',
					'type': 'guild',
					'default': 'current'
				}
			]
		});
	}

	run (msg, args) {
		const embed = new Discord.MessageEmbed(),
			server = args.server === 'current' ? msg.guild : args.server;

		let animEmotes = [],
			staticEmotes = [];

		server.emojis.forEach((e) => {
			e.animated ? animEmotes.push(`<a:${e.name}:${e.id}>`) : staticEmotes.push(`<:${e.name}:${e.id}>`);
		});

		embed
			.setColor(msg.guild ? msg.member.displayHexColor : '#FF0000')
			.setAuthor(`${staticEmotes.length + animEmotes.length} ${server.name} Emotes`, server.iconURL({'format': 'png'}))
			.setFooter(`Emotes list from ${momentFormat(new Date(), this.client)}`);

		staticEmotes = staticEmotes.length !== 0 ? `__**${staticEmotes.length} Static Emotes**__\n${staticEmotes.join('')}` : '';
		animEmotes = animEmotes.length !== 0 ? `\n\n__**${animEmotes.length} Animated Emotes**__\n${animEmotes.join('')}` : '';

		embed.setDescription(staticEmotes + animEmotes);

		deleteCommandMessages(msg, this.client);

		return msg.channel.send(embed);
	}
};