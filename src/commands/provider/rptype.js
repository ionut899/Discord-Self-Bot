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

module.exports = class rptypeCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rptype',
			'memberName': 'rptype',
			'group': 'provider',
			'aliases': ['rtyp'],
			'description': 'Set your Rich Presence Type',
			'format': 'playing|watching|listening|streaming',
			'examples': ['rptype PLAYING'],
			'guildOnly': false,
			'args': [
				{
					'key': 'type',
					'prompt': 'What is the Type you want for your Rich Presence?',
					'type': 'string',
					'label': 'typeID',
					'validate': (type) => {
						const validTypes = ['playing', 'watching', 'listening', 'streaming'];

						if (validTypes.includes(type.toLowerCase())) {
							return true;
						}

						return `Has to be one of ${validTypes.join(', ')}`;
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
		this.client.provider.set('global', 'rptype', args.type.toUpperCase());

		this.deleteCommandMessages(msg);

		return msg.reply(oneLine `Your RichPresence Type has been set to \`${args.type}\``);
	}
};