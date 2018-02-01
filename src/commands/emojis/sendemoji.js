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

const Matcher = require('did-you-mean'),
	commando = require('discord.js-commando'),
	fs = require('fs'),
	{oneLine} = require('common-tags'),
	path = require('path');

const emojis = fs.readdirSync(path.join(__dirname, 'images')); // eslint-disable-line one-var
let detailString = '';

for (const emoji in emojis) {
	detailString += `${emojis[emoji].slice(0, emojis[emoji].length - 4)}, `;
}

module.exports = class sendEmojiCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'sendemoji',
			'memberName': 'sendemoji',
			'group': 'emojis',
			'aliases': ['emoji', 'emo', 'sendemo', 'emosend'],
			'description': 'Send an emoji',
			'details': `Available emojis: ${detailString}`,
			'format': 'EmojiName [MessageToSendWithEmoji]',
			'examples': ['sendemoji thonk'],
			'guildOnly': false,
			'args': [
				{
					'key': 'emojiName',
					'prompt': 'What emoji do you want send?',
					'type': 'string',
					'parse': p => p.toLowerCase()
				}, {
					'key': 'message',
					'prompt': 'Content to send along with the emoji?',
					'type': 'string',
					'default': ''
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
		const match = new Matcher();

		match.values = emojis;

		const dym = match.get(`${args.emojiName}.png`), // eslint-disable-line one-var
			dymString = dym !== null
				? oneLine `Did you mean \`${dym}\`?`
				: oneLine `Add it to the images folder!`;

		this.deleteCommandMessages(msg);

		return msg.say(args.message, {'files': [path.join(__dirname, `images/${args.emojiName}.png`)]}).catch((err) => { // eslint-disable-line handle-callback-err, no-unused-vars
			msg.reply(`⚠️ that emoji does not exist! ${dymString}`);
		});
	}
};