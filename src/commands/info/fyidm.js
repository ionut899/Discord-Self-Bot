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
	moment = require('moment'),
	{stripIndents} = require('common-tags'),
	table = require('markdown-table');

module.exports = class fyidmCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'fyidm',
			'memberName': 'fyidm',
			'group': 'info',
			'aliases': ['dm', 'discmatch', 'dmatch'],
			'description': 'Returns a list of users who have the same discriminator as the input.',
			'details': 'fyidm is short for "Find your ID Mate"',
			'format': '[DiscriminatorToCheck]',
			'examples': ['fyidm 0000'],
			'guildOnly': false,
			'args': [
				{
					'key': 'discrim',
					'prompt': 'Check which discriminator',
					'type': 'string',
					'default': 'self',
					'max': 4,
					'min': 4
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
		/* eslint-disable multiline-comment-style, capitalized-comments, one-var*/

		const discrim = args.discrim === 'self' ? this.client.user.discriminator : args.discrim,
			discrimMatches = this.client.users.filter(u => u.discriminator === discrim),
			fyidmEmbed = new Discord.MessageEmbed(),
			matchTable = [['Username', 'UserID']],
			messages = [];
		let matchEntries = {};

		discrimMatches.delete(msg.author.id);
		matchEntries = discrimMatches.entries();

		fyidmEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setTitle(`Users with discriminator ${args.discrim}`)
			.setFooter(`Discriminator match checked on ${moment().format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`);

		for (let index = 0; index < discrimMatches.size; index += 1) {
			const match = matchEntries.next().value[1];

			if (discrimMatches.size <= 8) {
				fyidmEmbed
					.addField('Username', match.username, true)
					.addField('UserID', match.id, true);
			} else if (discrimMatches.size <= 25) {
				fyidmEmbed.addField('Username || UserID', `${match.username} || ${match.id}`, false);
			} else {
				matchTable.push([match.username, match.id]);
			}
		}

		if (matchTable.length === 0) {
			messages.push(await msg.embed(fyidmEmbed));
		} else {
			const splitTotal = Discord.util.splitMessage(`${table(matchTable)}`);

			for (const part in splitTotal) {
				// eslint-disable-next-line no-await-in-loop
				messages.push(await msg.say(stripIndents `\`\`\`Users with discriminator ${discrim} 
				${splitTotal[part]}\`\`\``));
			}
		}

		this.deleteCommandMessages(msg);

		return messages;
	}
};