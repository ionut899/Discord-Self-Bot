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

const commando = require('discord.js-commando');

module.exports = class jumbolettersCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'jumboletters',
			'group': 'fun',
			'aliases': ['jumbo', 'bigtext'],
			'memberName': 'jumboletters',
			'description': 'Create jumbo letters from your text',
			'examples': ['jumboletters {some text}', 'jumboletters Favna is a great coder!'],
			'guildOnly': false,

			'args': [
				{
					'key': 'text',
					'prompt': 'What text to jumbo-fy',
					'type': 'string',
					'label': 'input text'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	fetchNumberWord (num) {
		switch (num) {
			case '0':
				return 'zero';
			case '1':
				return 'one';
			case '2':
				return 'two';
			case '3':
				return 'three';
			case '4':
				return 'four';
			case '5':
				return 'five';
			case '6':
				return 'six';
			case '7':
				return 'seven';
			case '8':
				return 'eight';
			case '9':
				return 'nine';
			default:
				return '1234';
		}
	}

	run (msg, args) {
		const jumboString = [];

		for (const i in args.text) {
			if (/[a-zA-Z]/gim.test(args.text[i])) {
				jumboString.push(`:regional_indicator_${args.text[i].toLowerCase()}:`);
			} else if (/[0-9]/gim.test(args.text[i])) {
				jumboString.push(`:${this.fetchNumberWord(args.text[i])}:`);
			} else if (/!/gim.test(args.text[i])) {
				jumboString.push(':exclamation:');
			} else if (/\?/gim.test(args.text[i])) {
				jumboString.push(':question:');
			} else {
				jumboString.push(args.text[i]);
			}
		}

		this.deleteCommandMessages(msg);

		return msg.say(jumboString.join(' '));
	}
};