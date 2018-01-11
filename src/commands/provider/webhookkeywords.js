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

module.exports = class webhookkeywordsCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'webhookkeywords',
			'group': 'provider',
			'aliases': ['whk', 'hookwords', 'hookkeywords'],
			'memberName': 'webhookkeywords',
			'description': 'Configure the keywords used in your Webhook Notification System (WNS)',
			'examples': ['webhookkeywords {words}', 'webhookkeywords Favna,Fanava,Fav'],
			'guildOnly': false,

			'args': [
				{
					'key': 'keywords',
					'prompt': 'What keyword should be set for Webhook Notification System?',
					'type': 'string',
					'label': 'keywords for WNS'
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
		this.client.provider.set('global', 'webhookkeywords', args.keywords.split(','));

		this.deleteCommandMessages(msg);

		return msg.reply(oneLine `Webhook Keywords have been set to \`${args.keywords.replace(/,/gim, ', ')}\`. 
        Make sure to enable webhooks with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhooktoggle\`
        and optionally set your word exclusions with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}webhookexclusions\` command`);
	}
};