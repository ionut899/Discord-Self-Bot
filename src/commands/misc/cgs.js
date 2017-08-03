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
const request = require('request')
const cheerio = require('cheerio')

module.exports = class cgsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cgs',
            group: 'misc',
            aliases: ['chaos'],
            memberName: 'cgs',
            description: 'Search ChaosGamez posts',
            examples: ['cgs Sonic Boom Fire And Ice (EUR)'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What should we search on ChaosGamez?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const query = replaceAll(args.query, / /, '+')
        console.log(query);
        console.log(`https://chaosgamez.com/search/900000/?q=${query}&o=relevance`);
        request({
                uri: `https://chaosgamez.com/search/900000/?q=${query}&o=relevance`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                }
            },
            async function (err, resp, body) {
                if (err) return msg.reply(`**An error occured - response code ${resp.statusCode}**`)
                if (!err && resp.statusCode == 200) {
                    let $ = cheerio.load(body);
                    var url = $('.title a').attr('href');
                    console.log(url);

                    if (url !== undefined) {
                        request({
                                uri: `https://chaosgamez.com/${url}`,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
                                }
                            },
                            async function (err, resp, body) {
                                if (err) return msg.reply(`**An error occured - response code ${resp.statusCode}**`);
                                if (!err && resp.statusCode == 200) {
                                    let $ = cheerio.load(body);
                                    let sectionArray = [];
                                    let tagsArray = [];
                                    $('a.crumb').each(function (i, elem) {
                                        sectionArray[i] = $(this).text();
                                    });
                                    $('.tagList').children().children().each(function (i, elem) {
                                        tagsArray[i] = $(this).text();
                                    });
                                    var indexes = getAllIndexes(sectionArray, sectionArray[0]);
                                    let cgsEmbed = new Discord.RichEmbed();
                                    cgsEmbed
                                        .setColor('#39A3D8')
                                        .setAuthor($('.username').first().text(), $('.avatar').children().attr('src').slice(0, 6) !== 'styles' ? $('.avatar').children().attr('src') : `https://chaosgamez.com/${$('.avatar').children().attr('src')}`)
                                        .setThumbnail($('.avatar').children().attr('src').slice(0, 6) !== 'styles' ? $('.avatar').children().attr('src') : `https://chaosgamez.com/${$('.avatar').children().attr('src')}`)
                                        .setFooter($('.DateTime').first().text())
                                        .addField('Forum Section', sectionArray.slice(indexes[1], indexes[2]).join(' -> '), false)
                                        .addField('Tags', tagsArray.length !== 0 ? tagsArray.join(', ') : 'None set', false)
                                        .addField('Post Content', `Possibly truncated due to length: \n ${replaceAll($('.messageText').text(), /\s{2,}/, '').slice(0, 980)}`)

                                    await msg.embed(cgsEmbed, `https://chaosgamez.com/${url}`);
                                }
                            });
                    } else {
                        msg.reply('**No Results Found**');
                    }
                };
            });
    };
};

function replaceAll(string, pattern, replacement) {
    return string.replace(new RegExp(pattern, "g"), replacement);
}

function getAllIndexes(arr, val) {
    var indexes = [],
        i;
    for (i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}