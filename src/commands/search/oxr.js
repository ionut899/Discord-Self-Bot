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
            name: 'money',
            group: 'search',
            aliases: ['oxr', 'rate', 'convert'],
            memberName: 'money',
            description: 'Currency converter - makes use of ISO 4217 standard currency codes',
            examples: ['oxr 50 USD EUR', 'convert 50 GBP NOK'],
            guildOnly: false,

            args: [{
                key: 'input',
                prompt: 'Please supply amount and country codes',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        oxr.latest(function () {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            let conversionQuery = args.input.split(' ');

            try {
                let convertedMoney = fx(conversionQuery[0]).from(conversionQuery[1]).to(conversionQuery[2])
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
            } catch (e) {
                console.error(e);
                msg.reply('***An error occurred. Make sure you used correct ISO 4217 standard currency codes, see here for the list: <http://www.xe.com/iso4217.php>***')
            }
        })
    };
};