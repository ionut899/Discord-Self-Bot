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

module.exports = class rpsmallimageCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rpsmallimage',
			'group': 'provider',
			'aliases': ['smallimage', 'simage'],
			'memberName': 'rpsmallimage',
			'description': 'Set your Rich Presence SmallImage ID',
			'examples': ['rpsmallimage {SmallImageID}', 'rpsmallimage 379734813751377921'],
			'guildOnly': false,

			'args': [
				{
					'key': 'smallimage',
					'prompt': 'What is the SmallImageID for the "small" Rich Presence image you want?',
					'type': 'string',
					'label': 'smallimageID'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	/* eslint max-depth: ["error", 5]*/

	async run (msg, args) {
		const appID = this.client.provider.get('global', 'rpappid');

		if (appID) {
			const application = await this.client.fetchApplication(appID);

			if (application) {
				const assets = await application.fetchAssets();

				if (assets) {
					const array = [];

					if (assets.length === 0) {
						return msg.reply(`No assets found in application with ID \`${appID}\``);
					}
					for (const i in assets) {
						if (assets[i].type === 'SMALL') {
							array.push({
								'id': assets[i].id,
								'name': assets[i].name
							});
						}
					}

					const id = array.find(o => o.id === args.smallimage), // eslint-disable-line one-var
						name = array.find(o => o.name === args.smallimage);
					let imageID = '';

					if (id) {
						imageID = id.id;
					} else if (name) {
						imageID = name.id;
					}

					if (!imageID) {
						return msg.reply(`Can't find \`${args.smallimage}\` in application with ID \`${appID}\``);
					}

					this.client.provider.set('global', 'rpsmallimage', imageID);
					this.deleteCommandMessages(msg);

					return msg.reply(oneLine `Your RichPresence Small Image has been set to \`${args.smallimage}\``);
				}

				return msg.reply(`No assets found in application with ID \`${appID}\``);
			}

			return msg.reply(oneLine `An error occured fetching that application. Are you sure the ID is correct? Set it with the \`${msg.guild
				? msg.guild.commandPrefix
				: this.client.commandPrefix}rpappid\`command `);
		}

		return msg.reply(`You first need to set your application with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}rpappid\` command!`);
	}
};