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
const items = require(path.join(__dirname, 'data/items.js')).BattleItems;
const commando = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class itemCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'item',
            group: 'pokedex',
            aliases: ['it', 'bag'],
            memberName: 'item',
            description: 'Get the info on an item in Pokémon',
            examples: ['item {Item Name}', 'item Life Orb'],
            guildOnly: false,

            args: [{
                key: 'item',
                prompt: 'Get info on which item?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        var item;
        for (var i = 0; i < Object.keys(items).length; i++) {
            if (items[Object.keys(items)[i]].id.toLowerCase() == args.item.toLowerCase().replace(" ", "").replace("'", "")) {
                item = items[Object.keys(items)[i]];
                break;
            }
        }

        if (item) {
            const itemEmbed = new Discord.RichEmbed();
            itemEmbed
                .setColor('#FF0000')
                .addField('Description', item.desc)
                .addField('Generation Introduced', item.gen)
                .addField('External Resources', `[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/${capitalizeFirstLetter(item.name.replace(" ", "_").replace("'", ""))})  |  [Smogon](http://www.smogon.com/dex/sm/items/${item.name.toLowerCase().replace(" ", "_").replace("'", "")})  |  [PokémonDB](http://pokemondb.net/item/${item.name.toLowerCase().replace(" ", "-").replace("'", "")})`)
                .setThumbnail(`https://play.pokemonshowdown.com/sprites/itemicons/${item.name.toLowerCase().replace(" ", "-")}.png`)
            msg.embed(itemEmbed, `**${capitalizeFirstLetter(item.name)}**`);
        }
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}