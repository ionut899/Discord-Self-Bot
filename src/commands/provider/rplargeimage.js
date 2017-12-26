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

module.exports = class rplargeimageCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'rplargeimage',
			'group': 'provider',
			'aliases': ['largeimage', 'limage'],
			'memberName': 'rplargeimage',
			'description': 'Set your Rich Presence LargeImage ID',
			'examples': ['rplargeimage {LargeImageID}', 'rplargeimage 379734851206512640'],
			'guildOnly': false,

			'args': [
				{
					'key': 'largeimage',
					'prompt': 'What is the LargeImageID for the "large" Rich Presence image you want?',
					'type': 'string',
					'label': 'largeimageID'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	async run(msg, args) {
		var appID = this.client.provider.get('global', 'rpappid');
		await this.client.fetchApplication(appID).then(a => a.fetchAssets().then(a => {
			var array = [];
			if (a.length == 0) return msg.reply(`No assets in application with ID \`${appID}\``);
			for (let i = 0; i < a.length; i++) {
				var obj = {};
				if (a[i].type == 'BIG') {
					obj.id = a[i].id;
					obj.name = a[i].name;
					array.push(obj);
				}
			}

			var imageID;
			var id = array.find(o => o.id == args.largeimage);
			var name = array.find(o => o.name == args.largeimage);
			if (id != null) {
				imageID = id.id;
			} else if (name != null) {
				imageID = name.id;
			}
			if (imageID == null) return msg.reply(`Can't find \`${args.largeimage}\` in application with ID \`${appID}\``);

			this.client.provider.set('global', 'rplargeimage', imageID);

			return msg.reply(oneLine `Your RichPresence LargeImageID has been set to \`${args.largeimage}\``);
		}));

		this.deleteCommandMessages(msg);

	}
};
