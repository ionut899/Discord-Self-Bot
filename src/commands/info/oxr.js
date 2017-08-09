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

const Discord = require("discord.js");
const commando = require('discord.js-commando');
const auth = require('../../auth.json');
const oxr = require('open-exchange-rates');
const fx = require('money');
const currencySymbol = require('currency-symbol-map');
const moment = require('moment');
oxr.set({
    app_id: auth.oxrAppID
})

module.exports = class moneyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'oxr',
            group: 'info',
            aliases: ['money', 'rate', 'convert'],
            memberName: 'oxr',
            description: 'Currency converter - makes use of ISO 4217 standard currency codes',
            examples: ['oxr 50 USD EUR', 'convert 50 GBP NOK'],
            guildOnly: false,

            args: [{
                key: 'input',
                prompt: 'Currency amount and country codes? (example format: `1 USD EUR`)',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        oxr.latest(async function () {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            let conversionQuery = args.input.split(' ');

           await converter(conversionQuery).then((convertedMoney) => {
                let oxrEmbed = new Discord.RichEmbed();
                oxrEmbed
                    .setColor('#2558CF')
                    .setAuthor('🌐 Currency Converter')
                    .addField(conversionQuery[1] !== 'BTC' ?
                        `:flag_${conversionQuery[1].slice(0,2).toLowerCase()}: Money in ${conversionQuery[1]}` :
                        `💰 Money in Bitcoin`,
                        `${currencySymbol(conversionQuery[1])}${conversionQuery[0]}`, true)

                    .addField(conversionQuery[2] !== 'BTC' ?
                        `:flag_${conversionQuery[2].slice(0,2).toLowerCase()}: Money in ${conversionQuery[2]}` :
                        `💰 Money in Bitcoin`,
                        `${currencySymbol(conversionQuery[2])}${convertedMoney}`, true)
                    .setFooter(`Converted money from input using openexchangerates | converted on: ${moment(new Date()).format("MMMM Do YYYY | HH:mm:ss")}`);
                msg.embed(oxrEmbed);
            }).catch((e) => {
                console.error(e);
                msg.reply('***An error occurred. Make sure you used correct ISO 4217 standard currency codes, see here for the list: <http://www.xe.com/iso4217.php>***')
            });
        });
    };
};

async function converter(conversionQuery) {
    return fx.convert(conversionQuery[0], {
        from: conversionQuery[1],
        to: conversionQuery[2]
    })
}