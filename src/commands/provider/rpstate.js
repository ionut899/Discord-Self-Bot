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
	{oneLine} = require('common-tags'),
	{deleteCommandMessages} = require('../../util.js');

module.exports = class rpstateCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rpstate',
			'memberName': 'rpstate',
			'group': 'provider',
			'aliases': ['state'],
			'description': 'Set your Rich Presence state',
			'format': 'StateText',
			'examples': ['rpstate https://favna.xyz/selfbot'],
			'guildOnly': false,
			'args': [
				{
					'key': 'state',
					'prompt': 'What is the state string for your richpresence?',
					'type': 'string',
					'label': 'state',
					'validate': (state) => {
						if (Buffer.byteLength(state, 'utf8') <= 128) {
							return true;
						}

						return 'The state string cannot be longer than 128 bytes';
					}
				}
			]
		});
	}

	run (msg, args) {
		this.client.provider.set('global', 'rpstate', args.state);

		deleteCommandMessages(msg, this.client);

		return msg.reply(oneLine `Your RichPresence State has been set to \`${args.state}\``);
	}
};