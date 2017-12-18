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
 */

const booru = require('booru'),
	commando = require('discord.js-commando'),
	data = require('../../data.json');

module.exports = class gelbooruCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'gelbooru',
			'group': 'nsfw',
			'aliases': ['gel', 'booru'],
			'memberName': 'gelbooru',
			'description': 'Find NSFW Content on gelbooru',
			'examples': ['gelbooru {NSFW Query}', 'gelbooru Pyrrha Nikos'],
			'guildOnly': false,
			'nsfw': true,

			'args': [
				{
					'key': 'nsfwtags',
					'prompt': 'What do you want to find NSFW for?',
					'type': 'string',
					'label': 'Search query'
				}
			]
		});
	}

	async run (msg, args) {
		try {
			const booruData = await booru.search('gelbooru', args.nsfwtags.split(' '), {
				'limit': 1,
				'random': true
			}).then(booru.commonfy);

			if (booruData) {
				if (msg.deletable && data.deleteCommandMessages) {
					msg.delete();
				}

				return msg.say(`Score: ${booruData[0].common.score}\nImage: ${booruData[0].common.file_url}`);
			}

			return msg.reply('⚠️ No juicy images found.');
		} catch (booruError) {
			return msg.reply('⚠️ No juicy images found.');
		}
	}
};