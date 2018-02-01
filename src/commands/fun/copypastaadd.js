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
	fs = require('fs'),
	path = require('path');

module.exports = class copypastaAddCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'copypastaadd',
			'memberName': 'copypastaadd',
			'group': 'fun',
			'aliases': ['cpadd', 'pastaadd'],
			'description': 'Saves a copypasta to local file',
			'format': 'CopypastaName CopypastaContent',
			'examples': ['copypasta navy what the fuck did you just say to me ... (etc.)'],
			'guildOnly': false,
			'args': [
				{
					'key': 'name',
					'prompt': 'Send which copypasta?',
					'type': 'string',
					'parse': p => p.toLowerCase()
				},
				{
					'key': 'content',
					'prompt': 'What should be stored in the copypasta?',
					'type': 'string'
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
		fs.writeFileSync(path.join(__dirname, `pastas/${args.name}.txt`), args.content, 'utf8');

		if (fs.existsSync(path.join(__dirname, `pastas/${args.name}.txt`))) {
			this.deleteCommandMessages(msg);
			
			return msg.reply(`Copypasta stored in ${args.name}.txt. You can summon it with ${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}copypasta ${args.name}`);
		}
		
		return msg.reply('⚠️ an error occured and your pasta was not saved. Consider creating the text file manually.');
	}
};