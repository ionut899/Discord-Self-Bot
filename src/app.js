// Copyright (C) 2017 Favna
// 
// This file is part of PyrrhaBot.
// 
// PyrrhaBot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// PyrrhaBot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with PyrrhaBot.  If not, see <http://www.gnu.org/licenses/>.
// 

const Commando = require('discord.js-commando');
const Discord = require("discord.js");
const auth = require("./auth.json");
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const moment = require('moment');
const ownerID = auth.ownerID;
const client = new Commando.Client({
    owner: auth.ownerID,
    commandPrefix: '$',
    selfbot: true
});
const hookClient = new Discord.WebhookClient(auth.webhookID, auth.webhooktoken, {
    disableEveryone: true
});
var messageStore = [];

client
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        client.user.setAFK(true); // Set bot to AFK to enable mobile notifications
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine `
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnecting', () => {
        console.warn('Reconnecting...');
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        console.log(oneLine `
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
		blocked; ${reason}
	`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine `
		Command ${command.groupID}:${command.memberName}
		${enabled ? 'enabled' : 'disabled'}
		${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
	`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine `
		Group ${group.id}
		${enabled ? 'enabled' : 'disabled'}
		${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
	`);
    });


client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
    .registerGroups([
        ['search', 'Web Search commands'],
        ['pokedex', 'Find data from the PokéDex'],
        ['links', 'Quick Website Links'],
        ['reactions', 'Image Reactions'],
        ['info', 'Discord Info'],
        ['misc', 'Miscellanious commands'],
        ['status', 'Status setting commands'],
        ['themeplaza', 'Various commands to browse ThemePlaza'],
        ['nsfw', 'NSFW finding commands'],
        ['store', 'Message Store commands']
    ])
    .registerDefaultGroups()
    .registerDefaultTypes()
    .registerDefaultCommands({
        help: true,
        prefix: true,
        ping: true,
        eval_: true,
        commandState: true
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(auth.token);

client.on("message", msg => {

    // Log messages including clientUser's username
    if (msg.author.id !== ownerID && msg.content.toLowerCase().indexOf(client.user.username.toLowerCase()) !== -1 && !msg.mentions.users.get(ownerID)) {
        let mentionEmbed = new Discord.RichEmbed();

        mentionEmbed
            .setAuthor(msg.channel.type === 'text' ? `${msg.member.displayName} dropped your name in #${msg.channel.name} in ${msg.guild.name}` : `${msg.author.username} sent a message with your name`, msg.author.displayAvatarURL)
            .setFooter(`Message dates from ${moment(msg.createdAt).format('MMMM Do YYYY | HH:mm:ss')}`)
            .setColor(msg.channel.type === 'text' ? msg.member.displayHexColor : '#535B62')
            .setThumbnail(msg.author.displayAvatarURL)
            .addField('Message Content', msg.cleanContent)
            .addField('Message Attachments', msg.attachments.first() !== undefined && msg.attachments.first().url !== undefined ? msg.attachments.map(au => au.url) : 'None');

        hookClient.send(`Stalkify away <@${ownerID}>`, {
            embeds: [mentionEmbed]
        }).catch(console.error);
    }

    // Log last 10 messages from clientUser in a message store for access through commands
    if (msg.author.id === ownerID) {
        const content = msg.content.toLowerCase();
        const args = msg.content.split(' ').slice(1);
        let prefix = msg.guild !== null ? msg.guild.commandPrefix : '$';

        let currentStoreSize = messageStore.length;
        if (currentStoreSize === 10) {
            messageStore.pop();
            for (let ID in messageStore) {
                messageStore[ID].id = messageStore[ID].id + 1
            }
            messageStore.unshift({
                id: 1,
                message: msg
            });
        } else {
            for (let ID in messageStore) {
                messageStore[ID].id = messageStore[ID].id + 1
            }
            messageStore.unshift({
                id: 1,
                message: msg
            });
        };

        if (content.startsWith(prefix + "edit")) {
            messageStore.shift();
            msg.delete();

            let indicator = args.slice(0, 1).toString();
            let newContent = args.slice(1).join(' ');
            if (!indicator.match(/[0-9]+/)) {
                return client.channels.get('309470585027559425').send(`You forgot an indicator ID\nContent of message: ${msg.content}\nTime of command: ${moment().format('MMMM Do YYYY | HH:mm:ss')}`);
            };
            messageStore[indicator.toString()].message.edit(newContent);
        };

        if (content.startsWith(prefix + "delete")) {
            messageStore.shift();
            msg.delete();

            let indicator = args.slice(0, 1).toString();
            if (!indicator.match(/[0-9]+/)) {
                return client.channels.get('309470585027559425').send(`You forgot an indicator ID\nContent of message: ${msg.content}\nTime of command: ${moment().format('MMMM Do YYYY | HH:mm:ss')}`);
            };
            messageStore[indicator].message.delete();
        };

        if (content.startsWith(prefix + "clear")) {
            msg.delete();
            messageStore = [];
        };

        if (content.startsWith(prefix + "check")) {
            messageStore.shift();
            msg.delete();

            var checkReply = '';

            for (let i in messageStore.map(mcont => mcont.message.content)) {
                checkReply += `${i}: ${messageStore.map(mcont => mcont.message.content)[i]}\n`
            }

            hookClient.send(`<@112001393140723712> Here is your storage log\n${checkReply}`)
                .catch(console.error);
        };
    }
});

// A function to get the proper position in an array
function positionFormatter(length) {
    let numbers = [];
    for (let i = 0; i < length; i++) {
        numbers.push(i)
    }
    return numbers;
};