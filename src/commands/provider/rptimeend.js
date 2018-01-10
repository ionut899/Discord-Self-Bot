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

module.exports = class rpTimeEndCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rptimeend',
			'group': 'provider',
			'aliases': ['timeend', 'endtime', 'rptime', 'rpend'],
			'memberName': 'rptimeend',
			'description': 'Set your Rich Presence End Timestamp',
			'details': 'Make sure to enable timestamp with the `rptoggletimeend` command',
			'examples': ['rptimeend {hours}', 'rptimeend 2'],
			'guildOnly': false,

			'args': [
				{
					'key': 'time',
					'prompt': 'How many hours in the future do you want the timer to end?',
					'type': 'integer',
					'label': 'endtime',
					'validate': (time) => {
						if (time <= 24) {
							return true;
						}

						return 'Rich Presence time has to end within 24 hours';
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
		this.client.provider.set('global', 'rptimeend', args.time);

		this.deleteCommandMessages(msg);

		return msg.reply(oneLine `Your RichPresence End Timestamp has been set to \`${args.time} hour(s)\``);
	}
};