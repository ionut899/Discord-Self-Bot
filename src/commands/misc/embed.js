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

module.exports = class embedCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'embed',
			'memberName': 'embed',
			'group': 'misc',
			'aliases': ['emb', 'embeds'],
			'description': 'Create custom MessageEmbeds on the fly',
			'format': 'FieldName>Value1[;Value2<FieldName2>Value1;Value2] [ImageURL]',
			'examples': ['embed What goes up but never comes down?>Your Age'],
			'guildOnly': false,
			'args': [
				{
					'key': 'embedContent',
					'prompt': 'What should the content of the embed be?',
					'type': 'string',
					'validate': (input) => {
						if (input.match(/([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\{\]\}\;\:\'\"\\\|\,\<\.\>\/\?\`\~]*)>([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\{\]\}\;\:\'\"\\\|\,\<\.\>\/\?\`\~]*).*/)) { // eslint-disable-line max-len
							return true;
						}

						return 'The format for a custom rich embed should at least be `FieldName>Value`';
					},
					'wait': 60
				},
				{
					'key': 'image',
					'prompt': 'Any image to send into the embed?',
					'type': 'string',
					'default': 'none',
					'validate': (url) => {
						if (url.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im)) {
							return true;
						}

						return 'Image URl has to be an actual URL';
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
		const customEmbed = new Discord.MessageEmbed(),
			paramString = args.embedContent,
			fields = paramString.split('<'); // eslint-disable-line sort-vars

		fields.forEach((field) => {
			const chunks = field.split('>'),
				header = chunks[0],
				values = chunks[1].split(';');

			customEmbed.addField(header, values.join('\n'), true);
		});

		customEmbed
			.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
			.setImage(args.image !== 'none' ? args.image : null);

		this.deleteCommandMessages(msg);

		return msg.embed(customEmbed);
	}
};