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
	request = require('snekfetch');

module.exports = class scpCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'scp',
			'group': 'search',
			'memberName': 'scp',
			'description': 'Get an SCP from the SCP foundation website',
			'examples': ['scp {article-id}', 'scp 173'],
			'guildOnly': false,

			'args': [
				{
					'key': 'scparticle',
					'prompt': 'Please enter the SCP you\'d like an URL for.',
					'type': 'string',
					'label': 'Search query'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	async run (msg, args) {
		try {
			const scpEmbed = new Discord.MessageEmbed(),
				scpRes = await request.get(`http://www.scp-wiki.net/scp-${args.scparticle}`);

			if (scpRes) {
				const $ = cheerio.load(scpRes.text);

				scpEmbed
					.setTitle(`SCP-${args.scparticle}`)
					.setFooter('SCP Foundation', 'https://ev1l0rd.s-ul.eu/uVu89Guq')
					.setURL(`http://www.scp-wiki.net/scp-${args.scparticle}`)
					.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
					.addField('Object Class', $('strong:contains("Object Class:")').parent()
						.text()
						.slice(14), false)
					.addField('Special Containment Procedures', `${$('strong:contains("Special Containment Procedures:")').parent()
						.text()
						.slice(32, 332)}... `, false)
					.addField('Description', `${$('strong:contains("Description:")').parent()
						.text()
						.slice(13, 313)}... [Read more](http://www.scp-wiki.net/scp-${args.scparticle})`, false);

				this.deleteCommandMessages(msg);

				return msg.embed(scpEmbed, `http://www.scp-wiki.net/scp-${args.scparticle}`);
			}
		} catch (err) {
			return msg.reply('⚠️ ***nothing found***');
		}
		
		return msg.reply('⚠️ ***nothing found***');
	}
};