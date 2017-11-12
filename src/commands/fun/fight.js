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

const commando = require('discord.js-commando');
const Discord = require("discord.js");
const moment = require('moment');
const random = require('node-random');

module.exports = class fightCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'fight',
            group: 'fun',
            aliases: ['combat'],
            memberName: 'fight',
            description: 'Pit two things against each other in a fight to the death',
            examples: ['fight {fighterOne} {fighterTwo}', 'fight Favna Chuck Norris'],
            guildOnly: false,

            args: [{
                    key: 'fighterOne',
                    prompt: 'Who or what is the first fighter?',
                    type: 'string',
                    label: 'Name of the first fighter'
                },
                {
                    key: 'fighterTwo',
                    prompt: 'What should fighter one be fighting?',
                    type: 'string',
                    label: 'Name of the second fighter'
                }
            ]
        });
    }

    async run(msg, args) {
        var fighterEmbed = new Discord.MessageEmbed();
        fighterEmbed
            .setColor("#be1931")
            .setTitle("🥊 Fight Results 🥊")
            .setThumbnail("http://i.imgur.com/LxPAE2f.png")

        if (args.fighterOne.toLowerCase() === 'chuck norris' || args.fighterTwo.toLowerCase() === 'chuck norris') {
            if (args.fighterOne.toLowerCase() === 'favna' || args.fighterTwo.toLowerCase() === 'favna') {
                fighterEmbed
                    .addField("All right, you asked for it...", '***The universe was destroyed due to this battle between two unstoppable forces. Good Job.***')
                    .setImage('https://i.imgur.com/Witob4j.png');
            } else {
                fighterEmbed
                    .addField('You fokn wot m8', '***Chuck Norris cannot be beaten***')
                    .setImage('https://i.imgur.com/WCFyXRr.png');
            }
            return msg.embed(fighterEmbed);
        }
        if (args.fighterOne.toLowerCase() === 'favna' || args.fighterTwo.toLowerCase() === 'favna') {
            fighterEmbed
                .addField('You got mega rekt', '***Favna always wins***')
                .setImage('https://i.imgur.com/XRsLP7Q.gif');
            return msg.embed(fighterEmbed);
        }
        random.integers({
            number: 2
        }, function (error, data) {
            let fighterOneChance = parseInt(data[0]);
            let fighterTwoChance = parseInt(data[1]);
            let winner = Math.max(fighterOneChance, fighterTwoChance) === fighterOneChance ? args.fighterOne : args.fighterTwo;
            let loser = Math.min(fighterOneChance, fighterTwoChance) === fighterOneChance ? args.fighterOne : args.fighterTwo;

            fighterEmbed
                .addField("🇼 Winner", `**${winner}**`, true)
                .addField("🇱 Loser", `**${loser}**`, true)
                .setFooter(`${winner} bodied ${loser} on ${moment().format('MMMM Do YYYY | HH:mm:ss')}`);
            return msg.embed(fighterEmbed);
        });
    };
};