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

const Discord = require('discord.js'),
	commando = require('discord.js-commando'),
	{stripIndents} = require('common-tags'),
	{deleteCommandMessages} = require('../../util.js');

module.exports = class tvOSCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'tvos',
			'memberName': 'tvos',
			'group': 'links',
			'aliases': ['blockupdates'],
			'description': 'A link to download a tvos beta profile to block iOS updates',
			'guildOnly': false
		});
	}

	run (msg) {
		const embed = new Discord.MessageEmbed();

		embed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setTitle('OTA Blocking for iOS')
			.setDescription('If you want to block iOS OTA updates you need to install the tvOS beta profile. From the URLs below follow the one that matches your iOS version')
			.addField('iOS 9', '[click here](https://oldcat.me/web/NOOTA9.mobileconfig)')
			.addField('iOS 10', '[click here](https://github.com/TheMultiplix/OTA-BLOCKER-FOR-IOS/blob/master/NOOTA.mobileconfig?raw=true)')
			.addField('iOS 11', '[click here](https://github.com/alexd-p/noota/blob/master/NOOTA.mobileconfig?raw=true)');

		deleteCommandMessages(msg, this.client);

		return msg.embed(embed, stripIndents `iOS 9: https://oldcat.me/web/NOOTA9.mobileconfig
		iOS 10: https://github.com/TheMultiplix/OTA-BLOCKER-FOR-IOS/blob/master/NOOTA.mobileconfig?raw=true
		iOS 11: https://github.com/alexd-p/noota/blob/master/NOOTA.mobileconfig?raw=true`);
	}
};