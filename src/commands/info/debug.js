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
	commando = require('discord.js-commando');

module.exports = class debugCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'debug',
			'memberName': 'debug',
			'group': 'info',
			'aliases': ['bug'],
			'description': 'Gets the channel or role names and their matching IDs on a server',
			'format': 'channels|roles',
			'examples': ['debug roles'],
			'guildOnly': true,
			'args': [
				{
					'key': 'buggerType',
					'prompt': 'Do you want to debug `channels` or `roles`?',
					'type': 'string',
					'validate': (type) => {
						const validTypes = ['channels', 'roles'];

						if (validTypes.includes(type.toLowerCase())) {
							return true;
						}

						return `Has to be one of ${validTypes.join(', ')}`;
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
		const bugger = args.buggerType,
			debugEmbed = new Discord.MessageEmbed();

		debugEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setTitle(`The ${bugger} on this server are as follows`);

		switch (bugger) {
			case 'channels':
			{
				const chanIDs = msg.guild.channels.filter(textFilter => textFilter.type === 'text').map(cid => cid.id),
					chanNames = msg.guild.channels.filter(textFilter => textFilter.type === 'text').map(cn => cn.name);

				debugEmbed
					.addField('Channel name', chanNames, true)
					.addBlankField(true)
					.addField('channel ID', chanIDs, true);
				break;
			}
			case 'roles':
			{
				const roleIDs = msg.guild.roles.map(rid => rid.id),
					roleNames = msg.guild.roles.map(rn => rn.name).slice(1);

				roleNames.unshift('Everyone');
				debugEmbed
					.addField('Role name', roleNames, true)
					.addBlankField(true)
					.addField('Role ID', roleIDs, true);
				break;
			}
			default:
			{
				return msg.reply('That is not a valid debugger option. Either `channels` or `roles`');
			}
		}

		this.deleteCommandMessages(msg);

		return msg.embed(debugEmbed);
	}
};