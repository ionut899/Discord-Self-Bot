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
	{deleteCommandMessages} = require('../../util.js');

module.exports = class timeformatCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'timeformat',
			'memberName': 'timeformat',
			'group': 'provider',
			'aliases': ['tf', 'tformat'],
			'description': 'Configure whether you want 12 hour or 24 hour formatted timestamps where applicable',
			'format': '12|24',
			'examples': ['timeformat 12'],
			'guildOnly': false,
			'args': [
				{
					'key': 'format',
					'prompt': 'Would you like your timestamps to be formatted as 12 or 24 hours?',
					'type': 'string',
					'validate': (time) => {
						if (time === '12' || time === '24') {
							return true;
						}

						return 'You have to give either `12` or `24` as argument';
					}
				}
			]
		});
	}

	run (msg, args) {
		this.client.provider.set('global', 'timeformat', args.format);

		deleteCommandMessages(msg, this.client);

		return msg.reply(`Your timestamps will now appear in \`${args.format} hour\` format`);
	}
};