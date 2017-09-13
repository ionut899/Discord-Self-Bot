// Copyright (C) 2017 Favna
// 
// This file is part of Discord-Self-Bot.
// 
// Discord-Self-Bot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Discord-Self-Bot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Discord-Self-Bot.  If not, see <http://www.gnu.org/licenses/>.
// 

const Discord = require("discord.js");
const commando = require('discord.js-commando');
const weather = require('yahoo-weather');
const moment = require('moment');

module.exports = class weatherCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'info',
            aliases: ['temp'],
            memberName: 'weather',
            description: 'Get the weather in a city',
            examples: ['weather {city}', 'weather amsterdam'],
            guildOnly: false,

            args: [{
                key: 'city',
                prompt: 'Weather in which city?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        weather(args.city).then(info => {
            const wthEmb = new Discord.RichEmbed();
            wthEmb
                .setAuthor(`Weather data for ${info.location.city} - ${info.location.country}`)
                .setFooter(`Weather data pulled from ${info.image.title} at ${moment().format('MMMM Do YYYY | HH:mm')}`)
                .setThumbnail(info.item.description.slice(19, 56))
                .setColor('#790097')
                .addField('💨 Wind Speed', `${info.wind.speed} ${info.units.speed}`, true)
                .addField('💧 Humidity', `${info.atmosphere.humidity}%`, true)
                .addField('🌅 Sunrise', ConvertTimeformat(info.astronomy.sunrise), true)
                .addField('🌇 Sunset', ConvertTimeformat(info.astronomy.sunset), true)
                .addField('☀️ Today\'s High', `${info.item.forecast[0].high} °${info.units.temperature}`, true)
                .addField('☁️️ Today\'s Low', `${info.item.forecast[0].low} °${info.units.temperature}`, true)
                .addField('🌡️ Temperature', `${info.item.condition.temp} °${info.units.temperature}`, true)
                .addField('🏙️ Condition', info.item.condition.text, true)
                .addField(`🛰️ Forecast ${longDays(info.item.forecast[1].day)} ${info.item.forecast[1].date.slice(0,-5)}`, `High: ${info.item.forecast[1].high} °${info.units.temperature} | Low: ${info.item.forecast[1].low} °${info.units.temperature}`, true)
                .addField(`🛰️ Forecast ${longDays(info.item.forecast[2].day)} ${info.item.forecast[2].date.slice(0,-5)}`, `High: ${info.item.forecast[2].high} °${info.units.temperature} | Low: ${info.item.forecast[2].low} °${info.units.temperature}`, true)
            msg.embed(wthEmb);
        }).catch(err => {
            console.error(err);
        })
    };
};

function ConvertTimeformat(input) {
    let hours = Number(input.match(/^(\d+)/)[1]);
    let minutes = Number(input.match(/:(\d+)/)[1]);
    let AMPM = input.match(/\s(.*)$/)[1];
    if (AMPM == "pm" && hours < 12) hours = hours + 12;
    if (AMPM == "am" && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return `${sHours}:${sMinutes}`;
};

function longDays(input) {
    switch (input) {
        case 'Mon':
            return 'Monday';
        case 'Tue':
            return 'Tuesday';
        case 'Wed':
            return 'Wednesday';
        case 'Thu':
            return 'Thursday';
        case 'Fri':
            return 'Friday';
        case 'Sat':
            return 'Saturday';
        case 'Sun':
            return 'Sunday';
        default:
            return ''
    }
}