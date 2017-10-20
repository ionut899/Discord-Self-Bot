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
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const currencySymbol = require('currency-symbol-map');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(auth.steamAPIKey)

module.exports = class steamCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'steam',
            group: 'search',
            aliases: ['valve'],
            memberName: 'steam',
            description: 'Finds a game on Steam',
            examples: ['steam {steamGameName}', 'steam Tales of Berseria'],
            guildOnly: false,

            args: [{
                key: 'steamGameName',
                prompt: 'What game do you want to find on the steam store?',
                type: 'string',
                label: 'Game to look up'
            }]
        });
    }

    async run(msg, args) {

        let storeSearchURL = `http://store.steampowered.com/search/?term=${replaceAll(args.steamGameName,/ /,'+')}`;

        request({
                uri: storeSearchURL,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                }
            },
            async function (err, resp, body) {
                if (!err && resp.statusCode === 200) {
                    let $ = cheerio.load(body);
                    const appID = $('#search_result_container > div:nth-child(2) > a:nth-child(2)').attr('href').split('/')[4];
                    const steamEmbed = new Discord.RichEmbed();
                    steam.getGameDetails(appID).then(data => {

                        var platforms = [];
                        var genres = [];
                        data.platforms.windows ? platforms.push('Windows') : null;
                        data.platforms.mac ? platforms.push('MacOS') : null;
                        data.platforms.linux ? platforms.push('Linux') : null;

                        for (let x in data.genres) {
                            genres.push(data.genres[x].description);
                        };

                        steamEmbed
                            .setColor('#FF0000')
                            .setTitle(data.name)
                            .setURL(`http://store.steampowered.com/app/${data.steam_appid}/`)
                            .setImage(data.header_image)
                            .setDescription(cheerio.load(data.short_description).text())
                            .addField(`Price in ${data.price_overview.currency}`, `${currencySymbol(data.price_overview.currency)}${insert(data.price_overview.final.toString(),2,",")}`, true)
                            .addField('Release Date', data.release_date.date, true)
                            .addField('Platforms', platforms.join(', '), true)
                            .addField('Controller Support', data.controller_support !== undefined ? data.controller_support : "None", true)
                            .addField('Age requirement', data.required_age !== 0 ? data.required_age : 'Everyone / Not in API', true)
                            .addField('Genres', genres.join(', '), true)
                            .addField('Developer(s)', data.developers, true)
                            .addField('Publisher(s)', data.publishers, true)
                            .addField('Steam Store Link', `http://store.steampowered.com/app/${data.steam_appid}/`, false);
                        return msg.embed(steamEmbed);
                    });

                } else {
                    console.error(err)
                    await msg.reply('An error occured while getting the store search result');
                };
            }
        )
    };
};

function replaceAll(string, pattern, replacement) {
    return string.replace(new RegExp(pattern, "g"), replacement);
};

function insert(str, index, value) {
    return str.substring(0, index) + value + str.substring(index);
};