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
const Matcher = require('did-you-mean');
const moves = require(path.join(__dirname, 'data/moves.js')).BattleMovedex;
const commando = require('discord.js-commando');
const Discord = require("discord.js");
const match = new Matcher(Object.keys(moves).join(' '));

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

            let descString = move.desc ? move.desc : move.shortDesc;
            let accuracyString = move.accuracy ? "Certain Success" : move.accuracy;
            let targetString = move.target == 'normal' ? 'One Enemy' : capitalizeFirstLetter(move.target.replace(/([A-Z])/g, ' $1'))
            let crystalString = move.isZ ? `${capitalizeFirstLetter(move.isZ.substring(0, move.isZ.length - 1))}Z` : "None";
            const moveEmbed = new Discord.RichEmbed();

            moveEmbed
                .setColor('#FF0000')
                .addField('Description', descString)
                .addField('Type', move.type, true)
                .addField('Base Power', move.basePower, true)
                .addField('PP', move.pp, true)
                .addField('Category', move.category, true)
                .addField('Accuracy', move.accuracy, true)
                .addField('Priority', move.priority, true)
                .addField('Target', targetString, true)
                .addField('Contest Condition', move.contest, true)
                .addField('Z-Crystal', crystalString, true)
                .addField('External Resources', `[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/${move.name.replace(" ", "_")}_(move\\))  |  [Smogon](http://www.smogon.com/dex/sm/moves/${move.name.replace(" ", "_")})  |  [PokémonDB](http://pokemondb.net/move/${move.name.replace(" ", "-")})`);
            msg.embed(moveEmbed, `**${capitalizeFirstLetter(move.name)}**`)
        } else {
            let dym = match.get(args.move);
            let dymString = dym !== null ? `Did you mean \`${dym}\`?` : 'Maybe you misspelt the move name?';
            msg.channel.send("⚠ Move not found! " + dymString);
        }
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}