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

module.exports = class rptoggletimeendCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rptoggletimeend',
			'memberName': 'rptoggletimeend',
			'group': 'provider',
			'aliases': ['rptoggleend', 'toggleend', 'tte'],
			'description': 'Toggle ending timestamp on or off',
			'format': 'enable|disable',
			'examples': ['rptoggletimeend enable'],
			'guildOnly': false,
			'args': [
				{
					'key': 'option',
					'prompt': 'Enable or disable ending timestamps?',
					'type': 'boolean',
					'label': 'Option for toggling',
					'validate': (bool) => {
						const validBools = ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+', 'false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-'];

						if (validBools.includes(bool.toLowerCase())) {
							return true;
						}

						return `Has to be one of ${validBools.join(', ')}`;
					}
				}
			]
		});
	}

	run (msg, args) {
		this.client.provider.set('global', 'rptoggletimeend', args.option);

		deleteCommandMessages(msg, this.client);

		return msg.reply(oneLine `Ending timestamps are now ${args.option 
			? `enabled Run ${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rptimeend set your ending timestamp` 
			: 'disabled'}.`);
	}
};