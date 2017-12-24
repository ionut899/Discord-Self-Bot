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

const commando = require('discord.js-commando'),
	{oneLine} = require('common-tags');

module.exports = class rplargetextCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rplargetext',
			'group': 'provider',
			'aliases': ['largetext', 'ltext'],
			'memberName': 'rplargetext',
			'description': 'Set your Rich Presence largetext',
			'examples': ['rplargetext {largetext}', 'rplargetext See the website'],
			'guildOnly': false,

			'args': [
				{
					'key': 'largetext',
					'prompt': 'What is the largetext string for your richpresence?',
					'type': 'string',
					'label': 'largetext',
					'validate': (largetext) => {
						if (Buffer.byteLength(largetext, 'utf8') <= 128) {
							return true;
						}

						return 'The largetext string cannot be longer than 128 bytes';
					}
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
		this.client.provider.set('global', 'rplargetext', args.largetext);

		this.deleteCommandMessages(msg);

		return msg.reply(oneLine `Your RichPresence LargeText has been set to \`${args.largetext}\``);
	}
};