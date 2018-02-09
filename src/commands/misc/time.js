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
	moment = require('moment'),
	{oneLine} = require('common-tags'),
	{deleteCommandMessages} = require('../../util.js');

module.exports = class timeCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'time',
			'memberName': 'time',
			'group': 'misc',
			'aliases': ['curtime', 'currenttime', 'currentime'],
			'description': 'Gets the current time in your timezone or UTC if you didn\'t set that up with with the timezone command',
			'details': 'Be sure to use the timezone command if you want it to output the time in your own timezone!',
			'examples': ['time'],
			'guildOnly': false
		});
	}

	run (msg) {
		let utcHours = moment.utc().get('hours');

		utcHours += this.client.provider.get('global', 'timezone', 0);

		deleteCommandMessages(msg, this.client);

		/* eslint-disable newline-per-chained-call */
		return msg.say(oneLine `
            :clock${moment.utc().set('hours', utcHours).format('hh') < 10 ? `${moment.utc().set('hours', utcHours).format('hh').slice(1)}` : moment.utc().set('hours', utcHours).format('hh')}:
            Current time for **${msg.guild ? msg.member.displayName : this.client.user.name}** is 
            ${moment.utc().set('hours', utcHours).format('`HH:mm` (`hh:mm A`)')}`);
	}
};