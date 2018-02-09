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

module.exports = class coppersCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'coppers',
			'memberName': 'coppers',
			'group': 'fun',
			'aliases': ['police', 'cops'],
			'description': 'Sends a "Police you are surrounded" message',
			'examples': ['coppers'],
			'guildOnly': false
		});
	}

	run (msg) {

		deleteCommandMessages(msg, this.client);

		if (this.client.user.premium) {
			return msg.say(oneLine `<:police:346089253572313088> :oncoming_police_car: :rotating_light: :rotating_light: 
			WEE WOO WEE WOO - PUT YOUR HANDS IN THE AIR, YOU ARE SURROUNDED
			 :rotating_light: :rotating_light: :oncoming_police_car: <:police:346089253572313088>`);
		}

		return msg.say(oneLine `:oncoming_police_car: :rotating_light: :rotating_light: 
		WEE WOO WEE WOO - PUT YOUR HANDS IN THE AIR, YOU ARE SURROUNDED
		 :rotating_light: :rotating_light: :oncoming_police_car:`);
	}
};