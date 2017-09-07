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

module.exports = class embedCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'misc',
            aliases: ['emb'],
            memberName: 'embed',
            description: 'Create custom RichEmbeds on the fly',
            examples: ['embed {FieldName>Value1;Value2<FieldName2>Value1;Value2... etc}', 'embed What goes up but never comes down?>Your Age'],
            guildOnly: false,

            args: [{
                key: 'embedContent',
                prompt: 'What should the content of the embed be?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        let paramString = args.embedContent
        let customEmbed = new Discord.RichEmbed();

        let fields = paramString.split('<');
        fields.forEach(field => {
            let chunks = field.split('>');
            let header = chunks[0];
            let values = chunks[1].split(';');
            customEmbed.addField(header, values.join('\n'), true);
        });

        customEmbed.setColor("#e52431")
        await msg.embed(customEmbed)
        await msg.delete()
    }
};