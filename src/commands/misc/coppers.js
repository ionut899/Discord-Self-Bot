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

const commando = require('discord.js-commando');

module.exports = class coppersCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'coppers',
            aliases: ['police', 'lolialert', 'cops'],
            group: 'misc',
            memberName: 'coppers',
            description: 'WEE WOO WEE WOO',
            guildOnly: false
        });
    }

    async run(msg) {
        await msg.delete();
        await msg.say(':rotating_light: :rotating_light: WEE WOO WEE WOO - PUT YOUR HANDS IN THE AIR, YOU ARE SURROUNDED :rotating_light: :rotating_light:\n\n:oncoming_police_car:  <:police:346089253572313088> <:police:346089253572313088> <:police:346089253572313088>  :oncoming_police_car:');
    }
};