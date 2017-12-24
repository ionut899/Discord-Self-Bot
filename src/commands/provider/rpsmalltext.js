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

module.exports = class rpsmalltextCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rpsmalltext',
			'group': 'provider',
			'aliases': ['smalltext', 'smalltext'],
			'memberName': 'rpsmalltext',
			'description': 'Set your Rich Presence smalltext',
			'examples': ['rpsmalltext {smalltext}', 'rpsmalltext Or the GitHub'],
			'guildOnly': false,

			'args': [
				{
					'key': 'smalltext',
					'prompt': 'What is the smalltext string for your richpresence?',
					'type': 'string',
					'label': 'smalltext',
					'validate': (smalltext) => {
						if (Buffer.byteLength(smalltext, 'utf8') <= 128) {
							return true;
						}

						return 'The smalltext string cannot be longer than 128 bytes';
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
		this.client.provider.set('global', 'rpsmalltext', args.smalltext);

		this.deleteCommandMessages(msg);

		return msg.reply(oneLine `Your RichPresence SmallText has been set to \`${args.smalltext}\``);
	}
};