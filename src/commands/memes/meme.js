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
	path = require('path'),
	{oneLine} = require('common-tags'),
	{deleteCommandMessages} = require('../../util.js');

const memes = fs.readdirSync(path.join(__dirname, 'images')); // eslint-disable-line one-var
let detailString = '';

for (const meme in memes) {
	detailString += `${memes[meme].slice(0, memes[meme].length - 4)}, `;
}

module.exports = class memeCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'meme',
			'memberName': 'meme',
			'group': 'memes',
			'aliases': ['mem', 'maymay'],
			'description': 'Send a meme image',
			'details': `Available memes: ${detailString}`,
			'format': 'MemeName [MessageToSendWithEmoji]',
			'examples': ['meme {imageName}', 'meme cry'],
			'guildOnly': false,
			'args': [
				{
					'key': 'image',
					'prompt': 'What image do you want send?',
					'type': 'string',
					'label': 'image name to send'
				}
			]
		});
	}

	run (msg, args) {
		const match = new Matcher();

		match.values = memes;

		const dym = match.get(`${args.image}.jpg`), // eslint-disable-line one-var
			dymString = dym !== null
				? oneLine `Did you mean \`${dym}\`?`
				: oneLine `Add it to the images folder!`;

		deleteCommandMessages(msg, this.client);

		return msg.channel.send({'files': [path.join(__dirname, `/images/${args.image.toLowerCase()}.jpg`)]}).catch((err) => { // eslint-disable-line handle-callback-err, no-unused-vars
			msg.reply(`⚠️ that meme does not exist! ${dymString}`);
		});
	}
};