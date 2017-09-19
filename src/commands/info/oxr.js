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
            description: 'Currency converter - makes use of ISO 4217 standard currency codes (see list here: <https://docs.openexchangerates.org/docs/supported-currencies>)',
            examples: ['oxr {amount} {currency_1} {currency_2}', 'convert 50 USD EUR'],
            guildOnly: false,

            args: [{
                    key: 'value',
                    prompt: 'Amount of money?',
                    type: 'string'
                },
                {
                    key: 'curOne',
                    prompt: 'What is the currency you want to convert **from**?',
                    type: 'string'
                },
                {
                    key: 'curTwo',
                    prompt: 'What is the currency you want to convert **to**?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        oxr.latest(async function () {
            fx.rates = oxr.rates;
            fx.base = oxr.base;

console.log(oxr.rates);

            await converter(replaceAll(args.value, /,/, '.'), args.curOne, args.curTwo).then((convertedMoney) => {
                let oxrEmbed = new Discord.RichEmbed();
                oxrEmbed
                    .setColor('#2558CF')
                    .setAuthor('🌐 Currency Converter')
                    .addField(args.curOne !== 'BTC' ?
                        `:flag_${args.curOne.slice(0,2).toLowerCase()}: Money in ${args.curOne}` :
                        `💰 Money in Bitcoin`,
                        `${currencySymbol(args.curOne)}${replaceAll(args.value, /,/, '.')}`, true)

                    .addField(args.curTwo !== 'BTC' ?
                        `:flag_${args.curTwo.slice(0,2).toLowerCase()}: Money in ${args.curTwo}` :
                        `💰 Money in Bitcoin`,
                        `${currencySymbol(args.curTwo)}${convertedMoney}`, true)
                    .setFooter(`Converted money from input using openexchangerates | converted on: ${moment().format("MMMM Do YYYY | HH:mm:ss")}`);
                msg.embed(oxrEmbed);
            }).catch((e) => {
                console.error(e);
                msg.reply('***An error occurred. Make sure you used supported currency names. See the list here: <https://docs.openexchangerates.org/docs/supported-currencies>***')
            });
        });
    };
};

async function converter(value, curOne, curTwo) {
    return fx.convert(value, {
        from: curOne,
        to: curTwo
    })
}

function replaceAll(string, pattern, replacement) {
    return string.replace(new RegExp(pattern, "g"), replacement);
}