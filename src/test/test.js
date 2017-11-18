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

const DiscordSelfBot = require('../DiscordSelfBot.js'),
	test = require('tape'),
	{token} = require('../auth.json').token;


test('connect & disconnect', (t) => {
	t.timeoutAfter(15000);
	t.ok(token, 'discord token should be set');

	const bot = new DiscordSelfBot(token);

	t.false(bot.isReady, 'bot should not be ready');
	bot.init();

	const si = setInterval(() => { // eslint-disable-line one-var
		if (bot.isReady) {
			bot.deinit();
			clearInterval(si);
			t.end();
		}
	}, 5000);
});