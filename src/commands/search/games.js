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
const moment = require('moment');
const request = require("request");
const cheerio = require('cheerio');

module.exports = class gameCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'games',
            group: 'search',
            aliases: ['game', 'moby'],
            memberName: 'games',
            description: 'Finds info on a game on Mobygames',
            examples: ['games {gameName}', 'games Tales of Berseria'],
            guildOnly: false,

            args: [{
                key: 'gameData',
                prompt: 'Please supply game title',
                type: 'string',
                label: 'Game to look up'
            }]
        });
    }

    async run(msg, args) {
        let searchURL = `http://www.mobygames.com/search/quick?q=${replaceAll(args.gameData,/ /,'+')}&p=-1&search=Go&sFilter=1&sG=on`;

        request({
                uri: searchURL,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                }
            },
            async function (err, resp, body) {
                if (!err && resp.statusCode == 200) {
                    let $ = cheerio.load(body);
                    var pageLink = $('#searchResults > div > div:nth-child(2) > div > div.searchData > div.searchTitle > a').attr('href');
                    request({
                            uri: `http://www.mobygames.com${pageLink}`,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                            }
                        },
                        async function (err, resp, body) {
                            if (!err && resp.statusCode == 200) {
                                let $ = cheerio.load(body);
                                const gameName = $('.niceHeaderTitle > a').text();
                                var boxArt = `http://www.mobygames.com${$('#coreGameCover > a > img').attr('src')}`;
                                const publisher = $('#coreGameRelease > div:contains("Published by")').next().children().text();
                                const developer = $('#coreGameRelease > div:contains("Developed by")').next().children().text();
                                const releaseDate = $('#coreGameRelease > div:contains("Released")').next().children().text();
                                const platforms = $('#coreGameRelease > div:contains("Platforms")').next().children().text() === '' ? $('#coreGameRelease > div:contains("Platform")').next().children().text() : ($('#coreGameRelease > div:contains("Platforms")').next().text()).split(',').join(', ');

                                const ESRBRating = $('#coreGameGenre > div > div:contains("ESRB Rating")').next().children().text();
                                const genre = ($('#coreGameGenre > div > div:contains("Genre")').next().text() + ',' + $('#coreGameGenre > div > div:contains("Gameplay")').next().text()).split(',').join(', ');
                                const setting = $('#coreGameGenre > div > div:contains("Setting")').next().children().text();
                                var rating = '';
                                if ($('.scoreHi:nth-child(1)').first().text() === '' && $('.scoreLow:nth-child(1)').first().text() === '') {
                                    rating = $('.scoreMed:nth-child(1)').first().text();
                                } else if ($('.scoreHi:nth-child(1)').first().text() === '' && $('.scoreMed:nth-child(1)').first().text() === '') {
                                    rating = $('.scoreLow:nth-child(1)').first().text();
                                } else {
                                    rating = $('.scoreHi:nth-child(1)').first().text();
                                }
                                var description = "Potentially truncated due to maximum allowed length:\n";
                                var descCombined = "";
                                if ($('blockquote').length === 1) {
                                    descCombined = $('blockquote').text();
                                } else {
                                    $('#ctrq').each(function () {
                                        var $set = [];
                                        var nxt = this.nextSibling;
                                        while (nxt) {
                                            if (!$(nxt).is('.sideBarLinks')) {
                                                $set.push(nxt);
                                                nxt = nxt.nextSibling;
                                            } else break;
                                        }

                                        for (let i = 0; i < $set.length; i++) {
                                            if ($set[i].data !== undefined) {
                                                descCombined = descCombined + $set[i].data;
                                            }
                                        }
                                    });
                                }
                                description += descCombined.slice(0, 970);

                                const gameEmbed = new Discord.MessageEmbed();
                                gameEmbed.setColor('#FF0000').setAuthor(gameName, 'https://i.imgur.com/oHwE0nC.png').setImage(boxArt).setFooter(`Game info pulled from mobygames | ${moment().format('MMMM Do Do YYYY | HH:mm')}`, 'http://i.imgur.com/qPuIzb2.png');
                                gameEmbed.addField('Game Name', gameName, false);
                                releaseDate !== '' ? gameEmbed.addField('Release Date', releaseDate, true) : gameEmbed.addField('Release Date', 'Release Date unknown', true)
                                rating !== '' ? gameEmbed.addField('Rating', rating, true) : gameEmbed.addField('Rating', "No rating available", true);
                                setting !== '' ? gameEmbed.addField('Setting', setting, true) : gameEmbed.addField('Setting', 'No setting specified', true)
                                genre !== '' ? gameEmbed.addField('Genre(s)', genre, true) : gameEmbed.addField('Genre(s)', 'Genre(s) unknown', true);
                                platforms !== '' ? gameEmbed.addField('Platform(s)', platforms, true) : gameEmbed.addField('Platform(s)', 'Platforms unknown', true);
                                developer !== '' ? gameEmbed.addField('Developer', developer, true) : gameEmbed.addField('Developer', 'Developer unknown', true);
                                publisher !== '' ? gameEmbed.addField('Publisher', publisher, true) : gameEmbed.addField('Publisher', 'Publisher unknown', true);
                                ESRBRating !== '' ? gameEmbed.addField('ESRB Rating', ESRBRating, true) : gameEmbed.addField('ESRB Rating', 'ESRB Rating unknown', true);
                                gameEmbed.addField('Description', description, false);

                                await msg.embed(gameEmbed);
                            } else {
                                console.error(err);
                                await msg.reply('An error occured while getting the game\'s info')
                            }
                        });
                } else {
                    console.error(err);
                    await msg.reply('An error occured while fetching search results');
                }
            });

    };
};

function replaceAll(string, pattern, replacement) {
    return string.replace(new RegExp(pattern, "g"), replacement);
}