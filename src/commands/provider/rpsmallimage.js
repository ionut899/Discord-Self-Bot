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

	async run(msg, args) {
		var appID = this.client.provider.get('global', 'rpappid');
		await this.client.fetchApplication(appID).then(a => a.fetchAssets().then(a => {
			var array = [];
			if (a.length == 0) return msg.reply(`No assets in application with ID \`${appID}\``);
			for (let i = 0; i < a.length; i++) {
				var obj = {};
				if (a[i].type == 'SMALL') {
					obj.id = a[i].id;
					obj.name = a[i].name;
					array.push(obj);
				}
			}

			var imageID;
			var id = array.find(o => o.id == args.smallimage);
			var name = array.find(o => o.name == args.smallimage);
			if (id != null) {
				imageID = id.id;
			} else if (name != null) {
				imageID = name.id;
			}
			if (imageID == null) return msg.reply(`Can't find \`${args.smallimage}\` in application with ID \`${appID}\``);

			this.client.provider.set('global', 'rpsmallimage', imageID);

			return msg.reply(oneLine `Your RichPresence SmallImageID has been set to \`${args.smallimage}\``);
		}));

		this.deleteCommandMessages(msg);

	}
};
