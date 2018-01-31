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
	{
		oneLine,
		stripIndents
	} = require('common-tags');

module.exports = class ChannelLinkSetupCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'channellinksetup',
			'group': 'provider',
			'aliases': ['channellink', 'channellinker', 'linkchannel', 'chanlink', 'clink'],
			'memberName': 'channellinksetup',
			'format': '{Server A|Channel A} {Server B|Channel B}',
			'description': 'Link two channels',
			'details': oneLine `Once channel linker is enabled any message from channel A any server is forwarded by the selfbot (yourself) to Channel B on any server (the same or another one)
            This is achieved by actively watching Channel A and automatically formatting any message.
            Note 1: that message edits are *not watched*!
            Note 2: Make sure you enable channellink with channellinktoggle!`,
			'examples': ['channellinksetup 349243932447604736|349251570665259008 246821351585742851|309470585027559425'],
			'guildOnly': false,
			'args': [
				{
					'key': 'source',
					'prompt': 'Source server and channel?',
					'type': 'string',
					'label': 'message source',
					'validate': (input) => {
						if (input.match(/^[0-9]{18}\|[0-9]{18}$/)) {
							return true;
						}

						return 'Has to be in the format ServerID|ChannelID';
					}
				},
				{
					'key': 'target',
					'prompt': 'Target server and channel?',
					'type': 'string',
					'label': 'message target',
					'validate': (input) => {
						if (input.match(/^[0-9]{18}\|[0-9]{18}$/)) {
							return true;
						}

						return 'Has to be in the format ServerID|ChannelID';
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
		const dataArr = [args.source.split('|'), args.target.split('|')];

		this.client.provider.set('global', 'clconfig', dataArr);

		this.deleteCommandMessages(msg);

		return msg.reply(stripIndents `${oneLine `Linked the
\`${this.client.guilds.get(dataArr[0][0]).channels.get(dataArr[0][1]).name}\` channel on the \`${this.client.guilds.get(dataArr[0][0]).name}\` server to the
\`${this.client.guilds.get(dataArr[1][0]).channels.get(dataArr[1][1]).name}\` channel on the \`${this.client.guilds.get(dataArr[1][0]).name}\` server`}

Be sure to enable channellink with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}channellinktoggle\` command `);
	}
};