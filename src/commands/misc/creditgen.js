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
	cheerio = require('cheerio'),
	commando = require('discord.js-commando'),
	imgur = require('imgur'),
	moment = require('moment'),
	{oneLine} = require('common-tags'),
	request = require('snekfetch');

module.exports = class creditgenCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'creditgen',
			'aliases': ['cg'],
			'group': 'misc',
			'memberName': 'creditgen',
			'description': 'Generate a valid credit card number for those pesky sites that ask for one',
			'examples': ['creditgen'],
			'guildOnly': false
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	async run (msg) {
		const embed = new Discord.MessageEmbed(),
			creditinfo = await request.get('http://credit-card-generator.2-ee.com/q_working-credit-card-number-generator.htm'), // eslint-disable-line sort-vars
			$ = cheerio.load(creditinfo.body), // eslint-disable-line sort-vars
			image = await imgur.uploadUrl(`http://credit-card-generator.2-ee.com/${$('#votes > div.grid_4.alpha > img').attr('src')}`),
			info = $('#votes > div.grid_4.omega > p').text()
				.replace(/^\s+/mg, '');

		embed
			.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({'format': 'png'}))
			.setURL('http://credit-card-generator.2-ee.com/q_working-credit-card-number-generator.htm')
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setDescription(info)
			.setImage(image.data.link)
			.setFooter(oneLine `${moment().format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`);

		this.deleteCommandMessages(msg);

		return msg.embed(embed);
	}
};