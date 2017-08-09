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
const moment = require('moment-timezone');

module.exports = class zoneConvCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'zoneconverter',
            aliases: ['time', 'conv', 'zone', 'timeconv'],
            group: 'info',
            memberName: 'zoneconverter',
            description: 'Converts current time to specified timezone',
            examples: ['timeconv 18:00 America/New_York', 'conv 18:00 Europe/Lisbon'],
            guildOnly: false,

            args: [{
                    key: 'time',
                    label: 'Time',
                    prompt: 'What time to convert? (24 hour format)',
                    type: 'string'
                },
                {
                    key: 'zone',
                    label: 'tz',
                    prompt: 'What timezone to convert to?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        let ymd = moment().format('YYYY-MM-DD');
        var convertedTime = moment(`${ymd} ${args.time}`).tz(args.zone).format('MMMM Do | HH:mm');
        if (convertedTime.split(' | ')[1] === args.time) {
            return msg.say('***The provided timezone either does not exist or has the same time as your own.\nFor the list of correct timezones see this table: <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>***')
        } else {
            await msg.say(`***When it is ${args.time} in ${moment.tz.guess()} it will be ${convertedTime} in ${args.zone}***`);
        }
    };
};