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
	scalc = require('scalc');

module.exports = class mathCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'math',
			'aliases': ['calc'],
			'group': 'misc',
			'memberName': 'math',
			'description': 'Calculate anything',
			'examples': ['math {equation to solve}', 'math -10 - abs(-3) + 2^5'],
			'guildOnly': false,

			'args': [
				{
					'key': 'equation',
					'prompt': 'What is the equation to solve?',
					'type': 'string',
					'label': 'Equation to calculate'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	run (msg, args) {
		const mathEmbed = new Discord.MessageEmbed(); // eslint-disable-line one-var

		mathEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.addField('Equation', args.equation.toString(), false)
			.addField('Result', scalc(args.equation), false);

		this.deleteCommandMessages(msg);

		return msg.embed(mathEmbed);
	}
};