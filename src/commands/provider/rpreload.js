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

module.exports = class rpreloadCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rpreload',
			'group': 'provider',
			'aliases': ['setpresence', 'setrp', 'rpset'],
			'memberName': 'rpreload',
			'description': 'Reload your RichPresence data',
			'examples': ['rpreload'],
			'guildOnly': false
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	run (msg) {
		if (!this.client.provider.get('global', 'rptoggle', false)) {
			this.client.user.setPresence({
				'activity': {
					'name': this.client.provider.get('global', 'rptoggle', 'Discord-Self-Bot'),
					'type': this.client.provider.get('global', 'rptoggle', 'PLAYING'),
					'url': this.client.provider.get('global', 'rptoggle', null)
				}
			});
		} else {
			this.client.user.setPresence({
				'activity': {
					'application': this.client.provider.get('global', 'rpappid', '355326429178757131'),
					'name': this.client.provider.get('global', 'rpname', 'Discord-Self-Bot'),
					'type': this.client.provider.get('global', 'rptype', 'WATCHING'),
					'url': this.client.provider.get('global', 'rpurl', null),
					'details': this.client.provider.get('global', 'rpdetails', 'Made by Favna'),
					'state': this.client.provider.get('global', 'rpstate', 'https://selfbot.favna.xyz'),
					'timestamps': {'start': this.client.provider.get('global', 'rptimestamptoggle', false) ? Math.floor(Date.now() / 1000) : null},
					'assets': {
						'largeImage': this.client.provider.get('global', 'rplargeimage', '379734851206512640'),
						'smallImage': this.client.provider.get('global', 'rpsmallimage', '379734813751377921'),
						'largeText': this.client.provider.get('global', 'rplargetext', 'See the Website'),
						'smallText': this.client.provider.get('global', 'rpsmalltext', 'Or the GitHub')
					},
					'party': this.client.provider.get('global', 'rppartysize', [0, 0])[0] !== 0
						? {'size': [this.client.provider.get('global', 'rppartysize')[0], this.client.provider.get('global', 'rppartysize')[1]]}
						: null
				}
			});
		}

		return msg.reply('Your Rich Presence has been set! Please remember that you cannot see it on your own account (exception: Android mobile app allows this).');
	}
};