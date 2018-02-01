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

const Commando = require('discord.js-commando'),
	Discord = require('discord.js'),
	path = require('path'),
	auth = require(path.join(`${__dirname}/auth.json`)), // eslint-disable-line sort-vars
	moment = require('moment'), // eslint-disable-line sort-vars
	{oneLine} = require('common-tags'),
	sqlite = require('sqlite');

// eslint-disable-next-line one-var	
const values = {
	'hookClient': new Discord.WebhookClient(auth.webhookID, auth.webhooktoken, {'disableEveryone': true}),
	'ownerID': auth.ownerID
};

class DiscordSelfBot {
	constructor (token) { // eslint-disable-line no-unused-vars
		this.bootTime = new Date();
		this.token = auth.token;
		this.client = new Commando.Client({
			'owner': values.ownerID,
			'commandPrefix': '$',
			'selfbot': true
		});
		this.isReady = false;
	}

	onReady () {
		return () => {
			console.log(`Client ready; logged in as ${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})`); // eslint-disable-line no-console
			this.client.user.setAFK(true); // Set bot to AFK to enable mobile notifications
			this.isReady = true;
		};
	}

	onCommandPrefixChange () {
		return (guild, prefix) => {
			// eslint-disable-next-line no-console
			console.log(oneLine ` 
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
		};
	}

	onDisconnect () {
		return () => {
			console.warn('Disconnected!'); // eslint-disable-line no-console
		};
	}

	onReconnect () {
		return () => {
			console.warn('Reconnecting...'); // eslint-disable-line no-console
		};
	}

	onCmdErr () {
		return (cmd, err) => {
			if (err instanceof Commando.FriendlyError) {
				return;
			}
			console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err); // eslint-disable-line no-console
		};
	}

	onCmdBlock () {
		return (msg, reason) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
		blocked; ${reason}
	`);
		};
	}

	onCmdStatusChange () {
		return (guild, command, enabled) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
            Command ${command.groupID}:${command.memberName}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
		};
	}

	onGroupStatusChange () {
		return (guild, group, enabled) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
		};
	}

	onMessage () {
		return (msg) => {

			if (this.client.provider.get('global', 'webhooktoggle', false) && msg.author.id !== values.ownerID && !msg.mentions.users.get(values.ownerID)) {
				const mentionEmbed = new Discord.MessageEmbed(),
					regexpExclusions = [],
					regexpKeywords = [],
					wnsExclusions = this.client.provider.get('global', 'webhookexclusions', ['none']),
					wnsKeywords = this.client.provider.get('global', 'webhookkeywords', ['username', 'nickname']);

				for (const keyword in wnsKeywords) {
					const regex = new RegExp(`.*${wnsKeywords[keyword]}.*`, 'im');

					regexpKeywords.push(regex);
				}

				for (const exclusion in wnsExclusions) {
					const regex = new RegExp(`.*${wnsExclusions[exclusion]}.*`, 'im');

					regexpExclusions.push(regex);
				}

				if (regexpKeywords.find(rx => rx.test(msg.cleanContent))) {

					if (!regexpExclusions.find(rx => rx.test(msg.cleanContent))) {
						mentionEmbed
							.setAuthor(msg.channel.type === 'text'
								? `${msg.member ? msg.member.displayName : 'someone'} dropped your name in #${msg.channel.name} in ${msg.guild.name}`
								: `${msg.author.username} sent a message with your name`, msg.author.displayAvatarURL())
							.setFooter(`Message dates from ${moment(msg.createdAt).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`)
							.setColor(msg.member ? msg.member.displayHexColor : '#535B62')
							.setThumbnail(msg.author.displayAvatarURL())
							.addField('Message Content', msg.cleanContent.length > 1024 ? msg.cleanContent.slice(0, 1024) : msg.cleanContent)
							.addField('Message Attachments', msg.attachments.first() && msg.attachments.first().url ? msg.attachments.map(au => au.url) : 'None');

						values.hookClient.send(`Stalkify away <@${values.ownerID}>`, {'embeds': [mentionEmbed]}).catch(console.error); // eslint-disable-line no-console
					}
				}
			}

			if (this.client.provider.get('global', 'channellinktoggle', false) && msg.guild) {
				const dataArr = this.client.provider.get('global', 'clconfig'),
					forwardEmbed = new Discord.MessageEmbed();

				if (dataArr.length !== 0 && msg.guild.id === dataArr[0][0] && msg.channel.id === dataArr[0][1]) {
					forwardEmbed
						.setColor(msg.member ? msg.member.displayHexColor : '#FF0000')
						.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({'format': 'png'}))
						.setTitle(`Message from ${this.client.guilds.get(dataArr[0][0]).channels.get(dataArr[0][1]).name} on ${this.client.guilds.get(dataArr[1][0]).name}`)
						.setDescription(msg.content)
						.setFooter(`Message dates from ${moment(msg.createdAt).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`);

					this.client.guilds.get(dataArr[1][0]).channels.get(dataArr[1][1]).send({'embed': forwardEmbed});
				}
			}
		};
	}

	init () {
		this.client
			.on('ready', this.onReady())
			.on('commandPrefixChange', this.onCommandPrefixChange())
			.on('error', console.error) // eslint-disable-line no-console
			.on('warn', console.warn) // eslint-disable-line no-console
			.on('debug', console.log) // eslint-disable-line no-console
			.on('disconnect', this.onDisconnect())
			.on('reconnecting', this.onReconnect())
			.on('commandError', this.onCmdErr())
			.on('commandBlocked', this.onCmdBlock())
			.on('commandStatusChange', this.onCmdStatusChange())
			.on('groupStatusChange', this.onGroupStatusChange())
			.on('message', this.onMessage());

		this.client.setProvider(
			sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
		).catch(console.error); // eslint-disable-line no-console

		this.client.registry
			.registerGroups([
				['emojis', '"Global" emojis as images'],
				['fun', 'Fun and Games to play with the bot'],
				['info', 'Get Information on various things'],
				['links', 'Quick Website Links'],
				['memes', 'React with memes'],
				['misc', 'Commands that cannot be categorized elsewhere'],
				['nsfw', 'Find NSFW content ( ͡° ͜ʖ ͡°)'],
				['pokedex', 'Get information from the PokéDex'],
				['provider', 'Control your data stored in the client provider'],
				['search', 'Search the web'],
				['status', 'Set your status'],
				['themeplaza', 'Browse ThemePlaza']
			])
			.registerDefaultGroups()
			.registerDefaultTypes()
			.registerDefaultCommands({
				'help': true,
				'prefix': true,
				'ping': true,
				'eval_': true,
				'commandState': true
			})
			.registerCommandsIn(path.join(__dirname, 'commands'));

		return this.client.login(this.token);
	}

	deinit () {
		this.isReady = false;

		return this.client.destroy();
	}
}

module.exports = DiscordSelfBot;