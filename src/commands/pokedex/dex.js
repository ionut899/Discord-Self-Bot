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
const dex = require(path.join(__dirname, 'data/pokedex.js')).BattlePokedex;
const dexEntries = require(path.join(__dirname, 'data/flavorText.json'));
const abilities = require(path.join(__dirname, 'data/abilities.js')).BattleAbilities;
const commando = require('discord.js-commando');
const Discord = require("discord.js");
const match = new Matcher(Object.keys(dex).join(' '));

const embedColours = {
    Red: 16724530,
    Blue: 2456831,
    Yellow: 16773977,
    Green: 4128590,
    Black: 3289650,
    Brown: 10702874,
    Purple: 10894824,
    Gray: 9868950,
    White: 14803425,
    Pink: 16737701
};

module.exports = class dexCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dex',
            group: 'pokedex',
            aliases: ['pokedex', 'dexfind'],
            memberName: 'dex',
            description: 'Get the info on a Pokémon',
            examples: ['dex {Pokemon Name}', 'dex Dragonite'],
            guildOnly: false,

            args: [{
                key: 'pokemon',
                prompt: 'Get info from which Pokémon?',
                type: 'string',
                label: 'Pokemon to find'
            }]
        });
    }

    async run(msg, args) {
        
        var poke = args.pokemon.toLowerCase();
        if (poke.split(" ")[0] == "mega") {
            poke = poke.substring(poke.split(" ")[0].length + 1) + "mega";
        }
        var pokeEntry = dex[poke];
        if (!pokeEntry) {
            for (var i = 0; i < Object.keys(dex).length; i++) {
                if (dex[Object.keys(dex)[i]].num == Number(poke)) {
                    poke = dex[Object.keys(dex)[i]].species.toLowerCase();
                    pokeEntry = dex[poke];
                    break;
                }
            }
        }
        if (!pokeEntry) {
            for (var i = 0; i < Object.keys(dex).length; i++) {
                if (dex[Object.keys(dex)[i]].species.toLowerCase() == poke) {
                    pokeEntry = dex[Object.keys(dex)[i]];
                    break;
                }
            }
        }
        if (pokeEntry) {
            poke = pokeEntry.species;
            var evoLine = "**" + capitalizeFirstLetter(poke) + "**";
            var preEvos = "";
            if (pokeEntry.prevo) {
                preEvos = preEvos + capitalizeFirstLetter(pokeEntry.prevo) + " > ";
                var preEntry = dex[pokeEntry.prevo];
                if (preEntry.prevo) {
                    preEvos = capitalizeFirstLetter(preEntry.prevo) + " > " + preEvos;
                }
                evoLine = preEvos + evoLine;
            }
            var evos = ""
            if (pokeEntry.evos) {
                evos = evos + " > " + pokeEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                if (pokeEntry.evos.length < 2) {
                    var evoEntry = dex[pokeEntry.evos[0]];
                    if (evoEntry.evos) {
                        evos = evos + " > " + evoEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                    }
                }
                evoLine = evoLine + evos;
            }
            if (!pokeEntry.prevo && !pokeEntry.evos) {
                evoLine = evoLine + " (No Evolutions)";
            }
            var typestring = "Type";
            if (pokeEntry.types.length > 1) {
                typestring += "s";
            }
            var abilityString = pokeEntry.abilities[0];
            for (var i = 1; i < Object.keys(pokeEntry.abilities).length; i++) {
                if (Object.keys(pokeEntry.abilities)[i] == 'H') {
                    abilityString = abilityString + ", *" + pokeEntry.abilities['H'] + "*";
                } else {
                    abilityString = abilityString + ", " + pokeEntry.abilities[i];
                }
            }

            for (var i = 0; i < dexEntries.length; i++) {
                if (dexEntries[i].species_id == pokeEntry.num) {
                    var pokedexEntry = "*" + dexEntries[i].flavor_text + "*";
                    break;
                }
            }
            if (!pokedexEntry) {
                var pokedexEntry = "*PokéDex data not found for this Pokémon*";
            }

            const dexEmbed = new Discord.MessageEmbed();
            dexEmbed
                .setColor(embedColours[pokeEntry.color])
                .setAuthor(`#${pokeEntry.num} - ${capitalizeFirstLetter(poke)}`, `https://cdn.rawgit.com/msikma/pokesprite/master/icons/pokemon/regular/${poke.replace(" ", "_").toLowerCase()}.png`)
                .addField(typestring, pokeEntry.types.join(", "), true)
                .addField('Abilities', abilityString, true)
                .addField('Height', `${pokeEntry.heightm}m`, true)
                .addField('Weight', `${pokeEntry.weightkg}kg`, true)
                .addField('Egg Groups', pokeEntry.eggGroups.join(', '), true)
            pokeEntry.otherFormes !== undefined ? dexEmbed.addField('Other Formes', pokeEntry.otherFormes.join(', '), true) : null;
            dexEmbed
                .addField('Evolutionary Line', evoLine, false)
                .addField('Base Stats', Object.keys(pokeEntry.baseStats).map(i => i.toUpperCase() + ": **" + pokeEntry.baseStats[i] + "**").join(", "))
                .addField('PokéDex Data', pokedexEntry)
                .addField('External Resource', `[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/${capitalizeFirstLetter(poke).replace(" ", "_")}_(Pokémon\\))  |  [Smogon](http://www.smogon.com/dex/sm/pokemon/${poke.replace(" ", "_")})  |  [PokémonDB](http://pokemondb.net/pokedex/${poke.replace(" ", "-")})`)
                .setThumbnail(`https://play.pokemonshowdown.com/sprites/xyani/${poke.toLowerCase().replace(" ", "")}.gif`)

            msg.embed(dexEmbed)
        } else {
            let dym = match.get(args.pokemon);
            let dymString = dym !== null ? `Did you mean \`${dym}\`?` : 'Maybe you misspelt the Pokémon\'s name?';
            msg.reply(`⚠ Dex entry not found! ${dymString}`);
        }
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}