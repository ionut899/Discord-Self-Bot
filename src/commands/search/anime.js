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
const malware = require('malapi').Anime;

module.exports = class animeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            group: 'search',
            aliases: ['ani', 'mal'],
            memberName: 'anime',
            description: 'Find anime',
            examples: ['anime Yu-Gi-Oh', 'ani Yu-Gi-Oh', 'mal Yu-Gi-Oh'],
            guildOnly: false,

            args: [{
                key: 'query',
                prompt: 'What anime do you want to find?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {

        let animeEmbed = new Discord.RichEmbed();

        malware.fromName(args.query).then(anime => {
                let japName = anime.alternativeTitles.japanese;
                let engName = anime.alternativeTitles.english;
                let score = anime.statistics.score.value;
                let type = anime.type;
                var episodeCount = anime.episodes;
                let status = anime.status;
                let synopsis = anime.synopsis;
                let image = anime.image;
                let animeUrl = `https://myanimelist.net/anime/${anime.id}`;

                animeEmbed
                    .setAuthor(args.query, "https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png")
                    .setColor("#FF0000")
                    .setImage(image)
                    .setFooter(`Anime info by PyrrhaBot | ${moment().format('MMMM Do YYYY')}`, "http://i.imgur.com/4U9oMS0.png")
                    .setURL(animeUrl);

                if (japName != null) {
                    animeEmbed.addField("Japanese name", japName, true);
                } else {
                    animeEmbed.addField("Japanese name", "None", true);
                };

                if (engName != null) {
                    animeEmbed.addField("English name", engName, true);
                } else {
                    animeEmbed
                        .addField("English name", "None", true)
                        .addBlankField(true);
                };


                if (synopsis.length >= 1024) {
                    animeEmbed.addField("Synposis", `The synopsis for this anime exceeds the maximum length, check the full synopsis on myanimelist.\nSynopsis Snippet:\n${synopsis.slice(0,500)}`, false);
                } else {
                    animeEmbed.addField("Synposis", synopsis, false);
                };

                score !== "" ? animeEmbed.addField("Score", score, true) : animeEmbed.addField("Score", 'Score unknown', true)
                animeEmbed
                    .addField("Episodes", episodeCount, true)
                    .addField("Status", status, true)
                    .addField("URL", animeUrl, true);

                return msg.embed(animeEmbed);
            })
            .catch((err) => {
                console.error(err);
                return msg.say(`**No results found!**`)
            });

    };
};