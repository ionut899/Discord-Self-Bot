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
const moment = require('moment');
const superagent = require('superagent');

module.exports = class wikipediaCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'wikipedia',
            group: 'search',
            aliases: ['wen', 'wiki', 'ws'],
            memberName: 'wikipedia',
            description: 'Get the info from a wikipedia page',
            examples: ['wikipedia Discord'],
            guildOnly: false,

            args: [{
                key: 'input',
                prompt: 'What page do you want to get info from?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        superagent.get(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srwhat=text&srprop=sectionsnippet&format=json&srsearch=${args.input}`
            )
            .then((res) => res.body.query.search)
            .then((results) => {
                if (!results[0]) return Promise.reject('NO RESULTS');
                return results[0];
            })
            .then((result) => superagent.get(
                `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(result.title)}`
            ))
            .then((res) => res.body.query.pages[Object.keys(res.body.query.pages)])
            .then((page) => {
                const url = `https://wikipedia.org/wiki/${encodeURIComponent(page.title)}`;
                const wikiData = {
                    url: url,
                    pageTitle: page.title,
                    pageExtract: `${page.extract.substring(0, 500)}... [Read more](${url.replace(/\(/, '%28').replace(/\)/, '%29')})`
                }
                return wikiData
            })
            .then((wikiData) => {
                const wikiEmbed = new Discord.RichEmbed();
                wikiEmbed
                    .setAuthor(`Wikipedia - ${wikiData.pageTitle}`, "https://favna.s-ul.eu/dYdFA880")
                    .setColor("#FF0000")
                    .setFooter(`Wikipedia result pulled on ${moment().format('MMMM Do YYYY HH:mm:ss')}`)
                    .setURL(wikiData.url)
                    .addField("Wiki Page Title", wikiData.pageTitle, false)
                    .addField('Wiki Page Extract', wikiData.pageExtract, false);
                msg.embed(wikiEmbed, wikiData.url);
            })
            .catch((err) => {
                console.error(err);
                msg.reply('**No results found!**');
            });
    }
};