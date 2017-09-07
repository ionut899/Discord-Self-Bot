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
const superagent = require('superagent');
const querystring = require('querystring');
const auth = require('../../auth.json');
const cheerio = require('cheerio')
const googleapikey = auth.googleapikey;
const imageEngineKey = auth.imageEngineKey;

module.exports = class imageCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'image',
            group: 'search',
            aliases: ['img', 'i'],
            memberName: 'image',
            description: 'Finds an image through google',
            examples: ['image {imageQuery}', 'image Pyrrha Nikos'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What do you want to find images of?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        const query = args.query //is basically the search sent by you
            .replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '')
            .split(' ')
            .map(x => encodeURIComponent(x))
            .join('+');
        let safe = msg.channel.name.includes('nsfw') ? 'off' : 'medium';
        let QUERY_PARAMS = {
            searchType: 'image',
            key: googleapikey,
            cx: imageEngineKey,
            safe
        };
        return superagent.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(QUERY_PARAMS)}&q=${encodeURI(query)}`)
            .then((res) => msg.say(res.body.items[0].link))
            .catch(() =>
                superagent.get(`https://www.google.com/search?tbm=isch&gs_l=img&safe=${safe}&q=${encodeURI(query)}`)
                .then((res) => {
                    const $ = cheerio.load(res.text);
                    const result = $('.images_table').find('img').first().attr('src');
                    return result !== undefined ? msg.say(result) : msg.say('**Something went wrong with the result, perhaps only nsfw results were found outside of an nsfw channel**');
                })
            ).catch((err) => {
                msg.say('**No Results Found**');
                console.error(err);
            });
    }
};