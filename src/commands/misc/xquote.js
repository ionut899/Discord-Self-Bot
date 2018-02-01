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
	commando = require('discord.js-commando'),
	moment = require('moment');

module.exports = class quoteCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'xquote',
			'memberName': 'xquote',
			'group': 'misc',
			'aliases': ['xq'],
			'description': 'Quote someone else\'s message into a MessageEmbed.',
			'details': ' Allows for cross server quoting but IDs are required',
			'format': 'ServerID|ServerName(partial or full) ChannelID MessageID [ContentToSendAlongWithTheEmbed]',
			'examples': ['xquote 246821351585742851 355269305941622786 355275528002994176 Oh so that was the first message on the channel!'],
			'guildOnly': false,
			'args': [
				{
					'key': 'guild',
					'prompt': 'Which server?',
					'type': 'guild'
				},
				{
					'key': 'channel',
					'prompt': 'Which channel on that server?',
					'type': 'string'
				},
				{
					'key': 'message',
					'prompt': 'And what message?',
					'type': 'string'
				},
				{
					'key': 'content',
					'prompt': 'What content would you like to send along with the quote?',
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

	async fetchPreview (url) {
		/* eslint-disable global-require */
		const imgur = require('imgur'),
			request = require('snekfetch');
		/* eslint-enable global-require */

		let requestData = '';

		try {
			requestData = await request.get(`https://api.letsvalidate.com/v1/thumbs/?url=${url}`);
		} catch (err) {
			return null;
		}

		if (requestData) {
			const upload = await imgur.uploadBase64(requestData.body.toString('base64'));

			if (upload) {
				return upload.data.link;
			}

			return null;
		}

		return null;
	}

	async run (msg, args) {
		const quote = await this.client.guilds.get(args.guild.id).channels.get(args.channel).messages.fetch(args.message);

		if (quote) {
			const quoteEmbed = new Discord.MessageEmbed();

			if (quote.member === null) {
				quoteEmbed
					.setAuthor(`Quoting ${quote.author.username}`, quote.author.displayAvatarURL())
					.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000');
			} else {
				quoteEmbed
					.setAuthor(`Quoting ${quote.member.displayName}`, quote.author.displayAvatarURL())
					.setColor(quote.channel.type === 'text' ? quote.member.displayHexColor : '#FF0000');
			}
			quoteEmbed
				.setFooter(`Message sent in #${quote.channel.name} on ${moment(quote.createdAt).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`)
				.setDescription(quote.cleanContent);

			if (quote.cleanContent.match(/\bhttps?:\/\/[^\s>]+/gi) && !quote.attachments.first()) {
				const img = await this.fetchPreview(quote.cleanContent.match(/\bhttps?:\/\/[^\s>]+/gi)[0]);

				if (img) {
					quoteEmbed.setImage(img);
				}
			}

			if (quote.attachments.first()) {
				const fileExt = quote.attachments.first().url.slice(-3); // eslint-disable-line one-var

				if (fileExt === 'peg' || fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif' || fileExt === 'webp') {
					quoteEmbed.setImage(quote.attachments.first().url);
				}
			}

			this.deleteCommandMessages(msg);

			return msg.embed(quoteEmbed, args.content);
		}

		return msg.reply('⚠️ something went wrong quoting that message.');
	}
};