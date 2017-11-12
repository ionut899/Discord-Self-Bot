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
const abilities = require(path.join(__dirname, 'data/abilities.js')).BattleAbilities;
const commando = require('discord.js-commando');
const Discord = require("discord.js");
const match = new Matcher(Object.keys(abilities).join(' '));

module.exports = class abilityCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ability',
            group: 'pokedex',
            aliases: ['abilities', 'abi'],
            memberName: 'ability',
            description: 'Get the info on a Pokémon ability',
            examples: ['ability {ability name}', 'ability Multiscale'],
            guildOnly: false,

            args: [{
                key: 'ability',
                prompt: 'Get info on which ability?',
                type: 'string',
                label: 'Ability to find'
            }]
        });
    }

    async run(msg, args) {
        for (var i = 0; i < Object.keys(abilities).length; i++) {
            if (abilities[Object.keys(abilities)[i]].name.toLowerCase() == args.ability.toLowerCase()) {
                var ability = abilities[Object.keys(abilities)[i]];
                break;
            }
        };

        let abilityDesc = ability.desc !== undefined ? ability.desc : ability.shortDesc

        if (ability) {
            const abilityEmbed = new Discord.MessageEmbed();

            abilityEmbed
                .setColor('#0088FF')
                .addField('Description', abilityDesc)
                .addField('External Resource', `[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/${capitalizeFirstLetter(ability.name.replace(" ", "_"))}_(Ability\\))  |  [Smogon](http://www.smogon.com/dex/sm/abilities/${ability.name.toLowerCase().replace(" ", "_")})  |  [PokémonDB](http://pokemondb.net/ability/${ability.name.toLowerCase().replace(" ", "-")})`);

            msg.embed(abilityEmbed, `**${capitalizeFirstLetter(ability.name)}**`);
        } else {
            let dym = match.get(args.ability);
            let dymString = dym !== null ? `Did you mean \`${dym}\`?` : 'Maybe you misspelt the ability?';
            msg.channel.send("⚠ Ability not found! " + dymString);
        }
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}