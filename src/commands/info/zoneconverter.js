const commando = require('discord.js-commando');
const moment = require('moment-timezone');

module.exports = class zoneConvCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'timeconv',
            aliases: ['time', 'conv', 'zone'],
            group: 'info',
            memberName: 'timeconv',
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