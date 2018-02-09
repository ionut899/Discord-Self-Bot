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

module.exports = class timezoneCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'timezone',
			'memberName': 'timezone',
			'group': 'provider',
			'aliases': ['tz', 'tzone'],
			'description': 'Set your timezone in UTC offset',
			'format': '[-]UTCOffset',
			'examples': ['timezone 6'],
			'guildOnly': false,
			'args': [
				{
					'key': 'zone',
					'prompt': 'What is your timezone\'s UTC offset?',
					'type': 'integer',
					'validate': (time) => {
						if (time > -12 && time < 12) {
							return true;
						}

						return 'Time has to be between -12 and 12';
					}
				}
			]
		});
	}

	run (msg, args) {
		this.client.provider.set('global', 'timezone', args.zone);

		deleteCommandMessages(msg, this.client);

		return msg.reply(oneLine `Your timezone has been set to \`${args.zone < 0 ? `UTC ${args.zone}` : `UTC +${args.zone}`}\`.
        You can now use the \'${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}time\' command with your timezone`);
	}
};