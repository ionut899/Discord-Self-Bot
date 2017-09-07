// Copyright (C) 2017 110Percent
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For source to Beheeyem see: https://github.com/110Percent

const path = require('path');
const moves = require(path.join(__dirname, 'data/moves.js')).BattleMovedex;
const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class moveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'move',
            group: 'pokedex',
            aliases: ['attack'],
            memberName: 'move',
            description: 'Get the info on a Pokémon move',
            examples: ['move {Pokémon Move Name}', 'move Dragon Dance'],
            guildOnly: false,

            args: [{
                key: 'move',
                prompt: 'Get info on which move?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var moveName = args.move.toLowerCase();

        var move = moves[moveName];
        if (!move) {
            for (var i = 0; i < Object.keys(moves).length; i++) {
                if (moves[Object.keys(moves)[i]].num == moveName) {
                    move = moves[Object.keys(moves)[i]];
                    break;
                }
            }
        }
        if (!move) {
            for (var i = 0; i < Object.keys(moves).length; i++) {
                if (moves[Object.keys(moves)[i]].name.toLowerCase() == moveName) {
                    move = moves[Object.keys(moves)[i]];
                    break;
                }
            }
        }
        if (move) {
            moveName = move.name;
            var descString;
            if (move.desc) {
                descString = move.desc;
            } else {
                descString = move.shortDesc;
            }
            var accuracyString;
            if (move.accuracy == true) {
                accuracyString = "Certain Success";
            } else {
                accuracyString = move.accuracy;
            }
            var viableString;
            if (move.isViable) {
                viableString = "Yes";
            } else {
                viableString = "No";
            }
            var targetString;
            if (move.target == "normal") {
                targetString = "One Enemy";
            } else {
                targetString = capitalizeFirstLetter(move.target.replace(/([A-Z])/g, ' $1'));
            }
            var crystalString;
            if (move.isZ) {
                crystalString = `${capitalizeFirstLetter(move.isZ.substring(0, move.isZ.length - 1))}Z`;
            } else {
                crystalString = "None";
            }
            var embedObject = {
                color: 16711680,
                fields: [{
                        name: "Description",
                        value: descString
                    },
                    {
                        name: "Type",
                        value: move.type,
                        inline: true
                    },
                    {
                        name: "Base Power",
                        value: move.basePower,
                        inline: true
                    },
                    {
                        name: "PP",
                        value: move.pp,
                        inline: true
                    },
                    {
                        name: "Category",
                        value: move.category,
                        inline: true
                    },
                    {
                        name: "Accuracy",
                        value: accuracyString,
                        inline: true
                    },
                    {
                        name: "Viable?",
                        value: viableString,
                        inline: true
                    },
                    {
                        name: "Priority",
                        value: move.priority,
                        inline: true
                    },
                    {
                        name: "Target",
                        value: targetString,
                        inline: true
                    },
                    {
                        name: "Z-Crystal",
                        value: crystalString,
                        inline: true
                    },
                    {
                        name: "External Resources",
                        value: `[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/${move.name.replace(" ", "_")}_(move\\))  |  [Smogon](http://www.smogon.com/dex/sm/moves/${move.name.replace(" ", "_")})  |  [PokémonDB](http://pokemondb.net/move/${move.name.replace(" ", "-")})`
                    }
                ],
            };
            msg.embed(embedObject, `**${capitalizeFirstLetter(move.name)}**`)
        }
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}