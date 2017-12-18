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

const Discord = require('discord.js'),
	Pornsearch = require('pornsearch').default,
	commando = require('discord.js-commando'),
	data = require('../../data.json'),
	random = require('node-random');

const pornEmbed = new Discord.MessageEmbed(); // eslint-disable-line one-var

module.exports = class porngifsCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'porngifs',
			'group': 'nsfw',
			'aliases': ['gifs', 'nsfwgifs'],
			'memberName': 'porngifs',
			'description': 'Search porn gifs',
			'examples': ['porngifs {pornograpgy query}', 'porngifs babe'],
			'guildOnly': false,
			'nsfw': true,

			'args': [
				{
					'key': 'pornInput',
					'prompt': 'What pornography do you want to find?',
					'type': 'string',
					'label': 'Search query'
				}
			]
		});
	}

	async run (msg, args) {
		const search = new Pornsearch(args.pornInput),
			gifs = await search.gifs(); // eslint-disable-line sort-vars

		if (gifs) {
			random.integers({
				'number': 1,
				'minimum': 0,
				'maximum': gifs.length - 1
			}, (error, gif) => {
				if (error) {
					return msg.reply('⚠ An error occured while drawing a random number.');
				}
				pornEmbed
					.setURL(gifs[gif].url)
					.setTitle(gifs[gif].title)
					.setImage(`${gifs[gif].url}`)
					.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
					.addField('Gif webm', `[Click Here](${gifs[gif].webm})`, true);

				if (msg.deletable && data.deleteCommandMessages) {
					msg.delete();
				}

				return msg.embed(pornEmbed, gifs[gif].webm);
			});
		}


	}
};